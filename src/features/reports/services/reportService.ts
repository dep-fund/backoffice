import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';
import type { FundraisingReport } from '../types/report.types';

export const fetchFundraisingReport = async (token: string): Promise<FundraisingReport> => {
  return apiClient<FundraisingReport>(
    ENDPOINTS.REPORTS.FUNDRAISING,
    {},
    token,
  );
};
