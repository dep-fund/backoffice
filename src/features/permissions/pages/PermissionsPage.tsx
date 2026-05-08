import {
  Plus,
  SquarePen,
} from 'lucide-react';

import { useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';


import { usePermissions } from '../hooks/usePermissions';

import PermissionModal from '../components/PermissionModal';

import './PermissionsPage.css';
import { createPermission } from '../services/permissionServices';

const PermissionsPage = () => {
  const { token } = useAuthContext();

  const {
    permissions,
    loading,
    error,
  } = usePermissions();

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

      await createPermission(token, {
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
        <div className="permissions-header">
          <span>
            {permissions.length} permisos registrados
          </span>

          <button
            className="new-permission-btn"
            onClick={() => {
              setType('');

              setOpenModal(true);
            }}
          >
            <Plus size={16} />
            Nuevo Permiso
          </button>
        </div>

        {error && (
          <div className="permissions-error">
            {error}
          </div>
        )}

        <div className="permissions-table-wrap">
          {loading ? (
            <div className="permissions-loading">
              Cargando permisos...
            </div>
          ) : (
            <table className="permissions-table">
              <thead>
                <tr>
                  <th>TIPO</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.id}>
                    <td className="permission-name">
                      {permission.type}
                    </td>

                    <td>
                      <button
                        className="permission-edit-btn"
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

      <PermissionModal
        open={openModal}
        title="Crear Permiso"
        loading={creating}
        type={type}
        onClose={resetModal}
        onSubmit={handleCreate}
        setType={setType}
      />
    </>
  );
};

export default PermissionsPage;