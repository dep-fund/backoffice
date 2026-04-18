import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '@shared/styles/auth.css';
import logoDepFund from '@shared/img/logo_regency.jpg';
import { assignPermissionToRole, listPermissions, listRolePermissions, type PermissionResponse, type RolePermissionResponse } from '../../permissions/PermissionsService';

const RoleEditPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Recibimos la data del rol desde la navegación (debe traer id y type/nombre)
  const roleData = location.state?.role;

  // 1. Estados
  const [allPermissions, setAllPermissions] = useState<PermissionResponse[]>([]);
  const [currentRolePermissions, setCurrentRolePermissions] = useState<RolePermissionResponse[]>([]);
  const [selectedPermissionId, setSelectedPermissionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. Carga de datos inicial
  const loadData = async () => {
    if (!roleData) return;
    setLoading(true);
    try {
      // Cargamos permisos globales y la matriz de asignaciones
      const [respAll, respMatrix] = await Promise.all([
        listPermissions(1, 100),
        listRolePermissions(1, 100)
      ]);

      setAllPermissions(respAll.results);
      
      // Filtramos la matriz para mostrar solo los permisos de este ROL
      // Comparamos por ID o por Type según cómo lo mande tu navegación
      const filtered = respMatrix.results.filter(
        rp => rp.role_id === roleData.id || rp.role === roleData.nombre || rp.role === roleData.type
      );
      
      setCurrentRolePermissions(filtered);
    } catch (err) {
      setError('Error al sincronizar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 3. Vincular nuevo permiso
  const handleAddPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPermissionId) return;

    try {
      // El endpoint necesita UUIDs: role_id y permission_id
      await assignPermissionToRole({
        role_id: roleData.id,
        permission_id: selectedPermissionId
      });
      
      setSelectedPermissionId('');
      loadData(); // Recargamos la lista visual
    } catch (err) {
      setError('No se pudo asignar el permiso. Reintenta.');
    }
  };

  // 4. Quitar permiso (Baja)
  const handleRemove = async (assignmentId: string) => {
    if (window.confirm("¿Seguro que deseas remover este permiso del rol?")) {
      try {
        // Aquí llamarías al DELETE si existe, por ahora simulamos con el refresh
        // await deleteRolePermission(assignmentId);
        alert('Funcionalidad de borrado vinculada al endpoint DELETE');
        loadData();
      } catch (err) {
        setError('Error al remover el permiso.');
      }
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
              <p>Asigna o remueve permisos para el rol seleccionado.</p>
              {error && <p className="error-text" style={{color: 'red'}}>{error}</p>}
            </header>

            <div className="current-permissions-box">
              <h3>Permisos Activos</h3>
              <div className="permissions-grid-edit">
                {currentRolePermissions.length > 0 ? (
                  currentRolePermissions.map((rp) => (
                    <div key={rp.id} className="tag-edit">
                      {rp.permission_type}
                      <button type="button" onClick={() => handleRemove(rp.id)}>×</button>
                    </div>
                  ))
                ) : (
                  <p className="empty-msg">No hay permisos asignados a este rol.</p>
                )}
              </div>
            </div>

            <div className="add-permission-section">
              <div className="divider"></div>
              <h3>Asignar Nuevo Permiso</h3>
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
                      // Bloqueamos en el select los que ya tiene asignados
                      const yaAsignado = currentRolePermissions.some(cp => cp.permission_id === p.id);
                      return (
                        <option key={p.id} value={p.id} disabled={yaAsignado}>
                          {p.type} {yaAsignado ? '(Ya asignado)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <button type="submit" className="login-button add-btn">Asignar</button>
              </form>
            </div>

            <div className="button-group-row" style={{ marginTop: '30px' }}>
                <button onClick={() => navigate('/RolePage')} className="login-button">
                    Finalizar Edición
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