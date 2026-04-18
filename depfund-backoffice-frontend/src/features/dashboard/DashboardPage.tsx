import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import logoDepFund from '@shared/img/logo_regency.jpg';
import Users from '../admin/users/pages/UsersPage';
import RolesManager from '../admin/roles/pages/RolesPage';
import PermissionsPage  from '../admin/permissions/pages/PermissionsPage';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* HEADER / NAVBAR */}
      <header className="dashboard-header">
        <div className="header-brand" onClick={() => navigate('/dashboard')}>
          <img src={logoDepFund} alt="DepFund Logo" className="header-logo" />
          {/* El span interno "Fund" ahora se controla por CSS con el color de la ola */}
          <span className="header-title">Dep<span>Fund</span></span>
        </div>

        <nav className="header-nav">
          <Link to="/Users" className="nav-item">Usuarios</Link>
          <Link to="/roles" className="nav-item">Roles</Link>
          <Link to="/PermissionsPage" className="nav-item">Permisos</Link>
          <Link to="/ProfileView" className="nav-item">Mi Perfil</Link>
          <button className="logout-button" onClick={() => navigate('/login')}>
            Cerrar Sesión
          </button>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-content">
        <section className="welcome-banner">
          <div className="welcome-text">
            <h1>Panel de Administración</h1>
            <p>Control de acceso, gestión de usuarios y configuración de privilegios del sistema.</p>
          </div>

          <div className="quick-actions">
            <Link to="/Users" className="action-card">
              <h3>Gestión de Usuarios</h3>
              <p>Lista completa de miembros, bloqueo de cuentas y detalles de perfiles.</p>
            </Link>

            <Link to="/roles" className="action-card">
              <h3>Gestión de Roles</h3>
              <p>Crea y edita los niveles de acceso (Admin, Inversor, Editor, etc.).</p>
            </Link>

            <Link to="/permisos" className="action-card">
              <h3>Gestión de Permisos</h3>
              <p>Configura qué acciones específicas puede realizar cada rol en la plataforma.</p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;