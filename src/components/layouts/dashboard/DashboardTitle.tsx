import type { FC } from 'react';

import Typography from '@mui/material/Typography';

import { useRouteConfig } from '@/routes/route.config';
import { FontWeight } from '@/theme/font-weight';

interface DashboardTitleProps {}

export const DashboardTitle: FC<DashboardTitleProps> = ({}) => {
  const { currentRoute } = useRouteConfig();

  if (!currentRoute) return null;

  return (
    <Typography variant='h5' fontWeight={FontWeight.semiBold} color='primary'>
      {currentRoute?.title}
    </Typography>
  );
};
