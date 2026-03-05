import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

const API = 'http://localhost:8000';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

const fmtMoney = (n) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

// ─── Login ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Ciudadano Digital</h1>
          <p className="text-gray-500 mt-1">Accede a todos tus trámites en línea</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ user, view, setView, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Inicio' },
    { id: 'pagos', label: 'Pagos' },
    { id: 'citas', label: 'Citas' },
    { id: 'historial', label: 'Mis Pagos' },
    { id: 'documentos', label: 'Bóveda' },
  ];
  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-700 font-bold text-sm">CD</span>
          </div>
          <span className="text-xl font-bold">Ciudadano Digital</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                view === item.id ? 'bg-white text-blue-700' : 'hover:bg-blue-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-200 text-sm hidden sm:block">{user?.email}</span>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ user, noticias, setView }) {
  const quickActions = [
    { id: 'pagos', label: 'Pagar Servicios', icon: '💳', color: 'bg-blue-500' },
    { id: 'citas', label: 'Agendar Cita', icon: '📅', color: 'bg-green-500' },
    { id: 'historial', label: 'Ver Historial', icon: '📋', color: 'bg-purple-500' },
    { id: 'documentos', label: 'Mis Documentos', icon: '📁', color: 'bg-orange-500' },
  ];
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6">
        <h2 className="text-2xl font-bold">Bienvenido, ciudadano</h2>
        <p className="text-blue-200 mt-1">{user?.email}</p>
        <p className="text-blue-100 text-sm mt-2">Gestiona todos tus trámites municipales desde un solo lugar.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((a) => (
          <button
            key={a.id}
            onClick={() => setView(a.id)}
            className={`${a.color} text-white rounded-xl p-4 text-center hover:opacity-90 transition shadow-md`}
          >
            <div className="text-3xl mb-2">{a.icon}</div>
            <div className="font-semibold text-sm">{a.label}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📰 Noticias de la Comunidad</h3>
        {noticias.length === 0 ? (
          <p className="text-gray-500">Cargando noticias...</p>
        ) : (
          <div className="space-y-3">
            {noticias.map((n, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-4 py-1">
                <h4 className="font-semibold text-gray-800">{n.titulo}</h4>
                <p className="text-gray-600 text-sm">{n.contenido}</p>
                {n.fecha_publicacion && (
                  <p className="text-gray-400 text-xs mt-1">{fmtDate(n.fecha_publicacion)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pagos ────────────────────────────────────────────────────────────────────
const SERVICIOS = [
  { nombre: 'Agua Potable', key: 'Agua', monto: 150.50, icon: '💧', cat: 'Gubernamental' },
  { nombre: 'Luz (CFE)', key: 'Luz (CFE)', monto: 420.00, icon: '⚡', cat: 'Gubernamental' },
  { nombre: 'Predial', key: 'Predial', monto: 1800.00, icon: '🏠', cat: 'Gubernamental' },
  { nombre: 'Tenencia', key: 'Tenencia', monto: 950.00, icon: '🚗', cat: 'Gubernamental' },
  { nombre: 'Gas Natural', key: 'Gas Natural', monto: 320.00, icon: '🔥', cat: 'Privado' },
  { nombre: 'Internet/Cable', key: 'Internet/Cable', monto: 599.00, icon: '📡', cat: 'Privado' },
];

function Pagos({ user, onPagoExitoso }) {
  const [loading, setLoading] = useState(null);
  const [msg, setMsg] = useState('');

  const handlePago = async (servicio) => {
    setLoading(servicio.key);
    setMsg('');
    try {
      const res = await fetch(`${API}/pagar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicio: servicio.key, monto: servicio.monto, usuario_email: user.email }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg(`✅ Pago de ${servicio.nombre} registrado exitosamente.`);
      onPagoExitoso && onPagoExitoso();
    } catch (e) {
      setMsg(`❌ Error: ${e.message}`);
    }
    setLoading(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">💳 Pago de Servicios</h2>
      {msg && (
        <div className={`rounded-lg px-4 py-3 text-sm ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg}
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICIOS.map((s) => (
          <div key={s.key} className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className="font-semibold text-gray-800">{s.nombre}</div>
                <div className="text-xs text-gray-400">{s.cat}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-600">{fmtMoney(s.monto)}</div>
            <button
              onClick={() => handlePago(s)}
              disabled={loading === s.key}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {loading === s.key ? 'Procesando...' : 'Pagar Ahora'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Citas ────────────────────────────────────────────────────────────────────
const TRAMITES = [
  'Acta de Nacimiento', 'Acta de Matrimonio', 'Acta de Defunción',
  'Licencia de Conducir', 'Refrendo Vehicular', 'Credencial de Elector',
  'Pasaporte', 'CURP / RFC', 'Permiso de Construcción',
];

function Citas({ user }) {
  const [tramite, setTramite] = useState('');
  const [dependencia, setDependencia] = useState('Registro Civil');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('09:00');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleAgendar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const fechaISO = `${fecha}T${hora}:00`;
    try {
      const res = await fetch(`${API}/citas/agendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: user.id, tramite, fecha: fechaISO, dependencia }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg('✅ Cita agendada correctamente. Recibirás confirmación por correo.');
      setTramite('');
      setFecha('');
    } catch (e) {
      setMsg(`❌ Error al agendar: ${e.message}`);
    }
    setLoading(false);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">📅 Agendar Cita</h2>
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-lg">
        {msg && (
          <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg}
          </div>
        )}
        <form onSubmit={handleAgendar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trámite</label>
            <select
              value={tramite}
              onChange={(e) => setTramite(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un trámite...</option>
              {TRAMITES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dependencia</label>
            <select
              value={dependencia}
              onChange={(e) => setDependencia(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Registro Civil</option>
              <option>Movilidad y Transporte</option>
              <option>Tesorería Municipal</option>
              <option>Obras Públicas</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                value={fecha}
                min={today}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['08:00','09:00','10:00','11:00','12:00','13:00','15:00','16:00','17:00'].map((h) => (
                  <option key={h} value={h}>{h} hrs</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Agendando...' : 'Confirmar Cita'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Historial ────────────────────────────────────────────────────────────────
function Historial({ user }) {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/historial/${user.email}`)
      .then((r) => r.json())
      .then((d) => { setHistorial(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user.email]);

  const total = historial.reduce((acc, p) => acc + parseFloat(p.monto || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">📋 Historial de Pagos</h2>
      {!loading && historial.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-blue-800">
          Total pagado: <span className="font-bold">{fmtMoney(total)}</span>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando historial...</div>
        ) : historial.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No tienes pagos registrados aún.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Servicio</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Monto</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{p.servicio}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">{fmtMoney(p.monto)}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{fmtDate(p.fecha_pago)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── Bóveda de Documentos ─────────────────────────────────────────────────────
function Boveda({ user }) {
  const [documentos, setDocumentos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  const cargarDocumentos = async () => {
    try {
      const res = await fetch(`${API}/documentos/${user.id}`);
      const data = await res.json();
      setDocumentos(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { cargarDocumentos(); }, [user.id]);

  const uploadFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toUpperCase();
    if (!['PDF', 'JPG', 'JPEG', 'PNG'].includes(ext)) {
      setMsg('❌ Solo se permiten archivos PDF o imágenes (JPG/PNG).');
      return;
    }

    setUploading(true);
    setMsg('');

    // Subir al bucket "expedientes" de Supabase Storage
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('expedientes')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (storageError) {
      setMsg(`❌ Error al subir archivo: ${storageError.message}`);
      setUploading(false);
      return;
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage.from('expedientes').getPublicUrl(filePath);
    const publicUrl = urlData?.publicUrl || '';

    // Registrar en la base de datos vía backend
    try {
      const res = await fetch(`${API}/documentos/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: user.id,
          nombre: file.name,
          tipo: ext === 'JPEG' ? 'JPG' : ext,
          url: publicUrl,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg('✅ Documento subido y registrado correctamente.');
      cargarDocumentos();
    } catch (e) {
      setMsg(`❌ Error al registrar: ${e.message}`);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">📁 Bóveda de Documentos</h2>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Subir Documento</h3>
        {msg && (
          <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${msg.startsWith('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg}
          </div>
        )}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-8 cursor-pointer hover:bg-blue-50 transition">
          <span className="text-4xl mb-2">📤</span>
          <span className="text-blue-600 font-medium">{uploading ? 'Subiendo...' : 'Haz clic para seleccionar archivo'}</span>
          <span className="text-gray-400 text-sm mt-1">PDF, JPG o PNG · máx 10 MB</span>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={uploadFile} disabled={uploading} className="hidden" />
        </label>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-700">Mis Documentos</h3>
        </div>
        {documentos.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No has subido documentos aún.</div>
        ) : (
          <div className="divide-y">
            {documentos.map((d, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{d.tipo === 'PDF' ? '📄' : '🖼️'}</span>
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{d.nombre}</div>
                    <div className="text-gray-400 text-xs">{fmtDate(d.created_at)}</div>
                  </div>
                </div>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ver / Descargar ↗
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Principal ────────────────────────────────────────────────────────────
function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [noticias, setNoticias] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Verificar sesión existente
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Cargar noticias
  useEffect(() => {
    if (user) {
      fetch(`${API}/noticias`)
        .then((r) => r.json())
        .then(setNoticias)
        .catch(console.error);
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView('dashboard');
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Cargando...</div>
      </div>
    );
  }

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Navbar user={user} view={view} setView={setView} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-6">
        {view === 'dashboard' && <Dashboard user={user} noticias={noticias} setView={setView} />}
        {view === 'pagos'     && <Pagos user={user} />}
        {view === 'citas'     && <Citas user={user} />}
        {view === 'historial' && <Historial user={user} />}
        {view === 'documentos' && <Boveda user={user} />}
      </main>
    </div>
  );
}

export default App;
