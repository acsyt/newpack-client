import { useAuthStore } from '@/presentation/stores/auth.store';

export const useAuth = () => {
  const id = useAuthStore.getState().user?.id;
  const user = useAuthStore.getState().user;
  const permissions = useAuthStore.getState().user?.permissions ?? [];

  return { id, user, permissions };
};
