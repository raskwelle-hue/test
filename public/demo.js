// La demo utiliza el mismo catálogo y la misma API del MVP.
export function mountDemo({ products, selected, renderProducts, renderSelection, showForm, isSending }) {
  const panel = document.createElement('section');
  panel.className = 'demo-toolbar';
  panel.setAttribute('aria-label', 'Controles de la presentación');
  panel.innerHTML = '<div><a href="/demo.html" class="demo-pill">DEMO PARA INVERSIONISTAS</a><p>1. Explora el catálogo · 2. Prepara un ejemplo · 3. Envía y recibe un folio</p><small>El envío guarda una solicitud de prueba en este servidor. No se envían emails.</small></div><div class="demo-actions"><a href="#catalogo" class="demo-control">Ver catálogo</a><button type="button" class="demo-control" id="prepare-demo">Preparar ejemplo</button><button type="button" class="demo-control" id="reset-demo">Reiniciar</button></div><p id="demo-status" role="status" aria-live="polite"></p>';
  document.querySelector('main').prepend(panel);
  const form = document.querySelector('#quote-form');
  const status = panel.querySelector('#demo-status');
  function reset() {
    selected.clear(); form.reset(); showForm();
    document.querySelector('#form-status').textContent = '';
    document.querySelector('#search').value = '';
    document.querySelector('#category').value = '';
    renderSelection(); renderProducts();
  }
  panel.querySelector('#prepare-demo').addEventListener('click', () => {
    if (isSending()) { status.textContent = 'Espera a que termine el envío.'; return; }
    reset();
    for (const [id, quantity] of [['silla', 4], ['escritorio', 2], ['lampara', 2]]) {
      if (products.some(product => product.id === id)) selected.set(id, quantity);
    }
    const example = { name: 'Alex Demo', company: 'Oficina Ejemplo · Demo', phone: '+52 55 0000 0000', email: 'demo@example.com', comments: '[DEMO PARA INVERSIONISTAS] Datos ficticios. Equipamiento de una oficina para cuatro personas. No contactar.' };
    for (const [key, value] of Object.entries(example)) form.elements.namedItem(key).value = value;
    renderSelection(); renderProducts();
    status.textContent = 'Ejemplo preparado: 3 productos, 8 unidades. Puedes editarlo y pulsar “Enviar solicitud”.';
    document.querySelector('#cotizacion').scrollIntoView({ behavior: 'smooth' });
    form.elements.namedItem('name').focus({ preventScroll: true });
  });
  panel.querySelector('#reset-demo').addEventListener('click', () => {
    if (isSending()) { status.textContent = 'Espera a que termine el envío.'; return; }
    reset(); status.textContent = 'Recorrido reiniciado. Las solicitudes ya enviadas permanecen guardadas.';
    panel.scrollIntoView({ behavior: 'smooth' });
  });
}
