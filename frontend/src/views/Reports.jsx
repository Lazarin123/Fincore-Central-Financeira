import { useEffect, useState } from 'react';
import { get } from '../api';
import { brl, today, exportCSV, exportPDF } from '../lib';

export default function Reports() {
  const [from, setFrom] = useState(`${new Date().getFullYear()}-01-01`), [to, setTo] = useState(today());
  const [r, setR] = useState(), [cats, setCats] = useState({}), [err, setErr] = useState('');
  useEffect(() => {
    Promise.all([get(`/api/report?from=${from}&to=${to}`), get('/api/categories')])
      .then(([a, c]) => { setR(a.data); setCats(Object.fromEntries(c.data.map(x => [x.id, x]))); setErr(''); })
      .catch(() => setErr('Sem conexão e sem dados salvos para este período.'));
  }, [from, to]);
  const name = `relatorio_${from}_${to}`;
  return (
    <>
      <header className="top"><h1>Relatórios</h1>
        <div className="row"><input type="date" value={from} onChange={e => setFrom(e.target.value)} /><input type="date" value={to} onChange={e => setTo(e.target.value)} /></div></header>
      {err && <p className="neg">{err}</p>}
      {r && <>
        <section className="cards">{[['Receitas', r.totals.income], ['Despesas', r.totals.expense], ['Resultado', r.totals.net]].map(([t, v]) =>
          <div className="card" key={t}><span>{t}</span><strong className={v < 0 ? 'neg' : ''}>{brl(v)}</strong></div>)}</section>
        <div className="row" style={{ justifyContent: 'flex-start', marginBottom: 14 }}>
          <button onClick={() => exportPDF(r, cats, name)}>Exportar PDF</button>
          <button onClick={() => exportCSV(r.transactions, cats, name)}>Exportar CSV</button>
        </div>
        <div className="card"><h3>Despesas por categoria</h3>
          <table><tbody>{r.byCategory.map(c => <tr key={c.name}><td>{c.name}</td><td>{brl(c.total)}</td></tr>)}</tbody></table></div>
      </>}
    </>
  );
}
