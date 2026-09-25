import { useEffect, useState, useCallback } from 'react';
import { get, mutate } from '../api';
import { brl, today, exportCSV } from '../lib';

const empty = () => ({ type: 'expense', amount: '', description: '', category_id: '', date: today() });

export default function Transactions() {
  const [list, setList] = useState([]), [cats, setCats] = useState([]), [form, setForm] = useState(empty()), [err, setErr] = useState('');
  const load = useCallback(async () => {
    const [t, c] = await Promise.all([get('/api/transactions'), get('/api/categories')]);
    setList(t.data); setCats(c.data);
  }, []);
  useEffect(() => { load().catch(e => setErr(e.message)); }, [load]);
  const byId = Object.fromEntries(cats.map(c => [c.id, c]));
  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      await mutate('POST', '/api/transactions', { ...form, id: crypto.randomUUID(), amount: Number(form.amount), category_id: form.category_id ? Number(form.category_id) : null });
      setForm(empty()); setErr(''); await load();
    } catch (x) { setErr(x.message); }
  };
  const remove = async id => { await mutate('DELETE', '/api/transactions/' + id); load(); };

  return (
    <>
      <header className="top"><h1>Transações</h1><button onClick={() => exportCSV(list, byId, 'transacoes')}>Exportar CSV</button></header>
      <form className="card form" onSubmit={submit}>
        <select value={form.type} onChange={set('type')}><option value="expense">Despesa</option><option value="income">Receita</option></select>
        <input required type="number" step="0.01" min="0.01" placeholder="Valor" value={form.amount} onChange={set('amount')} />
        <input required placeholder="Descrição" value={form.description} onChange={set('description')} />
        <select value={form.category_id} onChange={set('category_id')}><option value="">Sem categoria</option>{cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <input required type="date" value={form.date} onChange={set('date')} />
        <button>Adicionar transação</button>
      </form>
      {err && <p className="neg">{err}</p>}
      <div className="card">
        {list.length === 0 ? <p className="muted">Nenhuma transação ainda. Preencha o formulário acima para começar.</p> : (
          <table><thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th><th /></tr></thead><tbody>
            {list.map(t => <tr key={t.id}><td>{t.date}</td><td>{t.description}</td><td>{byId[t.category_id]?.name || '-'}</td>
              <td className={t.type === 'income' ? 'pos' : 'neg'}>{t.type === 'income' ? '+' : '-'} {brl(t.amount)}</td>
              <td><button className="ghost" onClick={() => remove(t.id)}>Excluir</button></td></tr>)}
          </tbody></table>
        )}
      </div>
    </>
  );
}
