import type { Theme } from '@mui/material/styles';
import type { FC, PropsWithChildren } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

interface ThemeRegistryProps {
  theme: Theme;
}

export const ThemeRegistry: FC<PropsWithChildren<ThemeRegistryProps>> = ({
  children,
  theme
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
