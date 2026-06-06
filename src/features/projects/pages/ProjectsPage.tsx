import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './ProjectsPage.css';
import { useProjects } from '../hooks/useProject';

const statusMap: Record<string, string> = {
  approved: 'Aprobado',
  pending: 'Pendiente',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);

const ProjectsPage = () => {
  const {
    projects,
    loading,
    error,
    page,
    setPage,
    totalPages,
    total,
    search,
    setSearch,
  } = useProjects();

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <div>
      <div className="projects-topbar">
        <span className="projects-count">
          {total} proyectos encontrados
        </span>

        <div className="projects-search-wrap">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="projects-search-input"
            placeholder="Buscar..."
          />
        </div>
      </div>

      {error && <div className="projects-error">{error}</div>}

      {loading ? (
        <div className="projects-loading">
          Cargando proyectos...
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div
                className={`project-status project-status-${project.state.toLowerCase()}`}
              >
                {statusMap[project.state.toLowerCase()] ?? project.state}
              </div>

              <h3>{project.name}</h3>

              <p>{project.description}</p>

              <div className="project-meta">
                <div className="project-row">
                  <span>Monto:</span>
                  <strong>{formatCurrency(Number(project.total_amount))}</strong>
                </div>

                <div className="project-row">
                  <span>Ubicación:</span>

                  <strong>{project.ubication}</strong>
                </div>
              </div>

              <Link
                to={`/projects/${project.id}`}
                className="project-detail-btn"
              >
                <Eye size={16} />
                Ver Detalle
              </Link>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="projects-pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() =>
              setPage((prev) => Math.max(prev - 1, 1))
            }
          >
            <ChevronLeft size={16} />
          </button>

          {pages.map((item) => (
            <button
              key={item}
              className={`page-btn ${
                item === page ? 'active' : ''
              }`}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          ))}

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;