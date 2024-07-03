
import './App.css'
import CounterView from './components/CounterView'
import CounterAct from './components/CounterAct'
import { CounterProvider } from './services/CounterContext'
import { IconHeader } from './components/IconHeader'

import Menu from './components/Menu'


function App() {

  return (
    <CounterProvider>
      <Menu />
    </CounterProvider >
  )
}

export default App
