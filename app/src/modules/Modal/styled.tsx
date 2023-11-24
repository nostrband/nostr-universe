import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { AppBar, Dialog } from '@mui/material'
import { IStyledDialogProps } from './types'

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: 'none',
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100%',
  marginBottom: 10,
  borderBottom: '1px solid',
  borderColor: theme.palette.secondary.main
}))

export const StyledDialog = styled(
  forwardRef<HTMLDivElement, IStyledDialogProps>(function BoxDisplayName(props, ref) {
    const exclude = new Set(['isNotRounded'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Dialog ref={ref} open={props.open} {...omitProps} />
  })
)(({ theme, zIndex }) => ({
  zIndex: zIndex ? theme.zIndex.modal + zIndex : theme.zIndex.modal,
  '.MuiDialog-paper': {
    paddingTop: 65,
    backgroundColor: theme.palette.background.default
  }
}))
