import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { GameDetail } from './pages/GameDetail'
import { InstallPrompt } from './components/InstallPrompt'
import { useGames } from './hooks/useGames'

function App() {
  const games = useGames()

  return (
    <div className="min-h-dvh">
      <Routes>
        <Route path="/" element={<Home {...games} />} />
        <Route path="/jogo/:id" element={<GameDetail />} />
      </Routes>
      <InstallPrompt />
    </div>
  )
}

export default App
