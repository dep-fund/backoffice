import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logoDepFund from '@shared/img/logo_regency.jpg';
import './UserRoleEditPage.css';

const UserRoleEditPage: React.FC = () => {
  const navigate = useNavigate();

  // MOCK temporal para evitar pantalla vacía
  const userData = {
    name: 'Pendiente',
    last_name: 'de implementación',
    username: 'user_test',
    birthdate: null,
    email: 'pendiente@backend.com',
    role: 'N/A',
    blocked: false,
  };

  return (
    <div className="ure-container">
      <div className="ure-columns">

        {/* LEFT */}
        <div className="ure-visual-side">
          <div className="ure-dark-overlay"></div>
          <div className="ure-visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="ure-logo" />
            <h1 className="ure-visual-title">Detalle de Usuario</h1>
            <p className="ure-visual-subtitle">
              Información completa del perfil.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ure-form-side">
          <div className="ure-wrapper">

            <header className="ure-header">
              <h2>Información de Usuario</h2>
              <p>Vista de solo lectura del perfil seleccionado.</p>
            </header>

            {/* MENSAJE PRINCIPAL */}
            <div className="ure-error-box" style={{ marginBottom: '15px' }}>
              ⚠️ Esta pantalla aún no está conectada al backend.  
              <br />
              Tarea pendiente: implementar GET /admin/users/{'{id}'}
            </div>

            {/* UI intacta */}
            <div className="ure-grid">

              <div className="ure-field">
                <label className="ure-label">Nombre</label>
                <div className="ure-value">{userData.name}</div>
              </div>

              <div className="ure-field">
                <label className="ure-label">Apellido</label>
                <div className="ure-value">{userData.last_name}</div>
              </div>

              <div className="ure-field">
                <label className="ure-label">Usuario</label>
                <div className="ure-value ure-value--highlight">
                  @{userData.username}
                </div>
              </div>

              <div className="ure-field ure-full">
                <label className="ure-label">Email</label>
                <div className="ure-value">{userData.email}</div>
              </div>

              <div className="ure-field ure-full">
                <label className="ure-label">Rol</label>
                <div className="ure-value">
                  <span className="ure-role-tag">{userData.role}</span>
                </div>
              </div>

              <div className="ure-field ure-full">
                <label className="ure-label">Estado</label>
                <div className="ure-value">
                  <span className={`ure-status-tag`}>
                    {userData.blocked ? 'Bloqueado' : 'Activo'}
                  </span>
                </div>
              </div>

            </div>

            <div className="ure-footer">
              <button
                className="ure-back-btn"
                onClick={() => navigate(-1)}
              >
                ← Volver
              </button>

              <Link to="/users" className="ure-users-btn">
                Ver todos los usuarios
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleEditPage;