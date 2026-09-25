import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { get } from '../api';
import { brl, ym, today } from '../lib';
import { articles } from '../articles';

export default function Dashboard({ onOpenArticle }) {
  const [month, setMonth] = useState(ym()), [s, setS] = useState(), [fc, setFc] = useState([]), [hist, setHist] = useState([]), [off, setOff] = useState(false);
  useEffect(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 5);
    Promise.all([get('/api/summary?month=' + month), get('/api/forecast?months=6'), get(`/api/report?from=${ym(d)}-01&to=${today()}`)])
      .then(([a, b, c]) => { setS(a.data); setFc(b.data); setHist(c.data.byMonth); setOff(a.offline); }).catch(() => {});
  }, [month]);
  if (!s) return <p className="muted">Carregando dados…</p>;
  const cards = [['Saldo atual', s.balance], ['Receitas do mês', s.income], ['Despesas do mês', s.expense], ['Resultado do mês', s.income - s.expense]];
  const fmt = v => brl(v);
  const net = hist.map(h => ({ month: h.month, net: h.income - h.expense }));
  const topCats = s.byCategory.slice(0, 6);

  return (
    <>
      <header className="top"><h1>Dashboard</h1><input type="month" value={month} onChange={e => setMonth(e.target.value)} /></header>
      {off && <div className="banner">Sem conexão: exibindo os últimos dados salvos.</div>}

      <section className="cards">
        {cards.map(([t, v]) => <div className="card" key={t}><span>{t}</span><strong className={v < 0 ? 'neg' : ''}>{brl(v)}</strong></div>)}
      </section>

      <section className="grid">
        <div className="card"><h3>Receitas e despesas nos últimos 6 meses</h3>
          <ResponsiveContainer height={240}><BarChart data={hist}><CartesianGrid strokeDasharray="3 3" stroke="#d8dee9" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={fmt} />
            <Bar dataKey="income" name="Receitas" fill="#0f766e" /><Bar dataKey="expense" name="Despesas" fill="#c2410c" /></BarChart></ResponsiveContainer></div>

        <div className="card"><h3>Gastos por categoria</h3>
          {s.byCategory.length ? <ResponsiveContainer height={240}><PieChart><Pie data={s.byCategory} dataKey="total" nameKey="name" innerRadius={50} outerRadius={85}>
            {s.byCategory.map(c => <Cell key={c.name} fill={c.color} />)}</Pie><Tooltip formatter={fmt} /></PieChart></ResponsiveContainer>
            : <p className="muted">Nenhuma despesa neste mês. Adicione uma em Transações.</p>}</div>

        <div className="card"><h3>Resultado mensal (receita − despesa)</h3>
          <ResponsiveContainer height={240}><LineChart data={net}><CartesianGrid strokeDasharray="3 3" stroke="#d8dee9" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={fmt} />
            <Line type="monotone" dataKey="net" name="Resultado" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div>

        <div className="card"><h3>Top categorias de gasto no mês</h3>
          {topCats.length ? <ResponsiveContainer height={240}><BarChart data={topCats} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d8dee9" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={110} /><Tooltip formatter={fmt} />
            <Bar dataKey="total" name="Gasto" radius={[0, 4, 4, 0]}>{topCats.map(c => <Cell key={c.name} fill={c.color} />)}</Bar></BarChart></ResponsiveContainer>
            : <p className="muted">Sem despesas para ranquear neste mês.</p>}</div>

        <div className="card wide"><h3>Projeção do saldo (média dos últimos 3 meses + lançamentos agendados)</h3>
          <ResponsiveContainer height={220}><AreaChart data={fc}><CartesianGrid strokeDasharray="3 3" stroke="#d8dee9" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={fmt} />
            <Area dataKey="balance" name="Saldo" stroke="#14213d" fill="#14213d22" /></AreaChart></ResponsiveContainer></div>
      </section>

      <section className="articles">
        <h2>Dicas &amp; artigos</h2>
        <div className="article-grid">
          {articles.map(a => (
            <div className="card article-card" key={a.slug}>
              <span className="tag">{a.tag} · {a.readTime}</span>
              <h4>{a.title}</h4>
              <p>{a.excerpt}</p>
              <button onClick={() => onOpenArticle(a)}>Ler mais →</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
