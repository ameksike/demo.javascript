
import './App.css'
import CounterView from './components/CounterView'
import CounterAct from './components/CounterAct'
import { CounterProvider } from './services/CounterContext'
import { IconHeader } from './components/IconHeader'
import UsrList from './components/UsrList'
import UsrListQuery from './components/UsrListQuery'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {

  return (
    <CounterProvider>

      <IconHeader title="Vite + React + API Context" />

      <div className="card">
        <div className='box box-align-between'>
          <CounterView stl="blue" />
          <CounterView stl="red" />
        </div>

        <div className='box box-vertical'>
          <CounterAct stl="blue" inc={3} />
          <CounterAct stl="red" inc={4} />
        </div>

        <UsrList />
      </div>

      <QueryClientProvider client={queryClient}>
        <UsrListQuery />
      </QueryClientProvider>

    </CounterProvider >
  )
}

export default App
