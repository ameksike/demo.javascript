import './App.css'

import { IconHeader } from './components/IconHeader'
import CounterView from './components/CounterView';
import CounterAct from './components/CounterAct';
import { StoreProvider } from './components/StoreProvider';


function App() {

  return (
    <StoreProvider >
      <IconHeader title="Vite + React + Redux" />

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
    </StoreProvider>
  )
}

export default App
