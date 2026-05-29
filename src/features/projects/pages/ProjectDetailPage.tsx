import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectDetail } from '../hooks/useProjectDetail';
import {
  approveProject,
  rejectProject,
  getProjectImages,
  getProjectDocuments,
  getProjectAdvances,
} from '../services/projectsService';
import type { ProjectImage, ProjectDocument, ProjectAdvance } from '../services/projectsService';
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

const getFileName = (url: string) =>
  url.split('/').pop()?.split('?')[0] ?? 'Documento';

const ProjectDetailPage = () => {
  const { project, loading, error, setProject } = useProjectDetail();
  const { token } = useAuthContext();

  const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const [images, setImages] = useState<ProjectImage[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [advances, setAdvances] = useState<ProjectAdvance[]>([]);
  const [currentDoc, setCurrentDoc] = useState(0);
  const [currentAdv, setCurrentAdv] = useState(0);

  useEffect(() => {
    if (!project || !token) return;
    getProjectImages(token, project.id).then(setImages).catch(() => []);
    getProjectDocuments(token, project.id).then(setDocuments).catch(() => []);
    getProjectAdvances(token, project.id).then(setAdvances).catch(() => []);
  }, [project?.id, token]);

  if (loading) return <div className="project-detail-loading">Cargando...</div>;
  if (error || !project) return <div className="project-detail-error">No se pudo cargar el proyecto</div>;

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

        {actionSuccess && <div className="project-action-success">✓ {actionSuccess}</div>}
        {actionError && <div className="project-action-error">{actionError}</div>}

        {isPending && (
          <div className="project-verdict-bar">
            <button
              className="verdict-btn-approve"
              onClick={() => { setActionSuccess(''); setActionError(''); setModalMode('approve'); }}
            >
              <CheckCircle size={16} /> Aprobar proyecto
            </button>
            <button
              className="verdict-btn-reject"
              onClick={() => { setActionSuccess(''); setActionError(''); setModalMode('reject'); }}
            >
              <XCircle size={16} /> Rechazar proyecto
            </button>
          </div>
        )}

        {/* ── Imágenes ── */}
        <div className="pd-hero">
          {images.length > 0 ? (
            <>
              <div
                className="pd-carousel-bg-blur"
                style={{ backgroundImage: `url(${images[currentImage].url})` }}
              />
              <img
                src={images[currentImage].url}
                alt={`Imagen del proyecto ${currentImage + 1}`}
                className="pd-carousel-img"
              />
              <div className="pd-carousel-gradient" />
              {images.length > 1 && (
                <>
                  <button
                    className="pd-carousel-btn pd-carousel-btn--prev"
                    onClick={() => setCurrentImage((i) => i === 0 ? images.length - 1 : i - 1)}
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    className="pd-carousel-btn pd-carousel-btn--next"
                    onClick={() => setCurrentImage((i) => i === images.length - 1 ? 0 : i + 1)}
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="pd-carousel-dots">
                    {images.map((_: any, idx: number) => (
                      <button
                        key={idx}
                        className={`pd-carousel-dot ${idx === currentImage ? 'active' : ''}`}
                        onClick={() => setCurrentImage(idx)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="pd-carousel-empty">Sin imágenes disponibles</span>
          )}
        </div>

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

        {/* ── Documentos ── */}
        <div className="pd-admin-section">
          <h3>Documentos</h3>
          {documents.length === 0 ? (
            <p className="pd-admin-empty">Sin documentos cargados.</p>
          ) : (
            <div className="pd-admin-carousel-row">
              <button
                className="pd-admin-arrow"
                onClick={() => setCurrentDoc((i) => Math.max(0, i - 1))}
                disabled={currentDoc === 0}
              >
                <ChevronLeft size={18} />
              </button>
              <a
                href={documents[currentDoc].url}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-admin-doc-card"
              >
                <FileText size={28} color="#EC8F41" />
                <span>{getFileName(documents[currentDoc].url)}</span>
                <small>Documento #{documents[currentDoc].number}</small>
              </a>
              <button
                className="pd-admin-arrow"
                onClick={() => setCurrentDoc((i) => Math.min(documents.length - 1, i + 1))}
                disabled={currentDoc === documents.length - 1}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

         {/* ── Avances ── */}
         <div className="pd-admin-section">
          <h3>Avances</h3>
          {advances.length === 0 ? (
            <p className="pd-admin-empty">Sin avances publicados.</p>
          ) : (
            <div className="pd-admin-carousel-row">
              <button
                className="pd-admin-arrow"
                onClick={() => setCurrentAdv((i) => Math.max(0, i - 1))}
                disabled={currentAdv === 0}
              >
                <ChevronLeft size={18} />
              </button>
              <div className="pd-admin-adv-card">
                {advances[currentAdv].url && (
                  <img src={advances[currentAdv].url!} alt={`avance-${currentAdv + 1}`} />
                )}
                <div className="pd-admin-adv-body">
                  <small>Avance #{advances[currentAdv].number}</small>
                  <p>{advances[currentAdv].description}</p>
                </div>
              </div>
              <button
                className="pd-admin-arrow"
                onClick={() => setCurrentAdv((i) => Math.min(advances.length - 1, i + 1))}
                disabled={currentAdv === advances.length - 1}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

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