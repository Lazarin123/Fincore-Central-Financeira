export default function Article({ article, onBack }) {
  if (!article) return null;
  return (
    <div className="article-page">
      <button className="back-btn" onClick={onBack}>&larr; Voltar ao Dashboard</button>
      <span className="tag">{article.tag}</span>
      <h1>{article.title}</h1>
      <p className="meta">{article.readTime} de leitura</p>
      {article.content.map((p, i) => <p key={i}>{p}</p>)}
      <button className="back-btn" onClick={onBack}>&larr; Voltar ao Dashboard</button>
    </div>
  );
}
