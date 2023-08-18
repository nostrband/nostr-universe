import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider } from '@/modules/theme/ThemeProvider.tsx'
import { AppContextProvider } from '@/store/app-context.tsx'
import { App } from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <HashRouter>
      <StyledEngineProvider injectFirst>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </StyledEngineProvider>
    </HashRouter>
  </ThemeProvider>
)
