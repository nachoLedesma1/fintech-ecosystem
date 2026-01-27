import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        
        {/* Ruta protegida (por ahora pública para probar) */}
        <Route path="/dashboard" element={<Dashboard />} />
    
        {/* Redireccionar cualquier ruta desconocida al Login */}
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;