import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ChevronLeft, ChevronRight, FileText, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectDetail } from '../hooks/useProjectDetail';
import {
  approveProject,
  rejectProject,
  getProjectImages,
  getProjectDocuments,
  getProjectAdvances,
  updateProject,
} from '../services/projectsService';
import { useCategories } from '../../categories/hooks/useCategories'; 
import type { ProjectImage, ProjectDocument, ProjectAdvance } from '../services/projectsService';
import { useAuthContext } from '../../../shared/context/AuthContext';
import VerdictModal from '../components/VerdictModal';
import './ProjectDetailPage.css';
import { distributeDividends } from '../services/projectsService';

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
  const { categories } = useCategories(); 

  const [modalMode, setModalMode] = useState<'approve' | 'reject' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ubication: '',
    risk: '', // Nuevo campo para el formulario
  });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [images, setImages] = useState<ProjectImage[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [advances, setAdvances] = useState<ProjectAdvance[]>([]);
  const [currentDoc, setCurrentDoc] = useState(0);
  const [currentAdv, setCurrentAdv] = useState(0);

  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [distributeAmount, setDistributeAmount] = useState('');
  const [distributeConfirmText, setDistributeConfirmText] = useState('');
  const [distributeLoading, setDistributeLoading] = useState(false);
  const [distributeError, setDistributeError] = useState('');
  const [distributeSuccess, setDistributeSuccess] = useState('');

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        ubication: project.ubication,
        risk: project.risk ?? '',
      });
      setSelectedCategoryIds(project.categories.map((c) => c.id));
    }
  }, [project]);

  useEffect(() => {
    if (!project || !token) return;
    getProjectImages(token, project.id).then(setImages).catch(() => []);
    getProjectDocuments(token, project.id).then(setDocuments).catch(() => []);
    getProjectAdvances(token, project.id).then(setAdvances).catch(() => []);
  }, [project?.id, token]);

  if (loading) return <div className="project-detail-loading">Cargando...</div>;
  if (error || !project) return <div className="project-detail-error">No se pudo cargar el proyecto</div>;

  const isPending = project.state === 'PENDING';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.some((id) => String(id) === String(categoryId))
        ? prev.filter((id) => String(id) !== String(categoryId))
        : [...prev, categoryId]
    );
  };

  const handleSaveChanges = async () => {
    if (!token || !project) return;
    try {
      setActionLoading(true);
      setActionError('');
      setActionSuccess('');

      const payload = {
        name: formData.name,
        description: formData.description,
        ubication: formData.ubication,
        risk: formData.risk !== '' ? formData.risk : null, // Mandamos el nuevo nivel de riesgo
        category_ids: selectedCategoryIds,
      };

      const updated = await updateProject(token, project.id, payload);
      
      setProject(updated);
      setIsEditing(false);
      setActionSuccess('Proyecto actualizado correctamente.');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ocurrió un error al actualizar el proyecto.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: project.name,
      description: project.description,
      ubication: project.ubication,
      risk: project.risk ?? '',
    });
    setSelectedCategoryIds(project.categories.map((c) => c.id));
    setIsEditing(false);
    setActionError('');
  };

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

  const handleDistribute = async () => {
    if (!token || !project) return;
    try {
      setDistributeLoading(true);
      setDistributeError('');
      await distributeDividends(token, project.id, parseFloat(distributeAmount));
      setDistributeSuccess(`Se distribuyeron ${distributeAmount} USDC correctamente.`);
      setShowDistributeModal(false);
      setDistributeAmount('');
      setDistributeConfirmText('');
    } catch (err) {
      setDistributeError(err instanceof Error ? err.message : 'Error al distribuir.');
    } finally {
      setDistributeLoading(false);
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
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="edit-input-title"
            />
          ) : (
            <h1>{project.name}</h1>
          )}
          
          <div className="project-detail-actions-zone">
            {isEditing ? (
              <div className="edit-actions-buttons">
                <button className="btn-save" onClick={handleSaveChanges} disabled={actionLoading}>
                  <Save size={16} /> {actionLoading ? 'Guardando...' : 'Guardar'}
                </button>
                <button className="btn-cancel" onClick={handleCancelEdit} disabled={actionLoading}>
                  <X size={16} /> Cancelar
                </button>
              </div>
            ) : (
              <button className="btn-edit-mode" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} /> Editar Proyecto
              </button>
            )}

            <div className={`project-detail-status status-${project.state.toLowerCase()}`}>
              {project.state}
            </div>
          </div>
        </div>

        {actionSuccess && <div className="project-action-success">✓ {actionSuccess}</div>}
        {actionError && <div className="project-action-error">{actionError}</div>}
        {distributeSuccess && <div className="project-action-success">✓ {distributeSuccess}</div>}

        {isPending && !isEditing && (
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

        {project.state === 'APPROVED' && project.dividend_address && (
          <div style={{ marginBottom: '24px' }}>
            <button
              className="verdict-btn-approve"
              style={{ background: '#2C7176' }}
              onClick={() => {
                setDistributeError('');
                setDistributeSuccess('');
                setShowDistributeModal(true);
              }}
            >
              <CheckCircle size={16} /> Distribuir Dividendos
            </button>
          </div>
        )}

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
                <span>Monto Mínimo de Inversión:</span>
                <strong>{project.min_amount !== null && project.min_amount !== undefined ? formatCurrency(Number(project.min_amount)) : 'No especificado'}</strong>
              </div>

              <div className="project-info-row">
                <span>Ubicación:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="ubication"
                    value={formData.ubication}
                    onChange={handleInputChange}
                    className="edit-input-field"
                  />
                ) : (
                  <strong>{project.ubication}</strong>
                )}
              </div>

              <div className="project-info-row">
                <span>Nivel de Riesgo:</span>
                {isEditing ? (
                  <select
                    name="risk"
                    value={formData.risk}
                    onChange={handleInputChange}
                    className="edit-select-field"
                  >
                    <option value="">Seleccionar riesgo</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                ) : (
                  <strong className={`project-risk-badge risk-${project.risk?.toLowerCase() || 'none'}`}>
                    {project.risk ?? 'No especificado'}
                  </strong>
                )}
              </div>

              <div className="project-info-row">
                <span>Gastos Anuales:</span>
                <strong>{project.annual_expenses !== null && project.annual_expenses !== undefined ? formatCurrency(Number(project.annual_expenses)) : 'No especificado'}</strong>
              </div>
              <div className="project-info-row">
                <span>Ganancia Bruta Anual:</span>
                <strong>{project.annual_gross_profit !== null && project.annual_gross_profit !== undefined ? formatCurrency(Number(project.annual_gross_profit)) : 'No especificado'}</strong>
              </div>
              <div className="project-info-row">
                <span>Beneficio Anual Estimado:</span>
                <strong>{project.annual_benefits !== null && project.annual_benefits !== undefined ? formatCurrency(Number(project.annual_benefits)) : 'No calculado'}</strong>
              </div>
              <div className="project-info-row">
                <span>ROI:</span>
                <strong>{project.roi !== null && project.roi !== undefined ? `${project.roi}%` : 'No calculado'}</strong>
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
            {isEditing ? (
              <div className="edit-categories-checklist">
                {!categories || categories.length === 0 ? (
                  <span className="pd-admin-empty" style={{ fontSize: '14px' }}>
                    Cargando catálogo...
                  </span>
                ) : (
                  categories.map((category) => (
                    <label key={category.id} className="category-checkpoint-label">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.some((id) => String(id) === String(category.id))}
                        onChange={() => handleCategoryChange(category.id)}
                      />
                      {category.name}
                    </label>
                  ))
                )}
              </div>
            ) : (
              <div className="project-categories">
                {project.categories.map((category) => (
                  <span key={category.id} className="project-category-item">
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="project-description-block">
          <h3>Descripción</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="edit-textarea-field"
              rows={5}
            />
          ) : (
            <p>{project.description}</p>
          )}
        </div>

        <div className="pd-admin-section">
          <h3>Documentos</h3>
          {documents.length === 0 ? (
            <p className="pd-admin-empty">Sin documentos cargados.</p>
          ) : (
            <div className="pd-admin-carousel-row">
              <button className="pd-admin-arrow" onClick={() => setCurrentDoc((i) => Math.max(0, i - 1))} disabled={currentDoc === 0}>
                <ChevronLeft size={18} />
              </button>
              <a href={documents[currentDoc].url} target="_blank" rel="noopener noreferrer" className="pd-admin-doc-card">
                <FileText size={28} color="#EC8F41" />
                <span>{getFileName(documents[currentDoc].url)}</span>
                <small>Documento #{documents[currentDoc].number}</small>
              </a>
              <button className="pd-admin-arrow" onClick={() => setCurrentDoc((i) => Math.min(documents.length - 1, i + 1))} disabled={currentDoc === documents.length - 1}>
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

         <div className="pd-admin-section">
          <h3>Avances</h3>
          {advances.length === 0 ? (
            <p className="pd-admin-empty">Sin avances publicados.</p>
          ) : (
            <div className="pd-admin-carousel-row">
              <button className="pd-admin-arrow" onClick={() => setCurrentAdv((i) => Math.max(0, i - 1))} disabled={currentAdv === 0}>
                <ChevronLeft size={18} />
              </button>
              <div className="pd-admin-adv-card">
                {advances[currentAdv].url && <img src={advances[currentAdv].url!} alt={`avance-${currentAdv + 1}`} />}
                <div className="pd-admin-adv-body">
                  <small>Avance #{advances[currentAdv].number}</small>
                  <p>{advances[currentAdv].description}</p>
                </div>
              </div>
              <button className="pd-admin-arrow" onClick={() => setCurrentAdv((i) => Math.min(advances.length - 1, i + 1))} disabled={currentAdv === advances.length - 1}>
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

      {showDistributeModal && (
        <div className="div-overlay" onClick={() => setShowDistributeModal(false)}>
          <div className="div-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>

            <div className="div-header">
              <div className="div-header-left">
                <div className="div-icon-wrap">
                  <CheckCircle size={18} color="#2C7176" />
                </div>
                <div>
                  <p className="div-header-label" style={{ color: '#2C7176' }}>Distribución</p>
                  <h2 className="div-header-title">Distribuir Dividendos</h2>
                </div>
              </div>
              <button className="div-close" onClick={() => setShowDistributeModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="div-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px 16px', fontSize: '13px', color: '#166534', lineHeight: '1.5' }}>
                El monto ingresado será transferido desde la cuenta de tesorería de la plataforma al contrato de dividendos y distribuido proporcionalmente entre todos los holders de tokens del proyecto.
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Monto a distribuir (USDC)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={distributeAmount}
                  onChange={(e) => setDistributeAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Escribí <strong>CONFIRMAR</strong> para continuar
                </label>
                <input
                  type="text"
                  placeholder="CONFIRMAR"
                  value={distributeConfirmText}
                  onChange={(e) => setDistributeConfirmText(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
                />
              </div>

              {distributeError && (
                <div className="div-feedback div-feedback--error">
                  <AlertCircle size={15} />
                  {distributeError}
                </div>
              )}

              <button
                className="div-claim-btn"
                style={{ background: '#2C7176' }}
                disabled={
                  !distributeAmount ||
                  parseFloat(distributeAmount) <= 0 ||
                  distributeConfirmText !== 'CONFIRMAR' ||
                  distributeLoading
                }
                onClick={handleDistribute}
              >
                {distributeLoading ? (
                  <>
                    <div className="div-spinner div-spinner--sm" />
                    Distribuyendo...
                  </>
                ) : (
                  `Distribuir ${distributeAmount ? parseFloat(distributeAmount).toFixed(2) + ' USDC' : ''}`
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;