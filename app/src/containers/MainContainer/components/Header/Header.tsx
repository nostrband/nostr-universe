import { Link } from 'react-router-dom'
import { Avatar, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { Header as HeaderLayout } from '@/layout/Header/Header'
import styles from './header.module.scss'

export const Header = () => {
  return (
    <HeaderLayout>
      <IconButton className={styles.profileButton} component={Link} to="/profile">
        <Avatar src="https://i.pravatar.cc/150?img=3" />
      </IconButton>

      <IconButton color="inherit" size="large">
        <SearchIcon />
      </IconButton>
    </HeaderLayout>
  )
}
