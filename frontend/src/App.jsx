import { useState, useEffect } from 'react'

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
    <div className="app">
      <h1>Progressive Overload Tracker</h1>
      <p className={`status ${backendStatus}`}>
        {backendStatus === 'checking' && 'Checking backend...'}
        {backendStatus === 'connected' && 'Backend connected'}
        {backendStatus === 'offline' && 'Backend offline'}
      </p>
    </div>
  )
}

export default App
