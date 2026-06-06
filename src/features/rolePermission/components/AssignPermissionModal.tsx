import { X } from 'lucide-react';

import type { Role } from '../../roles/types/role';

import type { Permission } from '../../permissions/types/permission';

import './AssignPermissionModal.css';

interface Props {
  open: boolean;

  loading: boolean;

  roles: Role[];

  permissions: Permission[];

  roleId: string;

  permissionId: string;

  setRoleId: (
    value: string,
  ) => void;

  setPermissionId: (
    value: string,
  ) => void;

  onClose: () => void;

  onSubmit: (
    e: React.FormEvent,
  ) => void;
}

const AssignPermissionModal = ({
  open,
  loading,
  roles,
  permissions,
  roleId,
  permissionId,
  setRoleId,
  setPermissionId,
  onClose,
  onSubmit,
}: Props) => {
  if (!open) return null;

  return (
    <div className="assign-modal-overlay">
      <div className="assign-modal">
        <div className="assign-modal-top">
          <h2>Asignar Permiso</h2>

          <button
            className="assign-close-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Rol</label>

            <select
              value={roleId}
              onChange={(e) =>
                setRoleId(e.target.value)
              }
              required
            >
              <option value="">
                Seleccionar rol
              </option>

              {roles.map((role) => (
                <option
                  key={role.id}
                  value={role.id}
                >
                  {role.type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Permiso</label>

            <select
              value={permissionId}
              onChange={(e) =>
                setPermissionId(
                  e.target.value,
                )
              }
              required
            >
              <option value="">
                Seleccionar permiso
              </option>

              {permissions.map(
                (permission) => (
                  <option
                    key={permission.id}
                    value={permission.id}
                  >
                    {permission.type}
                  </option>
                ),
              )}
            </select>
          </div>

          <button
            type="submit"
            className="assign-submit-btn"
            disabled={loading}
          >
            {loading
              ? 'Guardando...'
              : 'Asignar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignPermissionModal;