import {
  DollarSign,
  FolderKanban,
  Users,
  BarChart3,
} from 'lucide-react';
import { useFundraisingReport } from '../hooks/useFundraisingReport';
import './FundraisingReportPage.css';

const formatCurrency = (value: string | null | undefined) => {
  if (!value) return '-';
  const num = parseFloat(value);
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

const formatNumber = (value: string | null | undefined) => {
  if (!value) return '-';
  const num = parseFloat(value);
  return new Intl.NumberFormat('es-ES').format(num);
};

const stateLabel: Record<string, { label: string; className: string }> = {
  APPROVED: { label: 'Aprobado', className: 'state-approved' },
  PENDING: { label: 'Pendiente', className: 'state-pending' },
  REJECTED: { label: 'Rechazado', className: 'state-rejected' },
  CANCELED: { label: 'Cancelado', className: 'state-canceled' },
};

const FundraisingReportPage = () => {
  const { data, loading, error } = useFundraisingReport();

  if (loading) return <div className="report-loading">Cargando reporte...</div>;

  if (error) return <div className="report-error">{error}</div>;

  if (!data) return null;

  const { summary, projects } = data;

  return (
    <div className="report-page">
      {error && <div className="report-error">{error}</div>}

      <div className="report-summary">
        <div className="report-stat">
          <div className="report-stat-icon" style={{ background: '#ECFDF5' }}>
            <DollarSign size={22} color="#10B981" />
          </div>
          <div className="report-stat-value">{formatCurrency(summary.total_raised)}</div>
          <div className="report-stat-label">Total Recaudado</div>
        </div>
        <div className="report-stat">
          <div className="report-stat-icon" style={{ background: '#EEF2FF' }}>
            <FolderKanban size={22} color="#6366F1" />
          </div>
          <div className="report-stat-value">{summary.total_projects}</div>
          <div className="report-stat-label">Proyectos</div>
        </div>
        <div className="report-stat">
          <div className="report-stat-icon" style={{ background: '#FEF2F2' }}>
            <Users size={22} color="#EF4444" />
          </div>
          <div className="report-stat-value">{summary.total_investors}</div>
          <div className="report-stat-label">Inversores</div>
        </div>
        <div className="report-stat">
          <div className="report-stat-icon" style={{ background: '#FFF7ED' }}>
            <BarChart3 size={22} color="#F97316" />
          </div>
          <div className="report-stat-value">{formatNumber(summary.total_goal)}</div>
          <div className="report-stat-label">Meta Total (USDC)</div>
        </div>
      </div>

      <div className="report-table-wrap">
        <h2 className="report-table-title">Detalle por Proyecto</h2>
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
                <th>Tokens Vendidos</th>
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
