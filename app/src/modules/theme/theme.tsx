import { OutfitExtraLight, OutfitLight, OutfitRegular, OutfitMedium, OutfitSemiBold, OutfitBold } from '@/assets/fonts'
import { createTheme } from '@mui/material'
import { grey } from '@mui/material/colors'

const color = grey[800]

declare module '@mui/material/styles' {
  interface Palette {
    light: Palette['primary']
    decorate: Palette['primary']
    actionPrimary: Palette['primary']
    textPrimaryDecorate: Palette['primary']
    textSeocondaryDecorate: Palette['primary']
  }

  interface PaletteOptions {
    light?: Palette['primary']
    decorate?: Palette['primary']
    actionPrimary?: Palette['primary']
    textPrimaryDecorate?: Palette['primary']
    textSeocondaryDecorate?: Palette['primary']
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsColorOverrides {
    light: true
  }
}

declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    decorate: true
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    actionPrimary: true
  }
}

export const theme = createTheme({
  palette: {
    secondary: {
      main: '#222222',
      dark: '#111111'
    },
    light: {
      light: '#fff',
      main: '#222222',
      dark: '#000',
      contrastText: '#fff'
    },
    decorate: {
      light: '#fff',
      main: '#CF82FF',
      dark: '#000',
      contrastText: '#000'
    },
    background: {
      default: '#000'
    },
    text: {
      primary: '#8F8F8F'
    },
    textPrimaryDecorate: {
      light: '#000',
      main: '#E2E8A3',
      dark: '#000',
      contrastText: '#000'
    },
    textSeocondaryDecorate: {
      light: '#000',
      main: '#CBA3E8',
      dark: '#000',
      contrastText: '#000'
    },
    actionPrimary: {
      light: '#000',
      main: color,
      dark: '#000',
      contrastText: '#fff'
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: ['Outfit', 'sans-serif'].join(',')
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@font-face': [OutfitExtraLight, OutfitLight, OutfitRegular, OutfitMedium, OutfitSemiBold, OutfitBold]
        }
      }
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: ({ theme }) =>
          theme.unstable_sx({
            backgroundColor: theme.palette.secondary.main,
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: 9999,
            width: '100%',
            height: 60
          })
      }
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: ({ theme }) =>
          theme.unstable_sx({
            color: theme.palette.secondary.contrastText,
            '&.Mui-selected': {
              color: theme.palette.decorate.main
            }
          })
      }
    }
  }
})
