const AV = ['#6c5ce7', '#00b894', '#0984e3', '#e17055', '#e84393', '#fdcb6e', '#00cec9', '#a29bfe'];

export const avColor = (s) =>
  AV[[...(s || '?')].reduce((a, c) => a + c.charCodeAt(0), 0) % AV.length];

export const initialsOf = (name = '') =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

// Returns a due-date badge descriptor, or null when there is no due date.
export function dueInfo(due, isDone) {
  if (!due) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(due);
  d.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  const fmt = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  if (isDone) return { cls: 'done', txt: fmt };
  if (diff < 0) return { cls: 'over', txt: `${Math.abs(diff)}d overdue` };
  if (diff === 0) return { cls: 'soon', txt: 'Today' };
  if (diff <= 2) return { cls: 'soon', txt: `${diff}d left` };
  return { cls: '', txt: fmt };
}

export const PRIORITY_COLORS = {
  urgent: 'var(--p-urgent)',
  high: 'var(--p-high)',
  medium: 'var(--p-med)',
  low: 'var(--p-low)',
};
