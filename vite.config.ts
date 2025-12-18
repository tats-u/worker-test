import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  base: process.env.CHANGE_BASE ? '/worker-test/' : undefined,
  plugins: [solid()],
})
