import {
  Plus,
  Trash2,
} from 'lucide-react';

import { useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';

import {
  createRole,
  deleteRole,
} from '../services/rolesService';

import { useRoles } from '../hooks/useRoles';

import RoleModal from '../components/RoleModal';
import DeleteRoleModal from '../components/DeleteRoleModal';

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

  const [openDeleteModal, setOpenDeleteModal] =
    useState(false);

  const [selectedRole, setSelectedRole] =
    useState('');

  const [deleting, setDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState('');

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

  const handleDelete = async () => {
    if (!token) return;
  
    try {
      setDeleting(true);
      setDeleteError('');
  
      await deleteRole(
        token,
        selectedRole,
      );
  
      setOpenDeleteModal(false);
  
      window.location.reload();
    } catch {
      setDeleteError(
        'No se puede eliminar un rol que tiene usuarios asignados.',
      );
    } finally {
      setDeleting(false);
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
                        className="role-delete-btn"
                        onClick={() => {
                          setSelectedRole(
                            role.type,
                          );

                          setOpenDeleteModal(
                            true,
                          );
                        }}
                      >
                        <Trash2 size={14} />
                        Eliminar
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

      <DeleteRoleModal
        open={openDeleteModal}
        roleType={selectedRole}
        loading={deleting}
        error={deleteError}
        onClose={() => {
          setOpenDeleteModal(false);
          setDeleteError('');
        }}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default RolesPage;