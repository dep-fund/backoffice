import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StandardUserResponse } from '../../../../shared/types/api.types';
import logoDepFund from '@shared/img/logo_regency.jpg';
import '@shared/styles/auth.css'; 
import { listUsers } from '../services/UserService';

const Users: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para la data y paginación
  const [users, setUsers] = useState<StandardUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });

  // 1. Cargar usuarios usando el service
  const loadUsers = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers(page, pagination.pageSize);
      
      // Seteamos los resultados según tu formato JSON
      setUsers(data.results);
      setPagination({
        page: data.page,
        pageSize: data.page_size,
        total: data.total,
        totalPages: data.total_pages ?? 0
      });
    } catch (err: any) {
      setError('Error al conectar con el servidor de administración.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  // 2. Manejo de acciones (Aquí podrías importar un patchUser de tu service)
  const handleBlockUser = (id: string, username: string) => {
    if (window.confirm(`¿Estás seguro de bloquear al usuario @${username}?`)) {
       console.log("Bloqueando usuario:", id);
       // Aquí ejecutarías: await patchUser(id, { blocked: true });
    }
  };

  if (loading && pagination.page === 1) {
    return <div className="loading-screen">Cargando panel de administración...</div>;
  }

  return (
    <div className="login-page-container">
      <div className="login-columns">
        
        {/* BANNER LATERAL/SUPERIOR */}
        <div className="visual-side side-narrow">
          <div className="dark-overlay"></div>
          <div className="visual-content">
            <img src={logoDepFund} alt="DepFund Admin" className="brand-logo-visual" />
            <h1 className="visual-title">Admin</h1>
            <p className="visual-subtitle">Panel de Control de Usuarios.</p>
          </div>
        </div>

        {/* CONTENIDO DE LA TABLA */}
        <div className="form-side side-wide">
          <div className="form-wrapper manager-wrapper" style={{ maxWidth: '1200px' }}>
            <header className="auth-header">
              <h2>Gestión de Usuarios</h2>
              <p>Total de usuarios: <strong>{pagination.total}</strong></p>
            </header>

            {error && <div className="error-box-mini" style={{marginBottom: '15px'}}>{error}</div>}

            <div className="roles-table-container">
              <table className="roles-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td className="role-name-cell">@{u.username}</td>
                        <td>{u.name} {u.last_name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`tag ${u.blocked ? 'tag-blocked' : 'tag-active'}`}>
                            {u.blocked ? 'Bloqueado' : 'Activo'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="action-buttons-flex">
                            <button 
                              className="btn-edit-small"
                              onClick={() => navigate(`/admin/users/${u.id}`)}
                            >
                              Ver Detalle
                            </button>
                            <button 
                              className="btn-delete-small"
                              onClick={() => handleBlockUser(u.id, u.username)}
                            >
                              {u.blocked ? 'Desbloquear' : 'Bloquear'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN SIMPLE */}
            <div className="pagination-controls" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button 
                className="logout-button" 
                disabled={pagination.page <= 1}
                onClick={() => loadUsers(pagination.page - 1)}
              >
                Anterior
              </button>
              <span style={{alignSelf: 'center'}}>Página {pagination.page} de {pagination.totalPages}</span>
              <button 
                className="logout-button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadUsers(pagination.page + 1)}
              >
                Siguiente
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;