import type { FC } from 'react';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import MuiLink from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from '@tanstack/react-router';

import { useRouteConfig } from '@/routes/route.config';
import { FontWeight } from '@/theme/font-weight';

interface DashboardBreadcrumbsProps {}

export const DashboardBreadcrumbs: FC<DashboardBreadcrumbsProps> = ({}) => {
  const pathname = useLocation().pathname;

  const { currentRoute } = useRouteConfig();

  const segments = pathname.split('/').filter(Boolean);

  const ids = segments.filter(segment => !isNaN(+segment));

  let idIndex = 0;

  const updatedBreadcrumbs = currentRoute?.breadcrumbs.map(breadcrumb => {
    if (!breadcrumb.path && breadcrumb.title === ':id') {
      return {
        ...breadcrumb,
        title: ids[idIndex++]
      };
    }

    return breadcrumb;
  });

  if (!updatedBreadcrumbs) return null;

  return (
    <Breadcrumbs aria-label='breadcrumb' separator={'|'}>
      {updatedBreadcrumbs.map((breadcrumb, index) =>
        index === updatedBreadcrumbs.length - 1 ? (
          <Typography
            key={index}
            color='primary'
            textTransform='uppercase'
            fontWeight={FontWeight.medium}
          >
            {breadcrumb.title}
          </Typography>
        ) : breadcrumb.path ? (
          <MuiLink
            key={index}
            component={Link}
            underline='hover'
            color='inherit'
            href={breadcrumb.path}
            textTransform='uppercase'
            fontWeight={FontWeight.medium}
          >
            {breadcrumb.title}
          </MuiLink>
        ) : (
          <Typography
            key={index}
            color='inherit'
            textTransform='uppercase'
            fontWeight={FontWeight.medium}
          >
            {breadcrumb.title}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
};
