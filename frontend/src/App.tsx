import { useState } from 'react'
import './App.css'
import { useAuth } from './context/AuthContext'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Dashboard } from './components/Dashboard'

function App() {
  const { token } = useAuth()
  const [currentPage, setCurrentPage] = useState('login')

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
  }

  // If user is authenticated, show dashboard
  if (token) {
    return <Dashboard onNavigate={handleNavigate} />
  }

  // Show login/register pages
  if (currentPage === 'register') {
    return <Register onNavigate={handleNavigate} />
  }

  return <Login onNavigate={handleNavigate} />
}

export default App
