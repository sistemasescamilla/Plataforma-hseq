import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';
import ModuloDetalle from './ModuloDetalle';
import AdminPanel from './AdminPanel'; // 👈 Importamos el panel

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/modulo/:id" element={<ModuloDetalle />} /> 
        
        {/* Nueva ruta secreta para el administrador */}
        <Route path="/admin" element={<AdminPanel />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;