
import './App.css'
import CounterView from './components/CounterView'
import CounterAct from './components/CounterAct'
import { CounterProvider } from './services/CounterContext'
import { IconHeader } from './components/IconHeader'
import UsrList from './components/UsrList'

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

    </CounterProvider >
  )
}

export default App
