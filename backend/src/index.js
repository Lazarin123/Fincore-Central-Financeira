import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { q } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

const ym = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const wrap = fn => (req, res) => fn(req, res).catch(e => { console.error(e); res.status(500).json({ error: 'Erro interno' }); });
const sign = u => jwt.sign({ id: u.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
const auth = (req, res, next) => {
  try { req.uid = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), process.env.JWT_SECRET).id; next(); }
  catch { res.status(401).json({ error: 'Não autorizado' }); }
};
const NET = `CASE WHEN type='income' THEN amount ELSE -amount END`;

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.post('/api/auth/register', wrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) return res.status(400).json({ error: 'Informe e-mail e senha (mínimo 6 caracteres)' });
  const [u] = await q('INSERT INTO users(email,password_hash) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING id', [email.toLowerCase(), await bcrypt.hash(password, 10)]);
  if (!u) return res.status(409).json({ error: 'E-mail já cadastrado' });
  await q(`INSERT INTO categories(user_id,name,color) VALUES ($1,'Moradia','#14213d'),($1,'Alimentação','#c2410c'),($1,'Transporte','#0f766e'),($1,'Lazer','#a21caf'),($1,'Salário','#15803d')`, [u.id]);
  res.json({ token: sign(u) });
}));
app.post('/api/auth/login', wrap(async (req, res) => {
  const [u] = await q('SELECT * FROM users WHERE email=$1', [(req.body.email || '').toLowerCase()]);
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password_hash))) return res.status(401).json({ error: 'E-mail ou senha incorretos' });
  res.json({ token: sign(u) });
}));

app.use('/api', auth);

// Categorias
app.get('/api/categories', wrap(async (req, res) => res.json(await q('SELECT * FROM categories WHERE user_id=$1 ORDER BY name', [req.uid]))));
app.post('/api/categories', wrap(async (req, res) => {
  const [c] = await q('INSERT INTO categories(user_id,name,color) VALUES($1,$2,$3) RETURNING *', [req.uid, req.body.name, req.body.color || '#64748b']);
  res.status(201).json(c);
}));

// Transações (POST idempotente: aceita id gerado no cliente)
app.get('/api/transactions', wrap(async (req, res) => {
  const { from, to, type } = req.query;
  res.json(await q(`SELECT * FROM transactions WHERE user_id=$1 AND ($2::date IS NULL OR date>=$2) AND ($3::date IS NULL OR date<=$3)
    AND ($4::text IS NULL OR type=$4) ORDER BY date DESC, created_at DESC LIMIT 500`, [req.uid, from || null, to || null, type || null]));
}));
app.post('/api/transactions', wrap(async (req, res) => {
  const { id, type, amount, description, category_id, date } = req.body;
  if (!['income', 'expense'].includes(type) || !(amount > 0) || !date) return res.status(400).json({ error: 'Dados da transação inválidos' });
  const [t] = await q(`INSERT INTO transactions(id,user_id,type,amount,description,category_id,date)
    VALUES(COALESCE($1::uuid,gen_random_uuid()),$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING RETURNING *`,
    [id || null, req.uid, type, amount, description || '', category_id || null, date]);
  res.status(201).json(t || { id });
}));
app.put('/api/transactions/:id', wrap(async (req, res) => {
  const { type, amount, description, category_id, date } = req.body;
  const [t] = await q('UPDATE transactions SET type=$3,amount=$4,description=$5,category_id=$6,date=$7 WHERE id=$1 AND user_id=$2 RETURNING *',
    [req.params.id, req.uid, type, amount, description, category_id || null, date]);
  t ? res.json(t) : res.status(404).json({ error: 'Transação não encontrada' });
}));
app.delete('/api/transactions/:id', wrap(async (req, res) => {
  await q('DELETE FROM transactions WHERE id=$1 AND user_id=$2', [req.params.id, req.uid]);
  res.status(204).end();
}));

// Resumo do mês: totais, saldo atual e gastos por categoria
app.get('/api/summary', wrap(async (req, res) => {
  const month = req.query.month || ym(new Date()), start = `${month}-01`;
  const [tot] = await q(`SELECT COALESCE(SUM(amount) FILTER (WHERE type='income'),0) income, COALESCE(SUM(amount) FILTER (WHERE type='expense'),0) expense
    FROM transactions WHERE user_id=$1 AND date>=$2::date AND date<$2::date+interval '1 month'`, [req.uid, start]);
  const [bal] = await q(`SELECT COALESCE(SUM(${NET}),0) v FROM transactions WHERE user_id=$1 AND date<=CURRENT_DATE`, [req.uid]);
  const byCategory = await q(`SELECT COALESCE(c.name,'Sem categoria') name, COALESCE(c.color,'#94a3b8') color, SUM(t.amount) total
    FROM transactions t LEFT JOIN categories c ON c.id=t.category_id
    WHERE t.user_id=$1 AND t.type='expense' AND t.date>=$2::date AND t.date<$2::date+interval '1 month' GROUP BY 1,2 ORDER BY total DESC`, [req.uid, start]);
  res.json({ month, ...tot, balance: bal.v, byCategory });
}));

// Saldo futuro: saldo atual + média líquida dos últimos 3 meses + lançamentos agendados
app.get('/api/forecast', wrap(async (req, res) => {
  const n = Math.min(+req.query.months || 6, 24);
  const [b] = await q(`SELECT COALESCE(SUM(${NET}),0) v FROM transactions WHERE user_id=$1 AND date<=CURRENT_DATE`, [req.uid]);
  const [a] = await q(`SELECT COALESCE(SUM(${NET}),0)/3 v FROM transactions WHERE user_id=$1 AND date<=CURRENT_DATE AND date>CURRENT_DATE-interval '3 months'`, [req.uid]);
  const sched = Object.fromEntries((await q(`SELECT to_char(date,'YYYY-MM') m, SUM(${NET}) v FROM transactions WHERE user_id=$1 AND date>CURRENT_DATE GROUP BY 1`, [req.uid])).map(r => [r.m, r.v]));
  const now = new Date();
  let acc = b.v + (sched[ym(now)] || 0);
  const out = [{ month: ym(now), balance: +acc.toFixed(2) }];
  for (let i = 1; i <= n; i++) {
    const k = ym(new Date(now.getFullYear(), now.getMonth() + i, 1));
    acc += a.v + (sched[k] || 0);
    out.push({ month: k, balance: +acc.toFixed(2) });
  }
  res.json(out);
}));

// Relatório consolidado em JSON
app.get('/api/report', wrap(async (req, res) => {
  const { from, to } = req.query, p = [req.uid, from, to], W = `user_id=$1 AND date BETWEEN $2 AND $3`;
  const [totals] = await q(`SELECT COALESCE(SUM(amount) FILTER (WHERE type='income'),0) income, COALESCE(SUM(amount) FILTER (WHERE type='expense'),0) expense FROM transactions WHERE ${W}`, p);
  const byMonth = await q(`SELECT to_char(date,'YYYY-MM') AS month, COALESCE(SUM(amount) FILTER (WHERE type='income'),0) income, COALESCE(SUM(amount) FILTER (WHERE type='expense'),0) expense FROM transactions WHERE ${W} GROUP BY 1 ORDER BY 1`, p);
  const byCategory = await q(`SELECT COALESCE(c.name,'Sem categoria') name, SUM(t.amount) total FROM transactions t LEFT JOIN categories c ON c.id=t.category_id
    WHERE t.user_id=$1 AND t.type='expense' AND t.date BETWEEN $2 AND $3 GROUP BY 1 ORDER BY total DESC`, p);
  const transactions = await q(`SELECT * FROM transactions WHERE ${W} ORDER BY date DESC`, p);
  res.json({ period: { from, to }, totals: { ...totals, net: totals.income - totals.expense }, byMonth, byCategory, transactions });
}));

// Metas
app.get('/api/goals', wrap(async (req, res) => res.json(await q('SELECT * FROM goals WHERE user_id=$1 ORDER BY created_at', [req.uid]))));
app.post('/api/goals', wrap(async (req, res) => res.status(201).json((await q('INSERT INTO goals(user_id,name,target) VALUES($1,$2,$3) RETURNING *', [req.uid, req.body.name, req.body.target]))[0])));
app.put('/api/goals/:id', wrap(async (req, res) => res.json((await q('UPDATE goals SET saved=$3 WHERE id=$1 AND user_id=$2 RETURNING *', [req.params.id, req.uid, req.body.saved]))[0])));
app.delete('/api/goals/:id', wrap(async (req, res) => { await q('DELETE FROM goals WHERE id=$1 AND user_id=$2', [req.params.id, req.uid]); res.status(204).end(); }));

app.listen(process.env.PORT || 3333, () => console.log('API no ar'));
