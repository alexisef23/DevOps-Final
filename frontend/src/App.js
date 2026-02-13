import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Layout, Wallet, Newspaper, CheckCircle, AlertCircle } from 'lucide-react';

function App() {
  const [servicios, setServicios] = useState({ gubernamentales: [], privados: [] });
  const [noticias, setNoticias] = useState([]);
  const [pago, setPago] = useState({ servicio: '', monto: '', usuario_id: 'user_123' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  // 1. Cargar datos del Backend al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resServicios = await fetch('http://localhost:8000/servicios');
        const dataServicios = await resServicios.json();
        setServicios(dataServicios);

        const resNoticias = await fetch('http://localhost:8000/noticias');
        const dataNoticias = await resNoticias.json();
        setNoticias(dataNoticias);
      } catch (err) {
        console.error("Error conectando al backend:", err);
      }
    };
    fetchData();
  }, []);

  // 2. Lógica para procesar el pago enviándolo al Backend
  const handlePago = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', msg: 'Procesando...' });

    try {
      const response = await fetch('http://localhost:8000/pagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          servicio: pago.servicio,
          monto: parseFloat(pago.monto),
          usuario_id: pago.usuario_id
        }),
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: '¡Pago registrado exitosamente en Supabase!' });
        setPago({ ...pago, servicio: '', monto: '' });
      } else {
        throw new Error("Error en el servidor");
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Hubo un fallo al procesar el pago.' });
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>🏛️ Ciudadano Digital</h1>
        <p>Gestión centralizada de servicios públicos</p>
      </header>

      {/* SECCIÓN DE NOTICIAS */}
      <section style={{ marginBottom: '40px', background: '#f0f4f8', padding: '15px', borderRadius: '8px' }}>
        <h3><Newspaper size={20} /> Noticias Locales</h3>
        <ul>
          {noticias.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* SECCIÓN DE LISTA DE SERVICIOS */}
        <section>
          <h3><Layout size={20} /> Servicios Disponibles</h3>
          <strong>Gubernamentales:</strong>
          <ul>
            {servicios.gubernamentales.map(s => <li key={s}>{s}</li>)}
          </ul>
          <strong>Privados:</strong>
          <ul>
            {servicios.privados.map(s => <li key={s}>{s}</li>)}
          </ul>
        </section>

        {/* FORMULARIO DE PAGO */}
        <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
          <h3><Wallet size={20} /> Realizar Pago</h3>
          <form onSubmit={handlePago}>
            <div style={{ marginBottom: '10px' }}>
              <label>Servicio:</label><br/>
              <select 
                value={pago.servicio} 
                onChange={(e) => setPago({...pago, servicio: e.target.value})}
                required
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="">Selecciona uno...</option>
                {[...servicios.gubernamentales, ...servicios.privados].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Monto ($):</label><br/>
              <input 
                type="number" 
                value={pago.monto}
                onChange={(e) => setPago({...pago, monto: e.target.value})}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Pagar Ahora
            </button>
          </form>

          {status.msg && (
            <div style={{ marginTop: '15px', color: status.type === 'success' ? 'green' : 'red', display: 'flex', alignItems: 'center', gap: '5px' }}>
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {status.msg}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;