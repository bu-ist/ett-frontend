import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Can load proxy targets from environment variables:
// https://stackoverflow.com/questions/66389043/how-can-i-use-vite-env-variables-in-vite-config-js/66389044#66389044

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const { VITE_CONSENTING_API_HOST } = env;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/consentingApi': {
          target: VITE_CONSENTING_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/consentingApi/, '')
        }
      }
    }
  }
});
