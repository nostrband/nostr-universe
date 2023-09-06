import { IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Header as HeaderLayout } from '@/layout/Header/Header'
import { StyledProfileTitle } from './styled'
import { IHeader } from './types'

export const Header = ({ handleClose }: IHeader) => {
  return (
    <HeaderLayout>
      <StyledProfileTitle variant="h4" gutterBottom component="div">
        My profile
      </StyledProfileTitle>

      <IconButton color="inherit" size="large" onClick={handleClose}>
        <CloseIcon />
      </IconButton>
    </HeaderLayout>
  )
}
