export interface ProjectFundraisingDetail {
  project_id: string;
  name: string;
  state: string;
  goal_amount: string | null;
  raised_amount: string | null;
  funding_percentage: number | null;
  soft_cap: string | null;
  hard_cap: string | null;
  investor_count: number;
  investment_tx_count: number;
  tokens_sold: string | null;
  total_supply: string | null;
  offering_address: string | null;
}

export interface FundraisingSummary {
  total_projects: number;
  total_goal: string | null;
  total_raised: string | null;
  total_investors: number;
  total_tokens_sold: string | null;
  total_investment_tx: number;
}

export interface FundraisingReport {
  summary: FundraisingSummary;
  projects: ProjectFundraisingDetail[];
}
