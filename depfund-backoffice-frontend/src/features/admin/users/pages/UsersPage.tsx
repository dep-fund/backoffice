import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { StandardUserResponse } from '../../../../shared/types/api.types';
import logoDepFund from '@shared/img/logo_regency.jpg';
import { listUsers, toggleUserBlock } from '../services/UserService';
import './UsersPage.css';

const Users: React.FC = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<StandardUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });

  const [blockModal, setBlockModal] = useState<{
    visible: boolean;
    userId: string;
    username: string;
    isBlocked: boolean;
  } | null>(null);

  const loadUsers = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await listUsers(page, pagination.pageSize);
      setUsers(data.results);
      setPagination({
        page: data.page,
        pageSize: data.page_size,
        total: data.total,
        totalPages: data.total_pages
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

  const handleBlockUser = (id: string, username: string, isBlocked: boolean) => {
    setBlockModal({ visible: true, userId: id, username, isBlocked });
  };

  const confirmBlockUser = async () => {
    if (!blockModal) return;
    try {
      const updated = await toggleUserBlock(blockModal.userId);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    } catch {
      setError('Error al cambiar el estado del usuario.');
    } finally {
      setBlockModal(null);
    }
  };

  if (loading && pagination.page === 1) {
    return <div className="up-loading-screen">Cargando panel de administración...</div>;
  }

  return (
    <div className="up-container">

      {/* MODAL BLOQUEO */}
      {blockModal?.visible && (
        <div className="up-modal-backdrop">
          <div className="up-modal">
            <div className={`up-modal-icon ${blockModal.isBlocked ? 'up-modal-icon--success' : 'up-modal-icon--warning'}`}>
              {blockModal.isBlocked ? '✓' : '⚠'}
            </div>
            <h3 className="up-modal-title">
              {blockModal.isBlocked ? 'Desbloquear usuario' : 'Bloquear usuario'}
            </h3>
            <p className="up-modal-text">
              {blockModal.isBlocked
                ? <>¿Querés restaurar el acceso a <strong>@{blockModal.username}</strong>?</>
                : <>¿Estás seguro de que querés bloquear a <strong>@{blockModal.username}</strong>? No podrá iniciar sesión.</>
              }
            </p>
            <div className="up-modal-buttons">
              <button className="up-modal-btn-cancel" onClick={() => setBlockModal(null)}>
                Cancelar
              </button>
              <button
                className={`up-modal-btn-confirm ${blockModal.isBlocked ? 'up-modal-btn-confirm--green' : 'up-modal-btn-confirm--red'}`}
                onClick={confirmBlockUser}
              >
                {blockModal.isBlocked ? 'Sí, desbloquear' : 'Sí, bloquear'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="up-columns">

        {/* BANNER LATERAL */}
        <div className="up-visual-side">
          <div className="up-dark-overlay"></div>
          <div className="up-visual-content">
            <img src={logoDepFund} alt="DepFund Admin" className="up-logo" />
            <h1 className="up-visual-title">Admin</h1>
            <p className="up-visual-subtitle">Panel de Control de Usuarios.</p>
          </div>
        </div>

        {/* CONTENIDO */}
        <div className="up-form-side">
          <div className="up-wrapper">

            <header className="up-header">
              <h2>Gestión de Usuarios</h2>
              <p>Total de usuarios: <strong>{pagination.total}</strong></p>
            </header>

            {error && <div className="up-error-box">{error}</div>}

            <div className="up-table-container">
              <table className="up-table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Estado</th>
                    <th className="up-text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id}>
                        <td className="up-username-cell">@{u.username}</td>
                        <td>{u.name} {u.last_name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`up-tag ${u.blocked ? 'up-tag-blocked' : 'up-tag-active'}`}>
                            {u.blocked ? 'Bloqueado' : 'Activo'}
                          </span>
                        </td>
                        <td className="up-text-center">
                          <div className="up-action-buttons">
                            <button
                              className="up-btn-detail"
                              onClick={() =>
                                navigate(`/users/edit-role/${u.id}`, {
                                  state: { user: u }
                                })
                              }
                            >
                              Ver Detalle
                            </button>
                            <button
                              className="up-btn-block"
                              onClick={() => handleBlockUser(u.id, u.username, u.blocked)}
                            >
                              {u.blocked ? 'Desbloquear' : 'Bloquear'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="up-empty-row">
                        No se encontraron usuarios.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="up-pagination">
              <button
                className="up-pagination-btn"
                disabled={pagination.page <= 1}
                onClick={() => loadUsers(pagination.page - 1)}
              >
                Anterior
              </button>
              <span className="up-pagination-info">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                className="up-pagination-btn"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => loadUsers(pagination.page + 1)}
              >
                Siguiente
              </button>
            </div>

            <div className="up-footer">
              <Link to="/dashboard" className="up-back-btn">
                ← Volver al Dashboard
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;