import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@shared/styles/auth.css';
import logoDepFund from '@shared/img/logo_regency.jpg';
import { createPermission, deletePermission, listPermissions, type PermissionResponse } from '../PermissionsService';

const PermiseManager: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados
  const [permisos, setPermisos] = useState<PermissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newAccion, setNewAccion] = useState('');

  // 1. Cargar Permisos desde el Backend
  const fetchPermisos = async () => {
    try {
      setLoading(true);
      const data = await listPermissions(1, 50); // Traemos una lista amplia
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

  // 2. Alta de Permiso
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccion.trim()) return;

    try {
      await createPermission(newAccion);
      setNewAccion('');
      fetchPermisos(); // Recargamos la lista
    } catch (err: any) {
          const backendMessage =
            err?.response?.data?.message ||
            err?.message ||
            'Error al agregar el permiso.';

          setError(backendMessage);
        }
  };

  // 3. Baja de Permiso
  const handleDelete = async (action: string) => {
    if (window.confirm(`¿Estás seguro de dar de baja el permiso: ${action}?`)) {
      try {
        await deletePermission(action);
        fetchPermisos(); // Recargamos la lista
      } catch (err: any) {
          const backendMessage =
            err?.response?.data?.message ||
            err?.message ||
            'Error al eliminar el permiso.';

          setError(backendMessage);
        }
    }
  };

  if (loading) return <div className="loading-screen">Cargando permisos...</div>;

  return (
    <div className="login-page-container">
      <div className="login-columns">
        <div className="visual-side side-narrow">
          <div className="dark-overlay"></div>
          <div className="visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="brand-logo-visual" />
            <h1 className="visual-title">Gestión de Permisos</h1>
            <p className="visual-subtitle">Asigna acciones específicas a cada usuario.</p>
          </div>
        </div>

        <div className="form-side side-wide">
          <div className="form-wrapper manager-wrapper">
            <header className="auth-header">
              <h2>Listado de Permisos</h2>
              <p>Control de acciones del sistema.</p>
              {error && <p style={{color: '#c53030', fontSize: '0.85rem', marginTop: '10px'}}>{error}</p>}
            </header>

            <div className="roles-table-container">
              <table className="roles-table">
                <thead>
                  <tr>
                    <th>Acción (Identificador)</th>
                    <th className="text-center">Editar</th>
                    <th className="text-center">Baja</th>
                  </tr>
                </thead>
                <tbody>
                  {permisos.map((p, index) => (
                    <tr key={index}>
                      <td><span className="tag">{p.type}</span></td>
                      <td className="text-center">
                        <button 
                          className="btn-edit-small" 
                          onClick={() => navigate(`/permisos/edit/${p.type}`, { state: { permiso: p } })}
                        >
                          Editar
                        </button>
                      </td>
                      <td className="text-center">
                        <button className="btn-delete-small" onClick={() => handleDelete(p.type)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="add-role-section">
              <div className="divider"></div>
              <h3>Dar de Alta Nuevo Permiso</h3>
              <form onSubmit={handleAdd} className="add-role-form">
                <div className="input-group">
                  <div className="input-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Permiso (ej: admin:create:users)" 
                      value={newAccion}
                      onChange={(e) => setNewAccion(e.target.value)}
                      required
                    />
                    <span className="input-highlight"></span>
                  </div>
                </div>
                <button type="submit" className="login-button add-btn">Alta</button>
              </form>
            </div>
            
            <div style={{ marginTop: '20px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-link-muted" style={{background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'}}>
                  Volver al Dashboard
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermiseManager;