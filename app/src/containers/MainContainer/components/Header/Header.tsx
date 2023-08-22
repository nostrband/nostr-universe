import { Link } from 'react-router-dom'
import { Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Header as HeaderLayout } from '@/layout/Header/Header'
import { useAppSelector } from '@/store/hooks/redux'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { StyledIconButton } from './styled'

export const Header = () => {
  const { currentProfile } = useAppSelector((state) => state.profile)

  return (
    <HeaderLayout>
      <StyledIconButton component={Link} to="/profile">
        <Avatar src={getProfileImage(currentProfile)} />
      </StyledIconButton>

      <IconButton color="inherit" size="large">
        <SearchIcon />
      </IconButton>
    </HeaderLayout>
  )
}
