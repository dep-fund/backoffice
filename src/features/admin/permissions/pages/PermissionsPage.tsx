import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoDepFund from '@shared/img/logo_regency.jpg';
import { createPermission, deletePermission, listPermissions, type PermissionResponse } from '../PermissionsService';
import './PermissionsPage.css';

const PermiseManager: React.FC = () => {
  const navigate = useNavigate();

  const [permisos, setPermisos] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAccion, setNewAccion] = useState('');

  const [deleteModal, setDeleteModal] = useState<{
    visible: boolean;
    action: string;
  } | null>(null);

  const fetchPermisos = async () => {
    try {
      setLoading(true);
      const data = await listPermissions(1, 50);
      setPermisos(data.results);
    } catch (err: any) {
      setError('Error al conectar con el servidor de permisos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermisos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccion.trim()) return;
    try {
      await createPermission(newAccion);
      setNewAccion('');
      fetchPermisos();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Error al agregar el permiso.'
      );
    }
  };

  const handleDelete = (action: string) => {
    setDeleteModal({ visible: true, action });
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    try {
      await deletePermission(deleteModal.action);
      fetchPermisos();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Error al eliminar el permiso.'
      );
    } finally {
      setDeleteModal(null);
    }
  };

  if (loading) return <div className="pp-loading-screen">Cargando permisos...</div>;

  return (
    <div className="pp-container">

      {/* MODAL ELIMINAR */}
      {deleteModal?.visible && (
        <div className="pp-modal-backdrop">
          <div className="pp-modal">
            <div className="pp-modal-icon pp-modal-icon--warning">⚠</div>
            <h3 className="pp-modal-title">¿Eliminar permiso?</h3>
            <p className="pp-modal-text">
              Estás por dar de baja el permiso <strong>{deleteModal.action}</strong>. Esta acción es permanente.
            </p>
            <div className="pp-modal-buttons">
              <button className="pp-modal-btn-cancel" onClick={() => setDeleteModal(null)}>
                Cancelar
              </button>
              <button className="pp-modal-btn-confirm" onClick={confirmDelete}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pp-columns">

        {/* LEFT */}
        <div className="pp-visual-side">
          <div className="pp-dark-overlay"></div>
          <div className="pp-visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="pp-logo" />
            <h1 className="pp-visual-title">Gestión de Permisos</h1>
            <p className="pp-visual-subtitle">Asigna acciones específicas a cada usuario.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="pp-form-side">
          <div className="pp-wrapper">

            <header className="pp-header">
              <h2>Listado de Permisos</h2>
              <p>Control de acciones del sistema.</p>
              {error && <div className="pp-error-box">{error}</div>}
            </header>

            <div className="pp-table-container">
              <table className="pp-table">
                <thead>
                  <tr>
                    <th>Acción (Identificador)</th>
                    <th className="pp-text-center">Editar</th>
                    <th className="pp-text-center">Baja</th>
                  </tr>
                </thead>
                <tbody>
                  {permisos.map((p, index) => (
                    <tr key={index}>
                      <td>
                        <span className="pp-tag">{p.type}</span>
                      </td>
                      <td className="pp-text-center">
                        <button
                          className="pp-btn-edit"
                          onClick={() => navigate(`/permisos/edit/${p.type}`, { state: { permiso: p } })}
                        >
                          Editar
                        </button>
                      </td>
                      <td className="pp-text-center">
                        <button
                          className="pp-btn-delete"
                          onClick={() => handleDelete(p.type)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pp-add-section">
              <div className="pp-divider"></div>
              <h3 className="pp-section-title">Dar de Alta Nuevo Permiso</h3>
              <form onSubmit={handleAdd} className="pp-add-form">
                <div className="pp-input-group">
                  <input
                    type="text"
                    className="pp-input"
                    placeholder="Permiso (ej: users:create)"
                    value={newAccion}
                    onChange={(e) => setNewAccion(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="pp-submit-btn">
                  Alta
                </button>
              </form>
            </div>

            <div className="pp-footer">
              <Link to="/dashboard" className="pp-back-btn">
                ← Volver al Dashboard
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PermiseManager;