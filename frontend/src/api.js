// Camada offline-first: leituras com cache local + fila de escritas sincronizada ao reconectar.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3333';
const K = { token: 'cf_token', queue: 'cf_queue', cache: 'cf_cache' };
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

export const getToken = () => localStorage.getItem(K.token);
export const logout = () => { localStorage.removeItem(K.token); location.reload(); };
export const pending = () => read(K.queue, []).length;

async function raw(method, path, body) {
  const r = await fetch(BASE + path, {
    method, body: body && JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', ...(getToken() && { Authorization: 'Bearer ' + getToken() }) },
  });
  if (r.status === 401 && getToken()) return logout();
  if (!r.ok) throw Object.assign(new Error((await r.json().catch(() => ({}))).error || 'Erro na requisição'), { http: true });
  return r.status === 204 ? null : r.json();
}

export async function login(mode, email, password) {
  const { token } = await raw('POST', '/api/auth/' + mode, { email, password });
  localStorage.setItem(K.token, token);
}

// Aplica operações ainda não sincronizadas sobre a lista em cache (para mostrar o que foi feito offline)
const overlay = list => read(K.queue, []).reduce((l, op) => {
  if (!op.path.startsWith('/api/transactions')) return l;
  const id = op.path.split('/')[3];
  if (op.method === 'POST') return [op.body, ...l];
  if (op.method === 'DELETE') return l.filter(t => t.id !== id);
  if (op.method === 'PUT') return l.map(t => (t.id === id ? { ...t, ...op.body } : t));
  return l;
}, list);

export async function get(path) {
  const cache = read(K.cache, {});
  try {
    const data = await raw('GET', path);
    write(K.cache, { ...cache, [path]: data });
    return { data, offline: false };
  } catch (e) {
    if (e.http || !(path in cache)) throw e;
    return { data: path.startsWith('/api/transactions') ? overlay(cache[path]) : cache[path], offline: true };
  }
}

export async function mutate(method, path, body) {
  try { return await raw(method, path, body); }
  catch (e) {
    if (e.http) throw e;
    write(K.queue, [...read(K.queue, []), { method, path, body }]);
    window.dispatchEvent(new Event('cf-queue'));
    return { queued: true };
  }
}

export async function flush() {
  let q = read(K.queue, []);
  while (q.length) {
    try { await raw(q[0].method, q[0].path, q[0].body); } catch (e) { if (!e.http) break; }
    q = q.slice(1); write(K.queue, q);
  }
  window.dispatchEvent(new Event('cf-queue'));
}
