import type { Theme } from "@mui/material/styles";
import type { FC, PropsWithChildren } from "react";

import { ThemeProvider } from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";

interface ThemeRegistryProps {
  theme: Theme;
}

export const ThemeRegistry: FC<PropsWithChildren<ThemeRegistryProps>> = ({
  children,
  theme,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
