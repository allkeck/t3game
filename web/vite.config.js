import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  const profiling = isProduction && {
    'react-dom/client': 'react-dom/profiling',
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        ...profiling,
      },
    },
  };
});
