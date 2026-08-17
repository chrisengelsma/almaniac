import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { I18nextProvider } from 'react-i18next'
import './androidViewport'
import './index.css'
import App from './App.tsx'
import i18n from './i18n'
import { loadAppSettings, getResolvedAppLanguage } from './lib/appSettings'

const platform = Capacitor.getPlatform()
if (platform !== 'web') {
  document.documentElement.classList.add('platform-native', `platform-${platform}`)
}

void i18n.changeLanguage(getResolvedAppLanguage(loadAppSettings()))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </StrictMode>,
)
