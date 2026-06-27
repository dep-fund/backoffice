import {
  DollarSign,
  FolderKanban,
  Users,
  BarChart3,
} from 'lucide-react';
import { useFundraisingReport } from '../hooks/useFundraisingReport';
import '../../dashboard/pages/DashboardPage.css';
import './FundraisingReportPage.css';

const formatCurrency = (value: string | null | undefined) => {
  if (!value) return '-';
  const num = parseFloat(value);
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatNumber = (value: string | null | undefined) => {
  if (!value) return '-';
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
          value={formatCurrency(summary.total_raised)}
          label="Total Recaudado"
          iconBg="#ECFDF5"
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
        <StatCard
          icon={<BarChart3 size={22} color="#F97316" />}
          value={formatCurrency(summary.total_goal)}
          label="Meta Total"
          iconBg="#FFF7ED"
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
                <th>Meta (USDC)</th>
                <th>Recaudado (USDC)</th>
                <th>% Financiado</th>
                <th>Soft Cap</th>
                <th>Hard Cap</th>
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
                    <td>
                      {pct !== '-' ? (
                        <div className="report-pct-bar">
                          <div
                            className="report-pct-fill"
                            style={{ width: `${Math.min(parseFloat(pct as string), 100)}%` }}
                          />
                          <span className="report-pct-text">{pct}%</span>
                        </div>
                      ) : (
                        <span className="report-pct-text">-</span>
                      )}
                    </td>
                    <td className="report-number">{formatCurrency(p.soft_cap)}</td>
                    <td className="report-number">{formatCurrency(p.hard_cap)}</td>
                    <td className="report-number">{p.investor_count}</td>
                    <td className="report-number">{formatNumber(p.tokens_sold)}</td>
                  </tr>
                );
              })}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={9} className="report-empty">No hay proyectos</td>
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
