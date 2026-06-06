import { useNavigate } from 'react-router-dom';
import {
  Users,
  FolderKanban,
  Clock,
  CheckCircle,
  XCircle,
  Tag,
  Shield,
  Lock,
} from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import './DashboardPage.css';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  iconBg: string;
}

const StatCard = ({ icon, value, label, iconBg }: StatCardProps) => (
  <div className="stat-card">
    <div className="stat-icon-wrap" style={{ background: iconBg }}>
      {icon}
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const DashboardPage = () => {
  const { stats, pendingProjects, loading, error } = useDashboard();
  const navigate = useNavigate();

  if (loading) return <div className="dash-loading">Cargando dashboard...</div>;

  return (
    <div>
      {error && <div className="dash-error">{error}</div>}

      {stats && (
        <div className="dashboard-stats">
          <StatCard
            icon={<Users size={22} color="#6366F1" />}
            value={stats.totalUsers}
            label="Total Usuarios"
            iconBg="#EEF2FF"
          />
          <StatCard
            icon={<FolderKanban size={22} color="#8B5CF6" />}
            value={stats.totalProjects}
            label="Total Proyectos"
            iconBg="#F5F3FF"
          />
          <StatCard
            icon={<Clock size={22} color="#F59E0B" />}
            value={stats.pendingProjects}
            label="Proyectos Pendientes"
            iconBg="#FFFBEB"
          />
          <StatCard
            icon={<CheckCircle size={22} color="#10B981" />}
            value={stats.approvedProjects}
            label="Proyectos Aprobados"
            iconBg="#ECFDF5"
          />
          <StatCard
            icon={<XCircle size={22} color="#EF4444" />}
            value={stats.rejectedProjects}
            label="Proyectos Rechazados"
            iconBg="#FEF2F2"
          />
          <StatCard
            icon={<Tag size={22} color="#14B8A6" />}
            value={stats.totalCategories}
            label="Categorías"
            iconBg="#F0FDFA"
          />
          <StatCard
            icon={<Shield size={22} color="#F97316" />}
            value={stats.totalRoles}
            label="Roles"
            iconBg="#FFF7ED"
          />
          <StatCard
            icon={<Lock size={22} color="#818CF8" />}
            value={stats.totalPermissions}
            label="Permisos"
            iconBg="#EEF2FF"
          />
        </div>
      )}

      <div className="dashboard-bottom">
        <div className="dash-section">
          <div className="dash-section-title">
            <Clock size={16} />
            Proyectos Pendientes de Aprobación
          </div>
          {pendingProjects.length === 0 ? (
            <div className="pending-empty">No hay proyectos pendientes.</div>
          ) : (
            pendingProjects.slice(0, 6).map((p) => (
              <div className="pending-item" key={p.id}>
                <div>
                  <div className="pending-name">{p.name}</div>
                  <div className="pending-location">{p.ubication}</div>
                </div>
                <button
                  className="pending-link"
                  onClick={() =>
                    navigate(`/projects/${p.id}`)
                  }
                >
                  Ver
                </button>
              </div>
            ))
          )}
        </div>

        <div className="dash-section">
          <div className="dash-section-title">Accesos Rápidos</div>
          <div className="quick-grid">
            <button className="quick-item" onClick={() => navigate('/users')}>
              <Users size={24} />
              <span>Gestionar Usuarios</span>
            </button>
            <button className="quick-item" onClick={() => navigate('/projects')}>
              <FolderKanban size={24} />
              <span>Ver Proyectos</span>
            </button>
            <button className="quick-item" onClick={() => navigate('/categories')}>
              <Tag size={24} />
              <span>Categorías</span>
            </button>
            <button className="quick-item" onClick={() => navigate('/role-permissions')}>
              <Shield size={24} />
              <span>Roles y permisos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
