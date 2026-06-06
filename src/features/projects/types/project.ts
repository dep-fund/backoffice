export interface ProjectCategory {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  objective_amount: number;
  ubication: string;
  state: string;
  created_at: string;
  user_id: string;
  categories: ProjectCategory[];
}

export interface ProjectsResponse {
  results: Project[];
  total: number;
}