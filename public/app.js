const $ = selector => document.querySelector(selector);
let products = [];
const selected = new Map();
let sending = false;

function renderProducts() {
  const search = $('#search').value.toLocaleLowerCase('es');
  const category = $('#category').value;
  const filtered = products.filter(p => (!category || p.category === category) && `${p.name} ${p.description}`.toLocaleLowerCase('es').includes(search));
  $('#products').replaceChildren(...filtered.map(p => {
    const card = document.createElement('article'); card.className = 'card';
    const img = document.createElement('img'); img.src = p.image; img.alt = p.name; img.width = 400; img.height = 280; img.loading = 'lazy';
    const content = document.createElement('div'); content.className = 'card-content';
    const categoryLabel = document.createElement('span'); categoryLabel.className = 'category'; categoryLabel.textContent = p.category;
    const title = document.createElement('h3'); title.textContent = p.name;
    const description = document.createElement('p'); description.textContent = p.description;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'product-button'; button.disabled = sending;
    button.textContent = selected.has(p.id) ? '✓ Agregado · Ver solicitud' : 'Solicitar cotización +';
    button.addEventListener('click', () => { if (!selected.has(p.id)) selected.set(p.id, 1); showForm(); renderSelection(); renderProducts(); $('#cotizacion').scrollIntoView({ behavior: 'smooth' }); });
    content.append(categoryLabel, title, description, button); card.append(img, content); return card;
  }));
  $('#catalog-status').textContent = filtered.length ? `${filtered.length} productos disponibles` : 'No encontramos productos. Prueba otra búsqueda.';
}
function renderSelection() {
  $('#count').textContent = selected.size;
  $('#selection').replaceChildren();
  if (!selected.size) { const p = document.createElement('p'); p.className = 'empty'; p.textContent = 'Tu solicitud está vacía. Elige productos del catálogo para comenzar.'; $('#selection').append(p); return; }
  for (const [id, quantity] of selected) {
    const row = document.createElement('div'); row.className = 'selection-row';
    const name = document.createElement('span'); name.textContent = products.find(p => p.id === id).name;
    const label = document.createElement('label'); label.textContent = 'Cantidad';
    const input = document.createElement('input'); input.type = 'number'; input.min = 1; input.max = 9999; input.step = 1; input.required = true; input.value = quantity; input.disabled = sending;
    input.setAttribute('aria-label', `Cantidad de ${name.textContent}`); input.addEventListener('input', () => selected.set(id, Number(input.value))); label.append(input);
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove'; remove.textContent = 'Quitar'; remove.disabled = sending; remove.setAttribute('aria-label', `Quitar ${name.textContent}`); remove.addEventListener('click', () => { selected.delete(id); renderSelection(); renderProducts(); });
    row.append(name, label, remove); $('#selection').append(row);
  }
}
function showForm() { $('#confirmation').hidden = true; $('#quote-form').hidden = false; }
$('#search').addEventListener('input', renderProducts);
$('#category').addEventListener('change', renderProducts);
$('#new-quote').addEventListener('click', showForm);
$('#quote-form').addEventListener('submit', async event => {
  event.preventDefault(); if (sending) return;
  if (!selected.size) { $('#form-status').textContent = 'Agrega al menos un producto antes de enviar.'; return; }
  const payload = Object.fromEntries(new FormData(event.target));
  payload.items = [...selected].map(([productId, quantity]) => ({ productId, quantity }));
  sending = true; $('.submit').disabled = true; renderSelection(); renderProducts(); $('#form-status').textContent = 'Guardando solicitud…';
  try {
    const response = await fetch('/api/quotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'No pudimos guardar la solicitud.');
    $('#folio').textContent = result.id; $('#quote-form').hidden = true; $('#confirmation').hidden = false; $('#confirmation').focus();
    event.target.reset(); selected.clear(); $('#form-status').textContent = '';
  } catch (error) { $('#form-status').textContent = error.message === 'Failed to fetch' ? 'No hay conexión. Tus datos se conservan; intenta de nuevo.' : error.message; }
  finally { sending = false; $('.submit').disabled = false; renderSelection(); renderProducts(); }
});
renderSelection();
try { const response = await fetch('/api/products'); if (!response.ok) throw new Error(); products = await response.json(); renderProducts(); }
catch { $('#catalog-status').textContent = 'No pudimos cargar el catálogo. Recarga la página para intentar de nuevo.'; }
