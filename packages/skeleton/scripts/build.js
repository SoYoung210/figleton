/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const { build } = require('esbuild');

const ROOT = path.resolve(__dirname, '..');
const packageJSON = JSON.parse(
  fs.readFileSync(path.resolve(ROOT, process.cwd(), 'package.json'), 'utf8')
);

const config = {
  entryPoints: ['src/index.ts'],
  loader: {
    '.ts': 'ts',
  },
  bundle: true,
  minify: true,
  sourcemap: true,
  external: [
    ...Object.keys(packageJSON.dependencies ?? {}),
    ...Object.keys(packageJSON.peerDependencies ?? {}),
    ...Object.keys(packageJSON.peerDependenciesMeta ?? {}),
  ],
};

Promise.all([
  build({
    ...config,
    format: 'esm',
    outdir: 'dist/esm',
  }),
  build({
    ...config,
    format: 'cjs',
    outdir: 'dist',
  }),
]).catch(() => process.exit(1));
