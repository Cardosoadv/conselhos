import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Professions from './pages/Professions';
import Professionals from './pages/Professionals';
import Companies from './pages/Companies';

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div id="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo-wrap">
            <span className="logo-mark" style={{color: 'white', fontWeight: 'bold', fontSize: '1.2rem'}}>CONSELHOS</span>
          </div>
          <span className="brand-version">v1.1.0</span>
        </div>
        
        <div className="sidebar-section">Menu</div>
        <ul className="sidebar-nav">
          <li>
            <a href="/" className="active">
              <i className="nav-icon">🏠</i> Dashboard
            </a>
          </li>
          <li>
            <a href="/processos">
              <i className="nav-icon">📄</i> Processos
            </a>
          </li>
          <li>
            <a href="/professions">
              <i className="nav-icon">💼</i> Profissões
            </a>
          </li>
          <li>
            <a href="/professionals">
              <i className="nav-icon">👤</i> Profissionais
            </a>
          </li>
          <li>
            <a href="/companies">
              <i className="nav-icon">🏢</i> Empresas
            </a>
          </li>
          <li>
            <a href="/settings">
              <i className="nav-icon">⚙️</i> Configurações
            </a>
          </li>
        </ul>
      </aside>

      <main className="main-wrapper">
        <header className="topbar">
          <div className="topbar-title">Visão Geral</div>
          <div className="topbar-search">
            <i>🔍</i>
            <input type="text" placeholder="Buscar..." />
          </div>
          <div className="topbar-actions" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <span style={{fontWeight: 'bold'}}>{user?.name}</span>
            <button className="topbar-icon-btn">
              <i>🔔</i>
              <span className="badge-dot"></span>
            </button>
            <div className="topbar-avatar" title={user?.email || ''}>
              {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <button onClick={handleLogout} className="btn btn-sm btn-outline-danger" style={{padding: '4px 8px', fontSize: '0.8rem'}}>
              Sair
            </button>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Bem-vindo ao novo projeto administrativo, {user?.name}!</p>
        </div>
        <button className="btn btn-primary">Novo Registro</button>
      </div>

      <div className="content-grid">
        <div className="main-column">
          <div className="card">
            <div className="card-header">
              <h3><i>📊</i> Estatísticas</h3>
            </div>
            <div className="card-body">
              <p>Conteúdo principal do dashboard...</p>
            </div>
          </div>
        </div>
        <div className="sidebar-widgets">
          <div className="card">
            <div className="card-header">
              <h3>Atividades Recentes</h3>
            </div>
            <div className="card-body p-0">
              <ul className="widget-list">
                <li>
                  <span className="process-num">Nova Atualização</span>
                  <span className="process-date">Hoje</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Processos() {
  return (
    <div>
      <div className="page-header">
        <h1>Processos</h1>
      </div>
      <div className="card">
        <div className="card-body">Lista de Processos...</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas Privadas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/processos" element={<Layout><Processos /></Layout>} />
            <Route path="/professions" element={<Layout><Professions /></Layout>} />
            <Route path="/professionals" element={<Layout><Professionals /></Layout>} />
            <Route path="/companies" element={<Layout><Companies /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
