import {
  Plus,
  Trash2,
} from 'lucide-react';

import { useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';

import { useRoles } from '../../roles/hooks/useRoles';

import { usePermissions } from '../../permissions/hooks/usePermissions';



import AssignPermissionModal from '../components/AssignPermissionModal';

import './RolePermissionsPage.css';
import { useRolePermissions } from '../hooks/useRolePermission';
import { assignPermissionToRole, deleteAssignedPermission } from '../services/rolePermissionService';

const RolePermissionsPage = () => {
  const { token } = useAuthContext();

  const {
    items,
    loading,
    error,
    refetch,
  } = useRolePermissions();

  const { roles } = useRoles();

  const { permissions } =
    usePermissions();

  const [openModal, setOpenModal] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [roleId, setRoleId] =
    useState('');

  const [
    permissionId,
    setPermissionId,
  ] = useState('');

  const resetForm = () => {
    setRoleId('');
    setPermissionId('');
  };

  const handleAssign = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!token) return;

    try {
      setCreating(true);

      await assignPermissionToRole(
        token,
        {
          role_id: roleId,
          permission_id: permissionId,
        },
      );

      await refetch();

      resetForm();

      setOpenModal(false);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (
    role_id: string,
    permission_id: string,
  ) => {
    if (!token) return;

    await deleteAssignedPermission(
      token,
      {
        role_id,
        permission_id,
      },
    );

    await refetch();
  };

  return (
    <>
      <div className="role-permissions-page">
        <div className="role-permissions-header">
          <span>
            {items.length} asignaciones
          </span>

          <button
            className="new-assignment-btn"
            onClick={() =>
              setOpenModal(true)
            }
          >
            <Plus size={16} />
            Asignar Permiso
          </button>
        </div>

        {error && (
          <div className="role-permissions-error">
            {error}
          </div>
        )}

        <div className="role-permissions-table-wrap">
          {loading ? (
            <div className="role-permissions-loading">
              Cargando...
            </div>
          ) : (
            <table className="role-permissions-table">
              <thead>
                <tr>
                  <th>ROL</th>
                  <th>PERMISO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={`${item.role_id}-${item.permission_id}`}
                  >
                    <td>
                      <span className="role-badge">
                        {item.role}
                      </span>
                    </td>

                    <td>
                      <span className="permission-badge">
                        {item.permission}
                      </span>
                    </td>

                    <td>
                      <button
                        className="delete-assignment-btn"
                        onClick={() =>
                          handleDelete(
                            item.role_id,
                            item.permission_id,
                          )
                        }
                      >
                        <Trash2 size={14} />
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}

                {!items.length && (
                  <tr>
                    <td
                      colSpan={3}
                      className="empty-state"
                    >
                      No hay asignaciones
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AssignPermissionModal
        open={openModal}
        loading={creating}
        roles={roles}
        permissions={permissions}
        roleId={roleId}
        permissionId={permissionId}
        setRoleId={setRoleId}
        setPermissionId={
          setPermissionId
        }
        onClose={() => {
          resetForm();
          setOpenModal(false);
        }}
        onSubmit={handleAssign}
      />
    </>
  );
};

export default RolePermissionsPage;