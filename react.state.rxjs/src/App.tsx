
import './App.css'
import CounterAct from './components/CounterAct'
import CounterView from './components/CounterView'
import { IconHeader } from './components/IconHeader'

function App() {

  return (
    <>
     <IconHeader title="Vite + React + RxJS" />

     <div className="card">
        <div className='box box-align-between'>
          <CounterView stl="blue" />
          <CounterView stl="red" />
        </div>

        <div className='box box-vertical'>
          <CounterAct stl="blue" inc={3} />
          <CounterAct stl="red" inc={4} />
        </div>

      </div>
    </>
  )
}

export default App
