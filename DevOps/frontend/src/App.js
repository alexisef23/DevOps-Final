import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [view, setView] = useState('dashboard');
  const [noticias, setNoticias] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [userEmail, setUserEmail] = useState('dael.alexis@example.com'); // Simulado para el ejemplo

  // Cargar datos al iniciar
  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const response = await fetch('http://localhost:8000/noticias');
      const data = await response.json();
      setNoticias(data);
    } catch (err) {
      console.error("Error al cargar noticias", err);
    }
  };

  const fetchHistorial = async () => {
    try {
      const response = await fetch(`http://localhost:8000/historial/${userEmail}`);
      const data = await response.json();
      setHistorial(data);
      setView('historial');
    } catch (err) {
      console.error("Error al cargar historial", err);
    }
  };

  const handlePago = async (servicio, monto) => {
    const pago = { servicio, monto, usuario_email: userEmail };
    try {
      const response = await fetch('http://localhost:8000/pagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pago)
      });
      if (response.ok) alert(`Pago de ${servicio} exitoso`);
    } catch (err) {
      alert("Error al procesar el pago");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-600 p-4 text-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Ciudadano Digital</h1>
          <div className="space-x-4">
            <button onClick={() => setView('dashboard')} className="hover:underline">Inicio</button>
            <button onClick={fetchHistorial} className="hover:underline">Mis Pagos</button>
            <button className="bg-red-500 px-3 py-1 rounded">Salir</button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container mx-auto p-6">
        {view === 'dashboard' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sección de Pagos */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Pagos de Servicios</h2>
              <div className="space-y-3">
                <button onClick={() => handlePago('Agua', 150.50)} className="w-full bg-blue-50 p-3 text-left rounded hover:bg-blue-100 flex justify-between">
                  <span>Agua Potable</span> <span className="font-bold text-blue-600">$150.50</span>
                </button>
                <button onClick={() => handlePago('Luz (CFE)', 420.00)} className="w-full bg-blue-50 p-3 text-left rounded hover:bg-blue-100 flex justify-between">
                  <span>Luz (CFE)</span> <span className="font-bold text-blue-600">$420.00</span>
                </button>
              </div>
            </div>

            {/* Sección de Noticias */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4">Noticias de la Comunidad</h2>
              <div className="space-y-4">
                {noticias.map((n, i) => (
                  <div key={i} className="border-b pb-2">
                    <h3 className="font-semibold text-blue-800">{n.titulo || n}</h3>
                    <p className="text-gray-600 text-sm">{n.contenido || "Consulta los detalles en la oficina local."}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'historial' && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Historial de Pagos</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Servicio</th>
                  <th className="p-2">Monto</th>
                  <th className="p-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((p, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.servicio}</td>
                    <td className="p-2 font-bold">${p.monto}</td>
                    <td className="p-2 text-gray-500">{new Date(p.fecha_pago).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;