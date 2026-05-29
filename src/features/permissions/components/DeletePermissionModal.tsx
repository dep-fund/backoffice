import './DeletePermissionModal.css';

interface Props {
  open: boolean;
  permissionType: string;
  loading: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeletePermissionModal = ({
  open,
  permissionType,
  loading,
  error,
  onClose,
  onConfirm,
}: Props) => {
  if (!open) return null;

  return (
    <div className="permission-modal-overlay">
      <div className="permission-modal">
        <h2>Eliminar Permiso</h2>

        <p className="delete-permission-text">
          ¿Estás seguro que querés eliminar el permiso{' '}
          <strong>{permissionType}</strong>?
        </p>

        {error && (
          <div className="delete-permission-error">
            {error}
          </div>
        )}

        <div className="delete-permission-actions">
          <button
            type="button"
            className="delete-permission-cancel-btn"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="delete-permission-confirm-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? 'Eliminando...'
              : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePermissionModal;