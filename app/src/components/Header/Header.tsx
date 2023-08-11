import { useNavigate } from 'react-router-dom'
import { Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { StyledButton, StyledHeader } from './styled'

export const Header = () => {
  const navigate = useNavigate()

  return (
    <StyledHeader>
      <StyledButton onClick={() => navigate('profile')}>
        <Avatar src="https://i.pravatar.cc/150?img=3" />
      </StyledButton>

      <IconButton color="inherit" size="large">
        <SearchIcon />
      </IconButton>
    </StyledHeader>
  )
}
