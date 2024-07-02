import './App.css'
import { IconHeader } from './components/IconHeader'

import { Provider } from 'react-redux';
import { CounterStore } from './services/CounterStore';
import CounterView from './components/CounterView';
import CounterAct from './components/CounterAct';

function App() {

  return (
    <Provider store={CounterStore}>
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
    </Provider>
  )
}

export default App
