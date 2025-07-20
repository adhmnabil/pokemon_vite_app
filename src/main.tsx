import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import PokemonErrorBoundary from './pages/error/PokemonErrorBoundary'
import './styles.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PokemonErrorBoundary>
    <App />
    </PokemonErrorBoundary>
  </React.StrictMode>,
)
