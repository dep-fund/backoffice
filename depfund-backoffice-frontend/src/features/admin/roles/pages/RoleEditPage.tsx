import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '@shared/styles/auth.css';
import logoDepFund from '@shared/img/logo_regency.jpg';
import { 
  assignPermissionToRole, 
  listPermissions, 
  listRolePermissions, 
  type PermissionResponse, 
  type RolePermissionResponse 
} from '../../permissions/PermissionsService';

const RoleEditPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // roleData viene de la tabla de Roles (trae id, nombre/type)
  const roleData = location.state?.role;
  console.log("ROLE DATA:", roleData);

  const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>([]);
  const [currentRolePermissions, setCurrentRolePermissions] = useState<RolePermissionResponse[]>([]);
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!roleData) return;
    setLoading(true);
    try {
      // 1. Recuperamos TODOS los permisos globales y la matriz de asignaciones
      const [respAll, respMatrix] = await Promise.all([
        listPermissions(1, 100),
        listRolePermissions(1, 100)
      ]);

      setAllPermissions(respAll.results);
      
      // 2. Filtramos la matriz para mostrar solo los permisos ACTIVOS de este ROL
      // Usamos los campos 'role' o 'role_id' según lo que devuelve tu backend
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
      // Enviamos la vinculación a la base de datos
      console.log("ROLE ID " + roleData.id)
      console.log("SELECTED PERMISSION ID "+ selectedPermissionId)
      await assignPermissionToRole({
        role_id: String(roleData.id),
        permission_id: String(selectedPermissionId)
      });
      
      setSelectedPermissionId('');
      await loadData()
    } catch (err: any) {
      console.log("ASSIGN ERROR:", err?.response?.data || err);
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'No se pudo asignar el permiso.'
      );
    }
  };

  const handleRemove = async (permissionId: string) => {
    // Nota: Aquí deberías llamar a un del(`/admin/permission/role-permissions...`) si existe
    if (window.confirm("¿Seguro que deseas remover este permiso del rol?")) {
      alert('Funcionalidad de borrado en desarrollo (requiere endpoint DELETE)');
    }
  };

  if (!roleData) return <div className="login-page-container">Error: Rol no especificado.</div>;
  if (loading) return <div className="loading-screen">Cargando privilegios...</div>;

  return (
    <div className="login-page-container">
      <div className="login-columns">
        <div className="visual-side side-narrow">
          <div className="dark-overlay"></div>
          <div className="visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="brand-logo-visual" />
            <h1 className="visual-title">Privilegios</h1>
            <p className="visual-subtitle">Editando rol: {roleData.nombre || roleData.type}</p>
          </div>
        </div>

        <div className="form-side side-wide">
          <div className="form-wrapper manager-wrapper" style={{ maxWidth: '850px' }}>
            <header className="auth-header">
              <h2>Gestionar Permisos</h2>
              <p>Asigna acciones de la base de datos al rol seleccionado.</p>
              {error && <p className="error-text" style={{color: 'red'}}>{error}</p>}
            </header>

            <div className="current-permissions-box">
              <h3>Permisos Activos en DB</h3>
              <div className="permissions-grid-edit">
                {currentRolePermissions.length > 0 ? (
                  currentRolePermissions.map((rp, idx) => (
                    <div key={idx} className="tag-edit">
                      {/* IMPORTANTE: Usamos 'permission' que es el campo string de tu interfaz */}
                      {rp.permission} 
                      <button type="button" onClick={() => handleRemove(rp.permission_id)}>×</button>
                    </div>
                  ))
                ) : (
                  <p className="empty-msg">No hay permisos asignados a este rol.</p>
                )}
              </div>
            </div>

           <div className="add-permission-section">
            <div className="divider"></div>
            <h3>Vincular Nuevo Permiso</h3>

            <form onSubmit={handleAddPermission} className="add-role-form">
              <div className="input-group">
                <select
                  className="custom-select"
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
                      <option
                        key={p.id}
                        value={p.id}
                        disabled={yaAsignado}
                      >
                        {p.type} {yaAsignado ? "(Ya asignado)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              <button type="submit" className="login-button add-btn">
                Asignar
              </button>
            </form>
          </div>

            <div className="button-group-row" style={{ marginTop: '30px' }}>
                <button onClick={() => navigate('/RolePage')} className="login-button">
                    Finalizar
                </button>
                <Link to="/RolePage" className="btn-link-muted">Volver</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleEditPage;
