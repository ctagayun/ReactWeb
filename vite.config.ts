import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


// https://vitejs.dev/config/

//Add server node to run app in port 3000
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3000,
    strictPort: true,
  }
})
