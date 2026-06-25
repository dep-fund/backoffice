export interface StandardUserResponse {
  id: string;
  username: string;
  name: string;
  last_name: string;
  birthdate: string | null;
  email: string;
  image: string | null;
  activated: boolean;
  blocked: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  page_size: number;
  results: T[];
}

export interface ProjectResponse {
  id: string;
  name: string;
  description: string;
  total_amount: string;
  state: 'PENDING' | 'APPROVED' | 'CANCELED' | 'REJECTED';
  ubication: string;
  user_id: string;
  categories: Array<{ id: string; name: string; description: string | null; created_at: string; updated_at: string }>;
  created_at: string;
  updated_at: string;
  min_amount: string | null;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  annual_expenses: string | null;
  annual_gross_profit: string | null;
  roi: string | null;
  annual_benefits: string | null;
  suffix: string | null;
  dividend_address: string | null;
}