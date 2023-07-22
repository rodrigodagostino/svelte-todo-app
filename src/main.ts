import './app.css'
import App from './App.svelte'
import './lib/locales/i18n'

const app = new App({
  target: document.getElementById('app'),
  intro: true,
})

export default app
