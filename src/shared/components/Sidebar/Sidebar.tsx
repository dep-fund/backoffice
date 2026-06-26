import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Tag,
  Shield,
  Lock,
  KeyRound,
  UserCircle,
  LogOut,
  BarChart3,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/users', label: 'Usuarios', icon: Users },
  { path: '/projects', label: 'Proyectos', icon: FolderKanban },
  { path: '/categories', label: 'Categorías', icon: Tag },
  { path: '/roles', label: 'Roles', icon: Shield },
  { path: '/permissions', label: 'Permisos', icon: Lock },
  { path: '/role-permissions', label: 'Roles y Permisos', icon: KeyRound },
  { path: '/reports/fundraising', label: 'Reportes', icon: BarChart3 },
  { path: '/profile', label: 'Mi Perfil', icon: UserCircle },
];

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuthContext();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Link to="/dashboard">
          <span className="logo-text">
            <span className="logo-dep">Dep</span>
            <span className="logo-fund">Fund</span>
          </span>
        </Link>
        <div className="sidebar-panel-label">Panel Admin</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-item ${location.pathname.startsWith(path) ? 'active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;