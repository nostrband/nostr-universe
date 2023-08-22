import { styled } from '@mui/material/styles'
import { Dialog } from '@mui/material'

export const StyledViewModal = styled(Dialog)(() => ({
  '.MuiDialog-paper': {
    margin: 0,
    width: 'calc(100% - 30px)',
    background: '#3D3D3D'
  }
}))
