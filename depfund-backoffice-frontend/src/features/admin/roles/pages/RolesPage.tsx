import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { get, post, del } from '../../../../shared/services/httpClient';
import type { PaginatedResponse } from '../../../../shared/types/api.types';
import '@shared/styles/auth.css';
import logoDepFund from '@shared/img/logo_regency.jpg';

// Mantenemos tu interfaz tal cual
export interface Role {
  id: number;
  nombre: string;
  permisos: string[];
}

// Interfaz para mapear lo que viene del backend
interface ApiRole {
  type: string;
}

const RolesManager: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. Estados
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newRoleName, setNewRoleName] = useState('');

  // 2. Cargar Roles desde el Backend
  const fetchRoles = async () => {
    try {
      const response = await get<PaginatedResponse<ApiRole>>('/admin/role?page=1&page_size=10');
      
      // Mapeamos el "type" del back al "nombre" de tu estructura de visualización
      const mappedRoles: Role[] = response.results.map((r, index) => ({
        id: index, // El backend actual no devuelve ID numérico, usamos el index
        nombre: r.type,
        permisos: ['Lectura'] // O los permisos que decidas por defecto
      }));
      
      setRoles(mappedRoles);
      setError('');
    } catch (err) {
      setError('Error al obtener los roles del servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // 3. Dar de Alta (POST)
  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      await post('/admin/role', { type: newRoleName.toUpperCase() }, true);
      setNewRoleName('');
      fetchRoles(); // Recargar lista
    } catch (err) {
      setError('No se pudo crear el nuevo rol.');
    }
  };

  // 4. Baja de Rol (DELETE)
  const handleDeleteRole = async (nombre: string) => {
    if (window.confirm(`¿Estás seguro de que deseas dar de baja el rol: ${nombre}?`)) {
      try {
        await del(`/admin/role?type=${nombre}`);
        fetchRoles();
      }  catch (err: any) {
          console.log(err);

          const backendMessage =
            err?.response?.data?.message ||
            err?.message ||
            'Error al eliminar el rol.';

          setError(backendMessage);
        }
    }
  };

  if (loading) return <div className="loading-screen">Cargando roles...</div>;

  return (
    <div className="login-page-container">
      <div className="login-columns">
        <div className="visual-side side-narrow">
          <div className="dark-overlay"></div>
          <div className="visual-content">
            <img src={logoDepFund} alt="DepFund Logo" className="brand-logo-visual" />
            <h1 className="visual-title">Gestión de Roles</h1>
            <p className="visual-subtitle">Controla los niveles de acceso al sistema.</p>
          </div>
        </div>

        <div className="form-side side-wide">
          <div className="form-wrapper manager-wrapper">
            <header className="auth-header">
              <h2>Administración de Roles</h2>
              <p>Visualiza, crea o gestiona los permisos de la plataforma.</p>
            </header>

            {/* Muestra error si existe */}
            {error && <div className="error-box-mini" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

            <div className="roles-table-container">
              <table className="roles-table">
                <thead>
                  <tr>
                    <th>Nombre del Rol</th>
                    <th>Permisos Asociados</th>
                    <th className="text-center">Editar</th>
                    <th className="text-center">Baja</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map(role => (
                    <tr key={role.id}>
                      <td className="role-name-cell">{role.nombre}</td>
                      <td>
                        <div className="permissions-tags">
                          {role.permisos.map((p, idx) => (
                            <span key={idx} className="tag">{p}</span>
                          ))}
                        </div>
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn-edit-small"
                          onClick={() => navigate(`/roles/edit/${role.id}`, { state: { role } })}
                        >
                          Editar 
                        </button>
                      </td>
                      <td className="text-center">
                        <button 
                          className="btn-delete-small"
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

            <div className="add-role-section">
              <div className="divider"></div>
              <h3>Dar de Alta Nuevo Rol</h3>
              <form onSubmit={handleAddRole} className="add-role-form">
                <div className="input-group">
                  <div className="input-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nombre del nuevo rol..." 
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      required
                    />
                    <span className="input-highlight"></span>
                  </div>
                </div>
                <button type="submit" className="login-button add-btn">Dar de Alta</button>
              </form>
            </div>
            <Link to="/dashboard" className="btn-link-muted mt-20">Volver al Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesManager;
