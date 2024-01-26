import { useState } from 'react'
import './App.css'
import Navbar from './assets/components/Navbar';
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <h1 className='text-3xl '>Hello you piece of shit</h1>
    </>
  )
}

export default App
