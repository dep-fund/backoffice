import React, { useState, useEffect } from 'react';
<<<<<<< HEAD:src/features/admin/roles/pages/RoleEditPage.tsx
import { useLocation, Link } from 'react-router-dom';
import '@shared/styles/auth.css';
=======
import { useLocation, useNavigate, Link } from 'react-router-dom';
>>>>>>> arreglando-front:depfund-backoffice-frontend/src/features/admin/roles/pages/RoleEditPage.tsx
import logoDepFund from '@shared/img/logo_regency.jpg';
import { 
  assignPermissionToRole, 
  listPermissions, 
  listRolePermissions, 
  removePermissionFromRole, 
  type PermissionResponse, 
  type RolePermissionResponse 
} from '../../permissions/PermissionsService';
import './RoleEditPage.css';

const RoleEditPage: React.FC = () => {
  const location = useLocation();
  
  const roleData = location.state?.role;

  const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>([]);
  const [currentRolePermissions, setCurrentRolePermissions] = useState<RolePermissionResponse[]>([]);
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [removeModal, setRemoveModal] = useState<{
    visible: boolean;
    permissionId: string;
    permissionName: string;
  } | null>(null);

  const loadData = async () => {
    if (!roleData) return;
    setLoading(true);
    try {
      const [respAll, respMatrix] = await Promise.all([
        listPermissions(1, 100),
        listRolePermissions(1, 100)
      ]);

      setAllPermissions(respAll.results);

      const filtered = respMatrix.results.filter(
        rp => rp.role_id === roleData.id || rp.role === roleData.nombre || rp.role === roleData.type
      );

      setCurrentRolePermissions(filtered);
      setError('');
    } catch (err: any) {
      setError('Error al sincronizar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermissionId) return;

    try {
      await assignPermissionToRole({
        role_id: String(roleData.id),
        permission_id: String(selectedPermissionId)
      });
      setSelectedPermissionId('');
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'No se pudo asignar el permiso.'
      );
    }
  };

  const handleRemove = (permissionId: string, permissionName: string) => {
    setRemoveModal({ visible: true, permissionId, permissionName });
  };

  const confirmRemove = async () => {
    if (!removeModal) return;
    try {
      await removePermissionFromRole({
        role_id: String(roleData.id),
        permission_id: removeModal.permissionId
      });
      await loadData();
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'No se pudo remover el permiso.'
      );
    } finally {
      setRemoveModal(null);
    }
  };

  if (!roleData) return <div className="rep-container">Error: Rol no especificado.</div>;
  if (loading) return <div className="rep-loading-screen">Cargando privilegios...</div>;

  return (
    <div className="rep-container">

      {/* MODAL REMOVER PERMISO */}
      {removeModal?.visible && (
        <div className="rep-modal-backdrop">
          <div className="rep-modal">
            <div className="rep-modal-icon rep-modal-icon--warning">⚠</div>
            <h3 className="rep-modal-title">¿Remover permiso?</h3>
            <p className="rep-modal-text">
              Estás por quitar el permiso <strong>{removeModal.permissionName}</strong> de este rol. Podés volver a asignarlo cuando quieras.
            </p>
            <div className="rep-modal-buttons">
              <button className="rep-modal-btn-cancel" onClick={() => setRemoveModal(null)}>
                Cancelar
              </button>
              <button className="rep-modal-btn-confirm" onClick={confirmRemove}>
                Sí, remover
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rep-columns">

        {/* LEFT */}
        <div className="rep-visual-side">
          <div className="rep-dark-overlay"></div>
          <div className="rep-visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="rep-logo" />
            <h1 className="rep-visual-title">Privilegios</h1>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rep-form-side">
          <div className="rep-wrapper">

            <header className="rep-header">
              <h2>Gestionar Permisos del Rol {roleData.nombre || roleData.type}</h2>
              <p>Asigna acciones de la base de datos al rol seleccionado.</p>
              {error && <div className="rep-error-box">{error}</div>}
            </header>

            <div className="rep-current-permissions">
              <h3 className="rep-section-title">Permisos Activos en DB</h3>
              <div className="rep-permissions-grid">
                {currentRolePermissions.length > 0 ? (
                  currentRolePermissions.map((rp, idx) => (
                    <div key={idx} className="rep-permission-tag">
                      {rp.permission}
                      <button
                        type="button"
                        className="rep-tag-remove"
                        onClick={() => handleRemove(rp.permission_id, rp.permission)}
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="rep-empty-msg">No hay permisos asignados a este rol.</p>
                )}
              </div>
            </div>

            <div className="rep-add-section">
              <div className="rep-divider"></div>
              <h3 className="rep-section-title">Vincular Nuevo Permiso</h3>
              <form onSubmit={handleAddPermission} className="rep-add-form">
                <div className="rep-select-group">
                  <select
                    className="rep-select"
                    value={selectedPermissionId}
                    onChange={(e) => setSelectedPermissionId(e.target.value)}
                    required
                  >
                    <option value="">Selecciona una acción...</option>
                    {allPermissions.map((p) => {
                      const yaAsignado = currentRolePermissions.some(
                        (cp) => cp.permission_id === p.id
                      );
                      return (
                        <option key={p.id} value={p.id} disabled={yaAsignado}>
                          {p.type} {yaAsignado ? "(Ya asignado)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <button type="submit" className="rep-submit-btn">
                  Asignar
                </button>
              </form>
            </div>

            <div className="rep-footer">
              <Link to="/dashboard" className="rep-back-btn">
                ← Volver al Dashboard
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleEditPage;