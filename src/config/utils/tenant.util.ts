import { getTenant } from './get-tenant.util';

export const tenant = () => {
  const currentTenant = getTenant();
  const isTenant = Boolean(currentTenant);
  const isCentral = !isTenant;

  return {
    currentTenant,
    isTenant,
    isCentral
  };
};
