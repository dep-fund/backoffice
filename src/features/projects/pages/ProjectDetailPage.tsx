import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProjectDetail } from '../hooks/useProjectDetail';
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
  const { project, loading, error } = useProjectDetail();

  if (loading) return <div className="project-detail-loading">Cargando...</div>;

  if (error || !project) {
    return <div className="project-detail-error">No se pudo cargar el proyecto</div>;
  }

  return (
    <div>
      <Link to="/projects" className="project-back-link">
        <ArrowLeft size={16} />
        Volver a proyectos
      </Link>

      <div className="project-detail-card">
        <h1>{project.name}</h1>

        <div className={`project-detail-status status-${project.state.toLowerCase()}`}>
        {project.state}
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
      </div>
    </div>
  );
};

export default ProjectDetailPage;