import { useEffect, useState } from 'react';
import { get, mutate } from '../api';
import { brl } from '../lib';

function Goal({ g, reload }) {
  const [v, setV] = useState('');
  const pct = Math.min(100, (g.saved / g.target) * 100);
  const add = async () => { if (+v > 0) { await mutate('PUT', '/api/goals/' + g.id, { saved: g.saved + +v }); setV(''); reload(); } };
  return (
    <div className="card">
      <div className="row"><h3>{g.name}</h3><button className="ghost" onClick={async () => { await mutate('DELETE', '/api/goals/' + g.id); reload(); }}>Excluir</button></div>
      <div className="bar"><i style={{ width: pct + '%' }} /></div>
      <p className="muted">{brl(g.saved)} de {brl(g.target)} ({pct.toFixed(0)}%)</p>
      <div className="row"><input type="number" min="0" placeholder="Valor guardado (R$)" value={v} onChange={e => setV(e.target.value)} /><button onClick={add}>Guardar</button></div>
    </div>
  );
}

export default function Goals() {
  const [goals, setGoals] = useState([]), [f, setF] = useState({ name: '', target: '' });
  const load = () => get('/api/goals').then(r => setGoals(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);
  const add = async e => { e.preventDefault(); await mutate('POST', '/api/goals', { name: f.name, target: Number(f.target) }); setF({ name: '', target: '' }); load(); };
  return (
    <>
      <header className="top"><h1>Metas</h1></header>
      <form className="card form" onSubmit={add}>
        <input required placeholder="Nome da meta (ex.: Reserva de emergência)" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
        <input required type="number" min="1" placeholder="Valor alvo (R$)" value={f.target} onChange={e => setF({ ...f, target: e.target.value })} />
        <button>Criar meta</button>
      </form>
      <section className="grid">{goals.map(g => <Goal key={g.id} g={g} reload={load} />)}</section>
      {goals.length === 0 && <p className="muted">Você ainda não tem metas. Crie a primeira acima.</p>}
    </>
  );
}
