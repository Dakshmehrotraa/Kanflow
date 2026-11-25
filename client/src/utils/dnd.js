// Module-scoped drag state for native HTML5 drag-and-drop.
let drag = null;
export const setDrag = (d) => { drag = d; };
export const getDrag = () => drag;
export const clearDrag = () => { drag = null; };

// Given a cards container and a pointer Y, return the card _id to insert before
// (or null to append at the end).
export function insertBeforeId(container, y) {
  const els = [...container.querySelectorAll('[data-cardid]:not(.dragging)')];
  let closest = { offset: -Infinity, id: null };
  for (const el of els) {
    const box = el.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      closest = { offset, id: el.dataset.cardid };
    }
  }
  return closest.id;
}
