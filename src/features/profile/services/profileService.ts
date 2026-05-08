import { apiClient } from '../../../shared/utils/apiClient';
import { ENDPOINTS } from '../../../shared/constants/api';

import type { StandardUserResponse } from '../../users/types/users.types';

export const getProfile = async (
  token: string,
): Promise<StandardUserResponse> => {
  return apiClient<StandardUserResponse>(
    ENDPOINTS.ADMIN.ME,
    {},
    token,
  );
};