import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transfer from './pages/Transfer';
import History from './pages/History';
import Contacts from './pages/Contacts';
import Investments from './pages/Investments';
import Register from './pages/Register';
import Card from './pages/Cards';
import AdminPanel from './pages/AdminPanel';


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        
        {/* Ruta protegida (por ahora pública para probar) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/history/:cbu" element={<History />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cards" element={<Card />} />
        <Route path="/admin" element={<AdminPanel />} />
    
        {/* Redireccionar cualquier ruta desconocida al Login */}
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;