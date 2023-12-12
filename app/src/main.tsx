import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { StyledEngineProvider } from '@mui/material/styles'
import { ThemeProvider } from '@/modules/theme/ThemeProvider.tsx'
import { InitialisationProvider } from '@/modules/AppInitialisation/InitialisationProvider.tsx'
import { App } from './App.tsx'
import { createStore } from './store/store.ts'
import './index.css'
import { startWorker, worker } from './workers/client.ts'
import { overrideWebSocket } from './modules/relay-proxy.ts'
import { setOnAddLocalRelayEvents } from './modules/nostr.ts'

overrideWebSocket()
startWorker()
setOnAddLocalRelayEvents((events: any) => worker.relayAddLocalEvents(events))

const store = createStore()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <Provider store={store}>
          <InitialisationProvider>
            <App />
          </InitialisationProvider>
        </Provider>
      </StyledEngineProvider>
    </BrowserRouter>
  </ThemeProvider>
)
