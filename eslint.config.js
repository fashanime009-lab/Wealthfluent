import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Vercel serverless functions and the Vite config itself run under
    // Node, not in a browser — they need process/require/__dirname/module,
    // not window/document. Without this, eslint flags every one of those
    // as undefined, which drowns out any real issue in these files.
    files: ['api/**/*.js', 'vite.config.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // A context module exports its Provider AND the hook that reads it — the
    // standard React pattern. react-refresh/only-export-components exists
    // to keep Vite's dev-server fast refresh from losing state on edit; it
    // has no effect on the production build. Splitting every provider from
    // its hook would mean rewriting dozens of imports for zero user benefit,
    // so it's switched off for exactly these files (Seo.jsx exports its
    // site-wide constants for the same reason) and stays on everywhere else.
    files: ['src/context/**/*.{js,jsx}', 'src/journeys/**/context/*.{js,jsx}', 'src/components/seo/Seo.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
