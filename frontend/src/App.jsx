import { useEffect, useState } from 'react';
import { getToken, login, logout, flush, pending } from './api';
import Dashboard from './views/Dashboard';
import Transactions from './views/Transactions';
import Goals from './views/Goals';
import Reports from './views/Reports';
import Article from './views/Article';

const TABS = [['dash', 'Dashboard', Dashboard], ['tx', 'Transações', Transactions], ['goals', 'Metas', Goals], ['rep', 'Relatórios', Reports]];

function Login({ onDone }) {
  const [mode, setMode] = useState('login'), [email, setEmail] = useState(''), [password, setPassword] = useState(''), [err, setErr] = useState('');
  const go = async e => {
    e.preventDefault();
    try { await login(mode, email, password); onDone(); }
    catch (x) { setErr(x.http ? x.message : 'Não foi possível conectar ao servidor. Verifique sua internet.'); }
  };
  return (
    <div className="login">
      <form className="card" onSubmit={go}>
        <h1>Central Financeira</h1>
        <input required type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
        <input required type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
        <button>{mode === 'login' ? 'Entrar' : 'Criar conta'}</button>
        {err && <p className="neg">{err}</p>}
        <a onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Ainda não tenho conta' : 'Já tenho conta'}</a>
      </form>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(!!getToken()), [tab, setTab] = useState('dash');
  const [online, setOnline] = useState(navigator.onLine), [queued, setQueued] = useState(pending()), [rev, setRev] = useState(0);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const sync = () => flush().then(() => setRev(r => r + 1));
    const up = () => { setOnline(true); sync(); }, down = () => setOnline(false), q = () => setQueued(pending());
    addEventListener('online', up); addEventListener('offline', down); addEventListener('cf-queue', q);
    if (authed && navigator.onLine) sync();
    return () => { removeEventListener('online', up); removeEventListener('offline', down); removeEventListener('cf-queue', q); };
  }, [authed]);

  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  const View = TABS.find(t => t[0] === tab)[2];
  return (
    <div className="app">
      <aside>
        <h2>Central Financeira</h2>
        {TABS.map(([id, label]) => <button key={id} className={tab === id && !article ? 'on' : ''} onClick={() => { setTab(id); setArticle(null); }}>{label}</button>)}
        <div className="status">
          {online ? 'Online' : 'Offline'}{queued > 0 && ` · ${queued} alteração(ões) a sincronizar`}
          <button className="ghost" onClick={logout}>Sair</button>
        </div>
      </aside>
      <main>{article ? <Article article={article} onBack={() => setArticle(null)} /> : <View key={tab + rev} onOpenArticle={setArticle} />}</main>
    </div>
  );
}
