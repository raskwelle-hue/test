import { cp, mkdir } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
console.log('Build completado: assets en dist/. La API se ejecuta con npm start.');
