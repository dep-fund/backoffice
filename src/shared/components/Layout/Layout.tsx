import {
  type ReactNode,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { useAuthContext } from '../../context/AuthContext';
import './Layout.css';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Bienvenido al panel administrativo',
  },
  '/users': {
    title: 'Usuarios',
    subtitle: 'Administración de usuarios registrados',
  },
  '/projects': {
    title: 'Proyectos',
    subtitle: 'Gestión y revisión de proyectos',
  },
  '/categories': {
    title: 'Categorías',
    subtitle: 'Administración de categorías',
  },
  '/roles': {
    title: 'Roles',
    subtitle: 'Administración de roles',
  },
  '/permissions': {
    title: 'Permisos',
    subtitle: 'Administración de permisos',
  },
  '/role-permissions': {
    title: 'Roles y Permisos',
    subtitle: 'Asignación de permisos a roles',
  },
  '/profile': {
    title: 'Mi Perfil',
    subtitle: 'Información de la cuenta',
  },
};
interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { user } = useAuthContext();
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] ?? { title: 'Panel Admin', subtitle: '' };

  const initials = user
    ? `${user.name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : 'A';

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout-main">
        <header className="layout-header">
          <div className="layout-page-info">
            <h1>{page.title}</h1>
            {page.subtitle && <p>{page.subtitle}</p>}
          </div>
          <Link to="/profile" className="layout-profile">
            <div className="layout-profile-info">
              <div className="layout-profile-name">
                {user ? `${user.name} ${user.last_name}` : 'Administrador'}
              </div>
              <div className="layout-profile-email">{user?.email ?? ''}</div>
            </div>
            <div className="layout-avatar">
              {user?.image ? (
                <img src={user.image} alt={user.name} />
              ) : (
                initials
              )}
            </div>
          </Link>
        </header>
        <main className="layout-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
