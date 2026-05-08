import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import './UsersPage.css';

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric', year: 'numeric' });

const getInitials = (name: string, lastName: string) =>
  `${name.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const UsersPage = () => {
  const {
    users,
    total,
    page,
    totalPages,
    loading,
    error,
    search,
    setSearch,
    setPage,
    handleToggleBlock,
  } = useUsers();

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div>
      <div className="users-header">
        <span className="users-count">{total} usuarios encontrados</span>
        <div className="users-search-wrap">
          <Search size={15} />
          <input
            className="users-search-input"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="users-error">{error}</div>}

      <div className="users-table-wrap">
        {loading ? (
          <div className="users-loading">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="users-empty">No se encontraron usuarios.</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>USUARIO</th>
                <th>EMAIL</th>
                <th>ESTADO</th>
                <th>FECHA REGISTRO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {u.image ? (
                          <img src={u.image} alt={u.username} />
                        ) : (
                          getInitials(u.name, u.last_name)
                        )}
                      </div>
                      <div>
                        <div className="user-name">{u.username}</div>
                        <div className="user-lastname">
                          {u.name} {u.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <div className="badge-row">
                      <span className={`badge ${u.activated ? 'badge-active' : 'badge-inactive'}`}>
                        {u.activated ? 'Activado' : 'Inactivo'}
                      </span>
                      {u.blocked && <span className="badge badge-blocked">Bloqueado</span>}
                    </div>
                  </td>
                  <td>{formatDate(u.created_at)}</td>
                  <td>
                    <button
                      className={`btn-block ${u.blocked ? 'btn-block-green' : 'btn-block-red'}`}
                      onClick={() => handleToggleBlock(u.id)}
                    >
                      {u.blocked ? 'Desbloquear' : 'Bloquear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && !loading && (
        <div className="users-pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
