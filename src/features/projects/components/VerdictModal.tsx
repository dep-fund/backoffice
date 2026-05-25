import { useState } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import './VerdictModal.css';

interface Props {
  open: boolean;
  mode: 'approve' | 'reject';
  projectName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

const VerdictModal = ({
  open,
  mode,
  projectName,
  loading,
  onClose,
  onConfirm,
}: Props) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const isReject = mode === 'reject';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isReject && reason.trim().length < 10) {
      setError('El motivo debe tener al menos 10 caracteres.');
      return;
    }

    onConfirm(isReject ? reason.trim() : undefined);
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className="verdict-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="verdict-modal">

        {/* Header */}
        <div className="verdict-header">
          <div className="verdict-title-group">
            <div className={`verdict-icon ${mode}`}>
              {isReject
                ? <XCircle size={22} />
                : <CheckCircle size={22} />}
            </div>
            <div>
              <h2 className="verdict-title">
                {isReject ? 'Rechazar proyecto' : 'Aprobar proyecto'}
              </h2>
              <p className="verdict-subtitle">
                {isReject
                  ? 'El creador recibirá el motivo del rechazo'
                  : 'El proyecto quedará activo y visible'}
              </p>
            </div>
          </div>
          <button className="verdict-close" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>

        {/* Project name */}
        <div className="verdict-project-name">
          📁 {projectName}
        </div>

        <form onSubmit={handleSubmit}>

          {/* Approve: confirmation message */}
          {!isReject && (
            <div className="verdict-approve-confirm">
              Al aprobar este proyecto confirmás que cumple con todos los requisitos de la plataforma y quedará disponible para que los inversores lo vean.
            </div>
          )}

          {/* Reject: reason textarea */}
          {isReject && (
            <div className="verdict-textarea-group">
              <label htmlFor="verdict-reason">
                Motivo del rechazo *
              </label>
              <textarea
                id="verdict-reason"
                placeholder="Describí las correcciones o fallas que impiden la aprobación del proyecto..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          )}

          {error && <div className="verdict-error">{error}</div>}

          <div className="verdict-actions">
            <button
              type="button"
              className="verdict-btn-cancel"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`verdict-btn-submit ${mode}`}
              disabled={loading}
            >
              {loading
                ? 'Procesando...'
                : isReject
                  ? '✗ Rechazar'
                  : '✓ Aprobar proyecto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default VerdictModal;