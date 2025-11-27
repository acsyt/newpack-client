import { alpha, darken, createTheme } from '@mui/material/styles';

import { Color } from './colors';

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    cancel: true;
  }

  interface ButtonPropsVariantOverrides {
    cancel: true;
  }
}

export const customTheme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: Color.primary,
      contrastText: Color.white
    },
    secondary: {
      main: Color.secondary
    },
    warning: {
      main: Color.lightGreen,
      contrastText: Color.white
    },
    success: {
      main: Color.success,
      contrastText: Color.white
    },
    error: {
      main: Color.error,
      contrastText: Color.white
    },
    common: {
      black: Color.black,
      white: Color.white
    }
  },
  typography: {
    fontFamily: "'Branding', sans-serif"
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: _theme => ({
        '*': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(Color.primary, 0.05),
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(Color.primary, 0.3),
            borderRadius: '4px',
            '&:hover': {
              background: darken(Color.primary, 0.1)
            }
          },
          '&:-webkit-autofill': {
            '-webkit-box-shadow': `0 0 0 1000px ${alpha(Color.primary, 0.02)} inset !important`,
            '-webkit-text-fill-color': `${Color.black} !important`,
            'border-radius': '9.6px !important',
            transition: 'background-color 5000s ease-in-out 0s !important'
          },
          '&:-webkit-autofill:hover': {
            '-webkit-box-shadow': `0 0 0 1000px ${alpha(Color.primary, 0.04)} inset !important`,
            '-webkit-text-fill-color': `${Color.black} !important`
          },
          '&:-webkit-autofill:focus': {
            '-webkit-box-shadow': `0 0 0 1000px ${alpha(Color.primary, 0.06)} inset !important`,
            '-webkit-text-fill-color': `${Color.black} !important`
          }
        }
      })
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          position: 'static',
          transform: 'none !important',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: 500,
          color: Color.black,
          transition: 'none',
          '&.Mui-focused': {
            color: Color.black
          }
        }
      },
      defaultProps: {
        disableAnimation: true
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.spacing(1.2),
          minHeight: '32px',
          display: 'flex',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: Color.primary
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: Color.primary,
            borderWidth: '1px'
          }
        }),
        input: {
          padding: '8px 16px',
          fontSize: '16px',
          lineHeight: '1.5',
          height: 'auto',
          '&::placeholder': {
            opacity: 1
          }
        },
        notchedOutline: {
          legend: {
            display: 'none'
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            padding: '0px 10px',
            minHeight: '32px'
          },
          '& .MuiAutocomplete-input': {
            padding: '8px 0px !important'
          },
          '& .MuiAutocomplete-endAdornment': {
            right: '10px'
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        InputLabelProps: {
          shrink: true
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '11px'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        className: 'font-semibold rounded-lg'
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.spacing(1)
        })
      },
      variants: [
        {
          props: { variant: 'cancel' },
          style: {
            className:
              'border border-gray-300 text-gray-700 bg-transparent hover:border-gray-400 hover:bg-gray-100 active:bg-gray-200'
          }
        }
      ]
    }
  }
});
