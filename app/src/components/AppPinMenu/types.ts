import { BoxProps, SwipeableDrawerProps } from '@mui/material'

export interface IAppPinMenu {
  window?: () => Window
}

export interface IStyledPinApps extends BoxProps {
  drawerbleeding: number
  open: boolean
}

export interface ISwipeableMenu extends SwipeableDrawerProps {
  isdrag?: number
  initialpoint: null | number
}
