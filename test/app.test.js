import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server/app.js';
import { createQuoteRepository } from '../server/quote-repository.js';

const valid = { name: 'Ana', company: 'Empresa ejemplo', phone: '+52 55 1234 5678', email: 'ana@example.com', comments: 'Entrega en oficina', items: [{ productId: 'silla', quantity: 2 }, { productId: 'mesa', quantity: 1 }] };
async function fixture(t, repository) {
  const directory = await mkdtemp(join(tmpdir(), 'forma-test-'));
  const app = createApp({ repository: repository || createQuoteRepository(directory) });
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await new Promise(resolve => app.close(resolve)); await rm(directory, { recursive: true, force: true }); });
  const url = `http://127.0.0.1:${app.address().port}`;
  return { url, directory, post: payload => fetch(`${url}/api/quotes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }) };
}
test('sirve página, catálogo e imágenes locales', async t => {
  const { url } = await fixture(t);
  assert.equal((await fetch(url)).status, 200);
  const response = await fetch(`${url}/api/products`); const products = await response.json();
  assert.equal(products.length, 6);
  for (const p of products) assert.equal((await fetch(url + p.image)).status, 200);
  assert.equal((await fetch(url + '/data/quotes/anything.json')).status, 404);
});
test('guarda varios productos y devuelve folio después de persistir', async t => {
  const { post, directory } = await fixture(t);
  const response = await post(valid); assert.equal(response.status, 201);
  const result = await response.json(); const files = await readdir(directory);
  assert.deepEqual(files, [`${result.id}.json`]);
  const saved = JSON.parse(await readFile(join(directory, files[0]), 'utf8'));
  assert.equal(saved.items.length, 2); assert.equal(saved.items[0].quantity, 2); assert.equal(saved.email, valid.email);
});
test('rechaza campos, productos y cantidades inválidos sin guardar', async t => {
  const { post, directory } = await fixture(t);
  for (const payload of [null, { ...valid, name: '' }, { ...valid, email: 'error' }, { ...valid, phone: 'abcdefg' }, { ...valid, items: [] }, { ...valid, items: [{ productId: 'silla', quantity: 0 }] }, { ...valid, items: [{ productId: 'silla', quantity: 1.5 }] }, { ...valid, items: [{ productId: 'unknown', quantity: 1 }] }, { ...valid, items: [valid.items[0], valid.items[0]] }, { ...valid, comments: 'x'.repeat(2001) }]) assert.equal((await post(payload)).status, 400);
  assert.deepEqual(await readdir(directory), []);
});
test('no confirma cuando falla el almacenamiento', async t => {
  const { post } = await fixture(t, { async save() { throw new Error('storage unavailable'); } });
  assert.equal((await post(valid)).status, 500);
});
test('rechaza JSON malformado y cuerpos excesivos', async t => {
  const { url } = await fixture(t);
  const post = body => fetch(url + '/api/quotes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  assert.equal((await post('{')).status, 400);
  assert.equal((await post('x'.repeat(17000))).status, 413);
});
