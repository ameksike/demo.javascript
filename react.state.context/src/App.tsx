
import './App.css'
import { CounterProvider } from './services/CounterContext'
import Menu from './components/Menu'


function App() {

  return (
    <CounterProvider>
      <Menu />
    </CounterProvider >
  )
}

export default App
