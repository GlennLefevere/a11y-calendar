import { Config } from '@stencil/core';

import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'a11y-calendar',
  taskQueue: 'async',
  srcDir: 'src',
  buildEs5: false,
  sourceMap: true,
  enableCache: false,
  transformAliasedImportPaths: false,
  extras: {
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true,
    enableImportInjection: true,
  },
  plugins: [
    sass({
      injectGlobalPaths: [
      ],
    }),
  ],
  testing: {
    /**
     * Gitlab CI doesn't allow sandbox, therefor this parameters must be passed to your Headless Chrome
     * before it can run your tests
     */
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    transform: {
      '^.+\\.svg$': '<rootDir>/svgTransform.js',
    },
    moduleNameMapper: {
    },
    setupFiles: ['<rootDir>/testing.ts'],
  },
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: './loader',
      dir: '../../dist/a11y-calendar/dist'
    },
    {
      type: 'docs-readme',
      dir: '../../dist/a11y-calendar/dist/docs',
    },
    {
      type: 'www',
      dir: '../../dist/a11y-calendar/dist/www',
      serviceWorker: null, // disable service workers
    },
  ],
};
