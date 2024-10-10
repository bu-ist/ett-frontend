import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Can load proxy targets from environment variables:
// https://stackoverflow.com/questions/66389043/how-can-i-use-vite-env-variables-in-vite-config-js/66389044#66389044

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd());
  const { VITE_CONSENTING_API_HOST, VITE_AUTHORIZED_API_HOST, VITE_SYSADMIN_API_HOST, VITE_ACKNOWLEDGE_ENTITY_API_HOST, VITE_ENTITY_API_HOST, VITE_REGISTER_ENTITY_API_HOST, VITE_REGISTER_CONSENTER_API_HOST } = env;

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/consentingApi': {
          target: VITE_CONSENTING_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/consentingApi/, '')
        },
        '/authorizedApi': {
          target: VITE_AUTHORIZED_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/authorizedApi/, '')
        },
        '/entityApi': {
          target: VITE_ENTITY_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/entityApi/, '')
        },
        '/sysadminApi': {
          target: VITE_SYSADMIN_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/sysadminApi/, '')
        },
        '/acknowledgeEntityApi': {
          target: VITE_ACKNOWLEDGE_ENTITY_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/acknowledgeEntityApi/, '')
        },
        '/registerEntityApi': {
          target: VITE_REGISTER_ENTITY_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/registerEntityApi/, '')
        },
        '/registerConsenterApi': {
          target: VITE_REGISTER_CONSENTER_API_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/registerConsenterApi/, '')
        }
      }
    }
  }
});
