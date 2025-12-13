import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Subscrivery
                </h1>
                <p className="text-xl text-gray-600">
                  Plataforma de Assinaturas
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Frontend configurado e pronto para desenvolvimento
                </p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
