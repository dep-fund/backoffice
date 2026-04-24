import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import logoDepFund from '@shared/img/logo_regency.jpg';
import './PermissionEditPage.css';

const PermiseEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.permiso;

  const [accion, setAccion] = useState(data?.type || data?.accion || '');

  if (!data) return <div className="pe-container">Error: Permiso no encontrado.</div>;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Acción actualizada: ${accion}`);
    navigate('/permisos');
  };

  return (
    <div className="pe-container">
      <div className="pe-columns">

        {/* LEFT */}
        <div className="pe-visual-side">
          <div className="pe-dark-overlay"></div>
          <div className="pe-visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="pe-logo" />
            <h1 className="pe-visual-title">Editar Permiso</h1>
            <p className="pe-visual-subtitle">Modificá el identificador de la acción.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="pe-form-side">
          <div className="pe-wrapper">

            <header className="pe-header">
              <h2>Editar Permiso</h2>
              <p>Modificá el nombre del permiso del sistema.</p>
            </header>

            <form onSubmit={handleUpdate} className="pe-form">

              <div className="pe-field">
                <label className="pe-label">Identificador del permiso</label>
                <input
                  className="pe-input"
                  type="text"
                  value={accion}
                  onChange={(e) => setAccion(e.target.value)}
                  placeholder="ej: users:create"
                  required
                />
              </div>

              <div className="pe-footer">
                <button type="submit" className="pe-submit-btn">
                  Actualizar Permiso
                </button>
                <Link to="/permisos" className="pe-back-btn">
                  Cancelar
                </Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermiseEdit;