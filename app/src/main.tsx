import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider } from '@/modules/theme/ThemeProvider.tsx'
import { InitialisationProvider } from '@/modules/AppInitialisation/InitialisationProvider.tsx'
// import { AppContextProvider } from '@/store/app-context.tsx'
import { App } from './App.tsx'
import { createStore } from './store/store.ts'
import './index.css'

const store = createStore()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <HashRouter>
      <StyledEngineProvider injectFirst>
        {/* <AppContextProvider> */}
        <Provider store={store}>
          <InitialisationProvider>
            <App />
          </InitialisationProvider>
        </Provider>
        {/* </AppContextProvider> */}
      </StyledEngineProvider>
    </HashRouter>
  </ThemeProvider>
)
