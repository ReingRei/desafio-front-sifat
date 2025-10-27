import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import ProductListPage from './pages/ProductListPage';
import { Toaster } from 'react-hot-toast';

function App() {

  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
          style: { background: '#363636', color: '#fff' },
        }}
      />

      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ProductListPage />} />

          <Route path="/products/new" element={<div>Formulário de Criação (Placeholder)</div>} />

          <Route path="/products/edit/:id" element={<div>Formulário de Edição (Placeholder)</div>} />

          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
