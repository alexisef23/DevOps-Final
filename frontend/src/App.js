import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Wallet, Calendar, ShieldCheck, Newspaper, 
  Search, Bell, User, LogOut, ChevronRight, FileText, Plus,
  CheckCircle2, Clock
} from 'lucide-react';
import { supabase } from './lib/supabase';

// --- SUB-COMPONENTES DE MÓDULOS ---

const Dashboard = ({ user }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 bg-gradient-to-r from-blue-50 to-transparent">
      <h2 className="text-3xl font-bold text-slate-800">¡Hola, {user?.name || 'Ciudadano'}! 👋</h2>
      <p className="text-slate-600 mt-2">Bienvenido a tu portal gubernamental. Tienes 2 trámites pendientes.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[ { t: 'Pagos Pendientes', v: '$1,250', c: 'text-blue-600' },
         { t: 'Citas Próximas', v: '15 Feb', c: 'text-emerald-600' },
         { t: 'Documentos', v: '8 Archivos', c: 'text-slate-600' }
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.t}</p>
          <p className={`text-2xl font-bold mt-1 ${stat.c}`}>{stat.v}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const Finanzas = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['Agua', 'Luz (CFE)', 'Predial'].map((serv) => (
        <button key={serv} className="p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-500 transition-all text-left group">
          <Wallet className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-slate-800">Pagar {serv}</h4>
          <p className="text-sm text-slate-500">Consulta tu recibo actual</p>
        </button>
      ))}
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700">Historial de Pagos</div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-sm">
          <tr>
            <th className="p-4">Servicio</th>
            <th className="p-4">Monto</th>
            <th className="p-4">Fecha</th>
            <th className="p-4">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="p-4 font-medium">Predial 2026</td>
            <td className="p-4">$2,400.00</td>
            <td className="p-4 text-slate-500 text-sm">05/02/2026</td>
            <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Completado</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Vault = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 min-h-[400px]">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold">Bóveda Digital</h3>
      <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
        <Plus size={18} /> Subir Documento
      </button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {['CURP.pdf', 'Acta_Nacimiento.pdf', 'INE_Front.jpg', 'Licencia.pdf'].map((doc) => (
        <div key={doc} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer text-center group">
          <FileText size={40} className="mx-auto text-slate-400 group-hover:text-blue-500 mb-2" />
          <p className="text-xs font-medium truncate">{doc}</p>
        </div>
      ))}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user] = useState({ name: 'Alexis Espino', email: 'dael@tecmilenio.mx' }); // Simulado por ahora porque todavía no tengo el auth implementada

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'finanzas', label: 'Mis Pagos', icon: Wallet },
    { id: 'citas', label: 'Citas y Trámites', icon: Calendar },
    { id: 'boveda', label: 'Bóveda Digital', icon: ShieldCheck },
    { id: 'noticias', label: 'Noticias', icon: Newspaper },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar Lateral */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-[#1a56db] text-white flex flex-col shadow-xl z-20"
      >
        <div className="p-6 flex items-center gap-3 overflow-hidden">
          <div className="bg-white p-2 rounded-lg shrink-0">
            <ShieldCheck className="text-[#1a56db]" size={24} />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl whitespace-nowrap">Ciudadano</span>}
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-emerald-400' : 'text-blue-200'} />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-4 p-3 w-full hover:bg-white/5 rounded-xl transition-all text-blue-200">
            <LogOut size={22} />
            {isSidebarOpen && <span className="font-medium text-white">Cerrar Sesión</span>}
          </button>
        </div>
      </motion.aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Barra Superior */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar trámites, citas..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-blue-600">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-tighter">ID: 002345</p>
              </div>
              <div className="bg-slate-200 p-2 rounded-full text-slate-600">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Contenido Dinámico */}
        <section className="flex-1 p-8 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard user={user} />}
              {activeTab === 'finanzas' && <Finanzas />}
              {activeTab === 'boveda' && <Vault />}
              {activeTab !== 'dashboard' && activeTab !== 'finanzas' && activeTab !== 'boveda' && (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
                  <Clock size={48} className="mb-4 opacity-20" />
                  <p className="text-lg">Módulo "{activeTab}" en desarrollo para DevOps Final</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}