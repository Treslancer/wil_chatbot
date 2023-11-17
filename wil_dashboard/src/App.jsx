import { useState } from 'react'
import './App.css'
import MainPage from './pages/MainPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <MainPage />
      </div>
    </>
  )
}

export default App
