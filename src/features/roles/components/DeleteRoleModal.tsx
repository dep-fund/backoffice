import './DeleteRoleModal.css';
interface Props {
    open: boolean;
    roleType: string;
    loading: boolean;
    error: string;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  const DeleteRoleModal = ({
    open,
    roleType,
    loading,
    error,
    onClose,
    onConfirm,
  }: Props) => {
    if (!open) return null;
  
    return (
        <div className="role-modal-overlay">
          <div className="role-modal">
            <h2>Eliminar Rol</h2>
      
            <p className="delete-role-text">
              ¿Estás seguro que querés eliminar el rol{' '}
              <strong>{roleType}</strong>?
            </p>
      
            {error && (
              <div className="delete-role-error">
                {error}
              </div>
            )}
      
            <div className="delete-role-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={onClose}
              >
                Cancelar
              </button>
      
              <button
                type="button"
                className="delete-confirm-btn"
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
  
  export default DeleteRoleModal;