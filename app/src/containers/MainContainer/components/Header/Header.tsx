import { Link } from 'react-router-dom'
import { Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Header as HeaderLayout } from '@/layout/Header/Header'
import { useAppSelector } from '@/store/hooks/redux'
import { getProfileImage } from '@/utils/helpers/prepare-data'
import { StyledIconButton } from './styled'

export const Header = () => {
  const { currentProfile } = useAppSelector((state) => state.profile)
  const { isOpen } = useAppSelector((state) => state.tab)

  return (
    <HeaderLayout>
      <StyledIconButton component={Link} to="/profile">
        <Avatar src={getProfileImage(currentProfile)} />
      </StyledIconButton>

      <div>
        <IconButton color="inherit" size="medium">
          <SearchIcon />
        </IconButton>
        {isOpen && (
          <IconButton color="inherit" size="medium">
            <MoreVertIcon />
          </IconButton>
        )}
      </div>
    </HeaderLayout>
  )
}
