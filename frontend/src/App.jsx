import { useState, useEffect } from 'react'
import WorkoutForm from './components/WorkoutForm'

function App() {
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setBackendStatus('connected')
        } else {
          setBackendStatus('offline')
        }
      })
      .catch(() => {
        setBackendStatus('offline')
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center px-4 py-12 gap-6">
      <h1 className="text-3xl font-bold">Progressive Overload Tracker</h1>
      <p className={
        backendStatus === 'connected' ? 'text-green-400 text-sm' :
        backendStatus === 'offline' ? 'text-red-400 text-sm' :
        'text-gray-500 text-sm'
      }>
        {backendStatus === 'checking' && 'Checking backend...'}
        {backendStatus === 'connected' && 'Backend connected'}
        {backendStatus === 'offline' && 'Backend offline'}
      </p>
      <WorkoutForm />
    </div>
  )
}

export default App
