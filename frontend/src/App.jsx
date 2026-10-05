import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import AdminPanel from './AdminPanel';
import Dashboard from './Dashboard';
import Modulo from './Modulo'; // <-- IMPORTAMOS EL NUEVO COMPONENTE

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<Dashboard />} />
        {/* <-- ESTA ES LA RUTA NUEVA --> */}
        <Route path="/modulo/:id" element={<Modulo />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;