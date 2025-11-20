import { apiFetcherCentral, apiFetcherTenant } from '../api/api-fetcher';

import { getTenant } from './get-tenant.util';

export const getFetcher = () => {
  const tenant = getTenant();
  const fetcher = tenant ? apiFetcherTenant : apiFetcherCentral;

  return fetcher;
};
