import { Zoom, createTheme } from '@mui/material';

export const myTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#dcdcdc',
      light: '#efefef',
      dark: '#afafaf',
      contrastText: '#242105',
    },
    text: {
      primary: '#ffffffd0',
      secondary: '#ffffffa0',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        size: 'small',
        spellCheck: false,
      },
      styleOverrides: {
        root: {
          wordBreak: 'break-all',
        },
      },
    },
    MuiRadio: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },

      styleOverrides: {
        contained: {
          color: 'inherit',
          background: '#00000033',
          border: '1px solid #ffffff66',
          '&:hover': {
            background: '#00000066',
            boxShadow: 'none',
            border: '1px solid #ffffff88',
          },
        },
        root: {
          boxShadow: 'none',
          textTransform: 'none',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: false,
        placement: 'bottom',
        TransitionComponent: Zoom,
        enterDelay: 500,
        disableInteractive: true,
      },
      styleOverrides: {
        tooltip: {
          background: 'black',
        },
        arrow: {
          color: 'black',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none' },
      },
    },
  },
});
