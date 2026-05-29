import { X } from 'lucide-react';

import './PermissionModal.css';

interface Props {
  open: boolean;
  title: string;
  loading: boolean;

  type: string;
  error: string;

  onClose: () => void;

  onSubmit: (
    e: React.FormEvent,
  ) => void;

  setType: (
    value: string,
  ) => void;
}

const PermissionModal = ({
  open,
  title,
  loading,
  type,
  error,
  onClose,
  onSubmit,
  setType,
}: Props) => {
  if (!open) return null;

  return (
    <div className="permission-modal-overlay">
      <div className="permission-modal">
        <div className="permission-modal-top">
          <h2>{title}</h2>

          <button
            type="button"
            className="permission-close-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Tipo</label>

            <input
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <div className="permission-modal-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="create-permission-btn"
            disabled={loading}
          >
            {loading
              ? 'Guardando...'
              : title}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PermissionModal;