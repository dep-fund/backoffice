import {
  Plus,
  SquarePen,
  Trash2,
} from 'lucide-react';

import { useState } from 'react';

import { useAuthContext } from '../../../shared/context/AuthContext';


import { usePermissions } from '../hooks/usePermissions';

import PermissionModal from '../components/PermissionModal';
import DeletePermissionModal from '../components/DeletePermissionModal';

import './PermissionsPage.css';
import {
  createPermission,
  updatePermission,
  deletePermission,
} from '../services/permissionServices';


const PermissionsPage = () => {
  const { token } = useAuthContext();

  const {
    permissions,
    loading,
    error,
  } = usePermissions();

  const [editError, setEditError] = 
    useState('');

  const [editingPermissionId, setEditingPermissionId] =
    useState('');

  const [editing, setEditing] =
    useState(false);

  const [openDeleteModal, setOpenDeleteModal] =
    useState(false);

  const [selectedPermission, setSelectedPermission] =
    useState('');

  const [deleting, setDeleting] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState('');

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

  const handleEdit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
  
    if (!token) return;
  
    try {
      setEditing(true);
      setEditError('');
  
      await updatePermission(
        token,
        editingPermissionId,
        {
          type,
        },
      );
  
      setOpenModal(false);
  
      window.location.reload();
    } catch (err: any) {
      if (err.message?.includes('403')) {
        setEditError(
          'No tenés permisos para editar permisos.',
        );
      } else {
        setEditError(
          'No se pudo editar el permiso.',
        );
      }
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
  
    try {
      setDeleting(true);
      setDeleteError('');
  
      await deletePermission(
        token,
        selectedPermission,
      );
  
      setOpenDeleteModal(false);
  
      window.location.reload();
    } catch {
      setDeleteError(
        'No se pudo eliminar el permiso.',
      );
    } finally {
      setDeleting(false);
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
                      <div className="permission-actions">
                        <button
                          className="permission-edit-btn"
                          onClick={() => {
                            setEditingPermissionId(
                              permission.id,
                            );

                            setType(permission.type);

                            setOpenModal(true);
                          }}
                        >
                          <SquarePen size={14} />
                          Editar
                        </button>

                        <button
                          className="permission-delete-btn"
                          onClick={() => {
                            setSelectedPermission(
                              permission.type,
                            );

                            setOpenDeleteModal(true);
                          }}
                        >
                          <Trash2 size={14} />
                          Eliminar
                        </button>
                      </div>
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
        title={
          editingPermissionId
            ? 'Editar Permiso'
            : 'Crear Permiso'
        }
        loading={
          editing
            ? editing
            : creating
        }
        type={type}
        error={editError}
        onClose={() => {
          resetModal();

          setEditingPermissionId('');
        }}
        onSubmit={
          editingPermissionId
            ? handleEdit
            : handleCreate
        }
        setType={setType}
      />

      <DeletePermissionModal
        open={openDeleteModal}
        permissionType={selectedPermission}
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

export default PermissionsPage;