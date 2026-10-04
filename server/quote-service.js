import { products } from './products.js';

export class ValidationError extends Error {}

export function validateQuote(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('Solicitud inválida.');
  const result = {};
  for (const [key, label, max] of [['name', 'Nombre', 100], ['company', 'Empresa', 150], ['phone', 'Teléfono', 30], ['email', 'Email', 254]]) {
    if (typeof input[key] !== 'string' || !input[key].trim() || input[key].length > max) throw new ValidationError(`${label}: revisa este campo.`);
    result[key] = input[key].trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new ValidationError('Email inválido.');
  if (!/^[+\d\s().-]{7,30}$/.test(result.phone) || result.phone.replace(/\D/g, '').length < 7) throw new ValidationError('Teléfono inválido.');
  if (input.comments !== undefined && (typeof input.comments !== 'string' || input.comments.length > 2000)) throw new ValidationError('Los comentarios admiten hasta 2000 caracteres.');
  result.comments = (input.comments || '').trim();
  if (!Array.isArray(input.items) || !input.items.length || input.items.length > products.length) throw new ValidationError('Selecciona al menos un producto.');
  const seen = new Set();
  result.items = input.items.map(item => {
    const product = products.find(p => p.id === item?.productId);
    if (!product || seen.has(product.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 9999) throw new ValidationError('Revisa los productos y cantidades (1 a 9999).');
    seen.add(product.id);
    return { productId: product.id, name: product.name, quantity: item.quantity };
  });
  return result;
}
