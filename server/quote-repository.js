import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

// Sustituir este adaptador por una base de datos sin cambiar la API.
export function createQuoteRepository(directory = resolve('data/quotes')) {
  return {
    async save(payload) {
      const quote = { id: randomUUID(), createdAt: new Date().toISOString(), ...payload };
      await mkdir(directory, { recursive: true });
      await writeFile(resolve(directory, `${quote.id}.json`), JSON.stringify(quote, null, 2), { flag: 'wx', mode: 0o600 });
      return quote;
    }
  };
}
