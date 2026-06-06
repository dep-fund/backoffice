import { X } from 'lucide-react';

import './RoleModal.css';

interface Props {
  open: boolean;
  title: string;
  loading: boolean;

  type: string;

  onClose: () => void;

  onSubmit: (
    e: React.FormEvent,
  ) => void;

  setType: (
    value: string,
  ) => void;
}

const RoleModal = ({
  open,
  title,
  loading,
  type,
  onClose,
  onSubmit,
  setType,
}: Props) => {
  if (!open) return null;

  return (
    <div className="role-modal-overlay">
      <div className="role-modal">
        <div className="role-modal-top">
          <h2>{title}</h2>

          <button
            className="role-close-btn"
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

          <button
            type="submit"
            className="create-role-btn"
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

export default RoleModal;