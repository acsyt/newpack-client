import { useQuery } from '@tanstack/react-query';

import { AuthService } from '../auth.service';

export const authKeys = {
  all: ['auth'] as const,
  validateUser: () => [...authKeys.all, 'validate-user'] as const
};

export const useValidateUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.validateUser(),
    queryFn: AuthService.validateUser,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};
