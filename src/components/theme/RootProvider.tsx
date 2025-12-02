import type { FC, PropsWithChildren } from 'react';

import GlobalStyles from '@mui/material/GlobalStyles';
import { Theme } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from '@mui/x-date-pickers/locales';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Toaster } from 'sonner';

import { ThemeRegistry } from './ThemeRegistry';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(relativeTime);

interface RootProviderProps {
  theme: Theme;
}

export const RootProvider: FC<PropsWithChildren<RootProviderProps>> = ({
  children,
  theme
}) => {
  return (
    <>
      <ReactQueryDevtools />
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles='@layer theme, base, mui, components, utilities;' />
        <ThemeRegistry theme={theme}>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale='es-mx'
            localeText={
              esES.components.MuiLocalizationProvider.defaultProps.localeText
            }
          >
            <Toaster richColors />
            {children}
          </LocalizationProvider>
        </ThemeRegistry>
      </StyledEngineProvider>
    </>
  );
};
