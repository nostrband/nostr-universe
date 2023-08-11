import { ThemeProvider as ThemeMuiProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'
import { ITheme } from './types'

export const ThemeProvider = ({ children }: ITheme) => (
  <ThemeMuiProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeMuiProvider>
)
