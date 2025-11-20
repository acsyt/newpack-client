import type { FC, PropsWithChildren } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useRouteConfig } from '@/presentation/routes/route.config';
import { FontWeight } from '@/presentation/theme/font-weight';

interface DashboardLayoutContainerProps {
  title?: string;
}

export const DashboardLayoutContainer: FC<
  PropsWithChildren<DashboardLayoutContainerProps>
> = ({ title, children }) => {
  const { currentRoute } = useRouteConfig();

  return (
    <Box>
      <Typography variant='h5' fontWeight={FontWeight.semiBold} color='primary'>
        {title || currentRoute?.title}
      </Typography>
      <Box mt={2}>{children}</Box>
    </Box>
  );
};
