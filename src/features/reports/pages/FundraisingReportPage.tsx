import {
  DollarSign,
  FolderKanban,
  Users,
  BarChart3,
  ShoppingCart,
} from 'lucide-react';
import { useFundraisingReport } from '../hooks/useFundraisingReport';
import '../../dashboard/pages/DashboardPage.css';
import './FundraisingReportPage.css';

const formatCurrency = (value: string | null | undefined) => {
  if (value === null || value === undefined) return '-';
  const num = parseFloat(value);
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num) + ' USDC';
};

const formatNumber = (value: string | null | undefined) => {
  if (value === null || value === undefined) return '-';
  if (parseFloat(value) >= 1_000_000) {
    return (parseFloat(value) / 1_000_000).toFixed(1) + 'M';
  }
  if (parseFloat(value) >= 1_000) {
    return (parseFloat(value) / 1_000).toFixed(1) + 'K';
  }
  return new Intl.NumberFormat('es-ES').format(parseFloat(value));
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
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

const stateLabel: Record<string, { label: string; className: string }> = {
  APPROVED: { label: 'Aprobado', className: 'state-approved' },
  PENDING: { label: 'Pendiente', className: 'state-pending' },
  REJECTED: { label: 'Rechazado', className: 'state-rejected' },
  CANCELED: { label: 'Cancelado', className: 'state-canceled' },
};

const FundraisingReportPage = () => {
  const { data, loading, error } = useFundraisingReport();

  if (loading) return <div className="dash-loading">Cargando reporte...</div>;

  if (error) return <div className="dash-error">{error}</div>;

  if (!data) return null;

  const { summary, projects } = data;

  return (
    <div className="report-page">
      <div className="dashboard-stats">
        <StatCard
          icon={<DollarSign size={22} color="#10B981" />}
          value={formatCurrency(summary.total_revenue)}
          label="Total Recaudación"
          iconBg="#ECFDF5"
        />
        <StatCard
          icon={<BarChart3 size={22} color="#6366F1" />}
          value={formatCurrency(summary.total_offering_fees)}
          label="Comisión Offering (3%)"
          iconBg="#EEF2FF"
        />
        <StatCard
          icon={<ShoppingCart size={22} color="#F97316" />}
          value={formatCurrency(summary.total_marketplace_fees)}
          label="Comisión Marketplace (2%)"
          iconBg="#FFF7ED"
        />
        <StatCard
          icon={<FolderKanban size={22} color="#6366F1" />}
          value={summary.total_projects}
          label="Proyectos"
          iconBg="#EEF2FF"
        />
        <StatCard
          icon={<Users size={22} color="#EF4444" />}
          value={summary.total_investors}
          label="Inversores"
          iconBg="#FEF2F2"
        />
      </div>

      <div className="report-table-wrap">
        <h2 className="dash-section-title">
          <BarChart3 size={16} />
          Detalle por Proyecto
        </h2>
        <div className="report-table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th>Proyecto</th>
                <th>Estado</th>
                <th>Meta</th>
                <th>Recaudado</th>
                <th>% Fin.</th>
                <th>Caps</th>
                <th>Fee Offering</th>
                <th>Fee Marketplace</th>
                <th>Inversores</th>
                <th>Tokens</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const st = stateLabel[p.state] || { label: p.state, className: '' };
                const pct = p.funding_percentage !== null && p.funding_percentage !== undefined
                  ? p.funding_percentage.toFixed(1)
                  : '-';
                return (
                  <tr key={p.project_id}>
                    <td className="report-project-name">{p.name}</td>
                    <td><span className={`report-state ${st.className}`}>{st.label}</span></td>
                    <td className="report-number">{formatCurrency(p.goal_amount)}</td>
                    <td className="report-number">{formatCurrency(p.raised_amount)}</td>
                    <td className="report-number">{pct !== '-' ? `${pct}%` : '-'}</td>
                    <td className="report-number caps">
                      {p.soft_cap || p.hard_cap
                        ? `${formatCurrency(p.soft_cap)} / ${formatCurrency(p.hard_cap)}`
                        : '-'}
                    </td>
                    <td className="report-number">{formatCurrency(p.offering_fees)}</td>
                    <td className="report-number">{formatCurrency(p.marketplace_fees)}</td>
                    <td className="report-number">{p.investor_count}</td>
                    <td className="report-number">{formatNumber(p.tokens_sold)}</td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={10} className="report-empty">No hay proyectos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FundraisingReportPage;
