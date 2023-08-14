import { BoxProps } from '@mui/material'

export interface IAppPinMenu {
  window?: () => Window
}

export interface IStyledPinApps extends BoxProps {
  drawerBleeding: number
}
