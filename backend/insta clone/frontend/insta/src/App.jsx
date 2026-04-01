import React from 'react'
import AppRoutes from './AppRoutes'
import './style.scss'
import { AuthProvider } from './features/auth/auth.context.jsx'

function App() {
return (
  <div className="App">
    <AuthProvider>
      <AppRoutes /> 
    </AuthProvider>
  </div>
)
}

export default App
