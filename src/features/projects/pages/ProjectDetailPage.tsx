import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectDetail } from '../hooks/useProjectDetail';
import { approveProject, rejectProject } from '../services/projectsService';
import { useAuthContext } from '../../../shared/context/AuthContext';
import VerdictModal from '../components/VerdictModal';
import './ProjectDetailPage.css';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('es-AR');

const ProjectDetailPage = () => {
  const { project, loading, error, setProject } = useProjectDetail();
  const { token } = useAuthContext();

  const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  if (loading) return <div className="project-detail-loading">Cargando...</div>;

  if (error || !project) {
    return <div className="project-detail-error">No se pudo cargar el proyecto</div>;
  }

  const isPending = project.state === 'PENDING';

  const handleConfirm = async (reason?: string) => {
    if (!token || !project) return;

    try {
      setActionLoading(true);
      setActionError('');

      let updated;
      if (modalMode === 'approve') {
        updated = await approveProject(token, project.id);
        setActionSuccess('Proyecto aprobado correctamente.');
      } else {
        updated = await rejectProject(token, project.id, reason!);
        setActionSuccess('Proyecto rechazado. El creador fue notificado del motivo.');
      }

      setProject(updated);
      setModalMode(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ocurrió un error. Intentá de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <Link to="/projects" className="project-back-link">
        <ArrowLeft size={16} />
        Volver a proyectos
      </Link>

      <div className="project-detail-card">
        <div className="project-detail-top-bar">
          <h1>{project.name}</h1>
          <div className={`project-detail-status status-${project.state.toLowerCase()}`}>
            {project.state}
          </div>
        </div>

        {/* Feedback messages */}
        {actionSuccess && (
          <div className="project-action-success">
            ✓ {actionSuccess}
          </div>
        )}
        {actionError && (
          <div className="project-action-error">
            {actionError}
          </div>
        )}

        {/* Verdict buttons — only when PENDING */}
        {isPending && (
          <div className="project-verdict-bar">
            <button
              className="verdict-btn-approve"
              onClick={() => { setActionSuccess(''); setActionError(''); setModalMode('approve'); }}
            >
              <CheckCircle size={16} />
              Aprobar proyecto
            </button>
            <button
              className="verdict-btn-reject"
              onClick={() => { setActionSuccess(''); setActionError(''); setModalMode('reject'); }}
            >
              <XCircle size={16} />
              Rechazar proyecto
            </button>
          </div>
        )}

        <div className="project-detail-grid">
          <div>
            <h3>Información del Proyecto</h3>
            <div className="project-info-list">
              <div className="project-info-row">
                <span>Monto Objetivo:</span>
                <strong>{formatCurrency(Number(project.total_amount))}</strong>
              </div>
              <div className="project-info-row">
                <span>Ubicación:</span>
                <strong>{project.ubication}</strong>
              </div>
              <div className="project-info-row">
                <span>Fecha de Creación:</span>
                <strong>{formatDate(project.created_at)}</strong>
              </div>
              <div className="project-info-row">
                <span>ID de Usuario:</span>
                <strong>{project.user_id}</strong>
              </div>
            </div>
          </div>

          <div>
            <h3>Categorías</h3>
            <div className="project-categories">
              {project.categories.map((category) => (
                <span key={category.id} className="project-category-item">
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="project-description-block">
          <h3>Descripción</h3>
          <p>{project.description}</p>
        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <VerdictModal
          open={true}
          mode={modalMode}
          projectName={project.name}
          loading={actionLoading}
          onClose={() => setModalMode(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;