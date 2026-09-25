import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const brl = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const today = () => new Date().toLocaleDateString('sv-SE');
export const ym = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const rows = (list, cats) => list.map(t => [t.date, t.type === 'income' ? 'Receita' : 'Despesa', t.description, cats[t.category_id]?.name || '-', t.amount]);

export function exportCSV(list, cats, name) {
  const csv = [['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor'], ...rows(list, cats).map(r => [...r.slice(0, 4), String(r[4]).replace('.', ',')])]
    .map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  a.download = name + '.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function exportPDF(report, cats, name) {
  const d = new jsPDF();
  d.setFontSize(16); d.text('Relatório Financeiro', 14, 18);
  d.setFontSize(10);
  d.text(`Período: ${report.period.from} a ${report.period.to}`, 14, 25);
  d.text(`Receitas: ${brl(report.totals.income)}   Despesas: ${brl(report.totals.expense)}   Resultado: ${brl(report.totals.net)}`, 14, 32);
  autoTable(d, { startY: 38, head: [['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor']], body: rows(report.transactions, cats).map(r => [...r.slice(0, 4), brl(r[4])]), headStyles: { fillColor: [20, 33, 61] } });
  d.save(name + '.pdf');
}
