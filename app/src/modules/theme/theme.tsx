import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Palette {
    light: Palette['primary']
    decorate: Palette['primary']
  }

  interface PaletteOptions {
    light?: Palette['primary']
    decorate?: Palette['primary']
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

export const theme = createTheme({
  palette: {
    secondary: {
      main: '#222222'
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
    }
  },
  shape: {
    borderRadius: 12
  }
})
