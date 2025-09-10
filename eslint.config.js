 import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import pluginQuasar from '@quasar/app-vite/eslint';
import tseslint from 'typescript-eslint';

/**
 * Esta es la nueva forma de configurar ESLint, conocida como "flat config".
 * Es un array de objetos de configuración. ESLint los fusiona en orden,
 * por lo que las reglas en los últimos objetos tienen prioridad sobre los primeros.
 */
export default tseslint.config(
  // 1. Archivos y carpetas a ignorar globalmente
  {
    ignores: [
      'node_modules/',
      '.quasar/',
      'dist/',
      'src-pwa/',
      'src-capacitor/',
      'src-ssr/',
      'src-cordova/',
      // otros archivos que quieras ignorar...
    ],
  },

  // 2. Configuraciones base recomendadas (se aplican a todos los archivos)
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...pluginVue.configs['flat/recommended'], // Incluye essential, strongly-recommended y recommended
  pluginQuasar.configs.recommended(),

  // 3. Configuración principal para tus archivos de proyecto (Vue y TypeScript)
  {
    files: ['src/**/*.{ts,vue}'],
    languageOptions: {
      // Es crucial especificar el parser para TypeScript aquí
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.vue'],
      },
    },
    rules: {
      // Tus reglas personalizadas para TypeScript y Vue
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Reglas de Vue
      'vue/multi-word-component-names': 'off', // Muy común desactivarla para archivos como `index.vue` o `_id.vue`
    },
  },

  // 4. Configuración general y reglas personalizadas para todo el proyecto
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
        ga: 'readonly',
        cordova: 'readonly',
        Capacitor: 'readonly',
        chrome: 'readonly',
        browser: 'readonly',
      },
    },
    rules: {
      // Tus reglas generales personalizadas
      'prefer-promise-reject-errors': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  // 5. Configuración específica para el service worker (si lo usas)
  {
    files: ['src-pwa/custom-service-worker.ts'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
      },
    },
  }
);
