import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { get, post, del } from '../../../../shared/services/httpClient';
import type { PaginatedResponse } from '../../../../shared/types/api.types';
import logoDepFund from '@shared/img/logo_regency.jpg';
import './RolesPage.css';

export interface Role {
  id: string;
  nombre: string;
  permisos: string[];
}

interface ApiRole {
  id: string;
  type: string;
}

const RolesManager: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRoleName, setNewRoleName] = useState('');

  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    roleName: string;
  } | null>(null);

  const fetchRoles = async () => {
    try {
      const response = await get<PaginatedResponse<ApiRole>>('/admin/role?page=1&page_size=10');
      const mappedRoles: Role[] = response.results.map((r) => ({
        id: r.id,
        nombre: r.type,
        permisos: []
      }));
      setRoles(mappedRoles);
      setError('');
    } catch {
      setError('Error al obtener los roles del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      await post('/admin/role', { type: newRoleName.toUpperCase() }, true);
      setNewRoleName('');
      fetchRoles();
    } catch {
      setError('No se pudo crear el nuevo rol.');
    }
  };

  const handleDeleteRole = (nombre: string) => {
    setDeleteModal({ visible: true, roleName: nombre });
  };

  const confirmDeleteRole = async () => {
    if (!deleteModal) return;
    try {
      await del(`/admin/role?type=${deleteModal.roleName}`);
      fetchRoles();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al eliminar el rol.');
    } finally {
      setDeleteModal(null);
    }
  };

  if (loading) return <div className="rp-loading-screen">Cargando roles...</div>;

  return (
    <div className="rp-login-page-container">

      {/* MODAL ELIMINAR ROL */}
      {deleteModal?.visible && (
        <div className="rp-modal-backdrop">
          <div className="rp-modal">
            <div className="rp-modal-icon rp-modal-icon--warning">⚠</div>
            <h3 className="rp-modal-title">¿Eliminar rol?</h3>
            <p className="rp-modal-text">
              Estás por eliminar el rol <strong>{deleteModal.roleName}</strong>. Esta acción es permanente y no se puede deshacer.
            </p>
            <div className="rp-modal-buttons">
              <button className="rp-modal-btn-cancel" onClick={() => setDeleteModal(null)}>
                Cancelar
              </button>
              <button className="rp-modal-btn-confirm" onClick={confirmDeleteRole}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rp-login-columns">

        {/* LEFT */}
        <div className="rp-visual-side rp-side-narrow">
          <div className="rp-dark-overlay"></div>
          <div className="rp-visual-content">
            <img src={logoDepFund} className="rp-brand-logo-visual" alt="Logo" />
            <h1 className="rp-visual-title">Gestión de Roles</h1>
            <p className="rp-visual-subtitle">Controla los niveles de acceso al sistema.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rp-form-side rp-side-wide">
          <div className="rp-form-wrapper rp-manager-wrapper">

            <header className="rp-auth-header">
              <h2>Administración de Roles</h2>
              <p>Visualiza, crea o gestiona los permisos de la plataforma.</p>
            </header>

            {error && <div className="rp-error-box-mini">{error}</div>}

            <div className="rp-roles-table-container">
              <table className="rp-roles-table">
                <thead>
                  <tr>
                    <th>Nombre del Rol</th>
                    <th>Editar</th>
                    <th>Baja</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(role => (
                    <tr key={role.id}>
                      <td className="rp-role-name-cell">{role.nombre}</td>
                      <td>
                        <button
                          className="rp-btn-edit-small"
                          onClick={() => navigate(`/roles/edit/${role.id}`, { state: { role } })}
                        >
                          Editar
                        </button>
                      </td>
                      <td>
                        <button
                          className="rp-btn-delete-small"
                          onClick={() => handleDeleteRole(role.nombre)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rp-add-role-section">
              <div className="rp-divider"></div>
              <h3>Dar de Alta Nuevo Rol</h3>
              <form onSubmit={handleAddRole} className="rp-add-role-form">
                <div className="rp-input-group">
                  <div className="rp-input-input-wrapper">
                    <input
                      type="text"
                      placeholder="Nombre del nuevo rol..."
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                    />
                    <span className="rp-input-highlight"></span>
                  </div>
                </div>
                <button type="submit" className="rp-login-button">
                  Dar de Alta
                </button>
              </form>
            </div>

            <div className="rp-footer">
              <Link to="/dashboard" className="rp-back-btn">
                ← Volver al Dashboard
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesManager;