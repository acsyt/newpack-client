import { Environment } from '../environments/env';

export const getTenant = (): string | null => {
  const host = window.location.host;

  // Check if host is an IP address using regex
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/;

  if (ipRegex.test(host)) {
    return null;
  }

  const hostParts = host.split('.') || [];
  const tenant = host && hostParts.length > 1 ? String(hostParts[0]) : null;

  if (tenant && tenant === Environment.adminSubdomain) return null;

  return tenant;
};
