# Az900CertPractice

Práctica de exámenes de certificación Azure (AZ-900 y relacionadas), construida con Angular.

## Requisitos

| Herramienta | Versión |
|-------------|---------|
| Node.js     | 24 LTS (ver `.nvmrc`; Angular 22 soporta `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0`) |
| npm         | 10+ |
| Angular     | 22.x (CLI `@angular/cli` 22, builder `@angular/build`) |

```bash
nvm use        # usa la versión de .nvmrc
npm ci
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo en `http://localhost:4200/` |
| `npm run start:lan` | Servidor de desarrollo accesible desde la red local |
| `npm run build` | Build de producción en `dist/az900-cert-practice/browser/` |
| `npm test` | Tests unitarios con Karma + Jasmine (modo watch) |
| `npm run test:ci` | Tests unitarios una sola vez en Chrome headless |
| `npm run lint` | ESLint (`angular-eslint`) |
| `npm run deploy` | Build con `--base-href /az900/`, copia `index.html` a `404.html` y publica `dist/az900-cert-practice/browser` en GitHub Pages con `angular-cli-ghpages` |

## Notas de la actualización

- Build con el builder `application` (esbuild/Vite). La salida está en `dist/az900-cert-practice/browser/`.
- Ya no se necesita `NODE_OPTIONS=--openssl-legacy-provider`.
- TSLint/codelyzer reemplazados por ESLint (`eslint.config.js`).
- Protractor eliminado (no había specs e2e propias, solo el boilerplate del CLI).
- Componentes standalone con `bootstrapApplication` (`src/app/app.config.ts`, `src/app/app.routes.ts`).
