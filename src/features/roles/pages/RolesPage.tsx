import {
  Plus,
  SquarePen,
} from 'lucide-react';

import { useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';

import {
  createRole,
} from '../services/rolesService';

import { useRoles } from '../hooks/useRoles';

import RoleModal from '../components/RoleModal';

import './RolesPage.css';

const RolesPage = () => {
  const { token } = useAuthContext();

  const {
    roles,
    loading,
    error,
  } = useRoles();

  const [openModal, setOpenModal] =
    useState(false);

  const [type, setType] =
    useState('');

  const [creating, setCreating] =
    useState(false);

  const resetModal = () => {
    setOpenModal(false);

    setType('');
  };

  const handleCreate = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!token) return;

    try {
      setCreating(true);

      await createRole(token, {
        type,
      });

      window.location.reload();
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div>
        <div className="roles-header">
          <span>
            {roles.length} roles registrados
          </span>

          <button
            className="new-role-btn"
            onClick={() => {
              setType('');

              setOpenModal(true);
            }}
          >
            <Plus size={16} />
            Nuevo Rol
          </button>
        </div>

        {error && (
          <div className="roles-error">
            {error}
          </div>
        )}

        <div className="roles-table-wrap">
          {loading ? (
            <div className="roles-loading">
              Cargando roles...
            </div>
          ) : (
            <table className="roles-table">
              <thead>
                <tr>
                  <th>TIPO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="role-name">
                      {role.type}
                    </td>

                    <td>
                      <button
                        className="role-edit-btn"
                      >
                        <SquarePen size={14} />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <RoleModal
        open={openModal}
        title="Crear Rol"
        loading={creating}
        type={type}
        onClose={resetModal}
        onSubmit={handleCreate}
        setType={setType}
      />
    </>
  );
};

export default RolesPage;