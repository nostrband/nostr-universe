import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { useAppDispatch } from '@/store/hooks/redux'
import { setPage } from '@/store/reducers/positionScrollPage.slice'
import { StyledBottomNavigationAction } from './styled'

export const NavigationBottom = () => {
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const activeTab = searchParams.get('page') ? searchParams.get('page') : 'apps'

  return (
    <BottomNavigation
      showLabels
      value={activeTab}
      onChange={(_, path) => {
        if (path === 'apps') {
          navigate({
            pathname: '/'
          })
          dispatch(setPage({ page: '/' }))
        } else {
          navigate({
            pathname: '/',
            search: `?page=${path}`
          })
          dispatch(setPage({ page: path }))
        }
      }}
    >
      <StyledBottomNavigationAction label="Apps" icon={<AppsOutlinedIcon />} value="apps" />
      <StyledBottomNavigationAction label="New" icon={<AutoAwesomeOutlinedIcon />} value="content" />
      <StyledBottomNavigationAction label="Search" icon={<SearchOutlinedIcon />} value="search" />
      <StyledBottomNavigationAction label="Best" icon={<BookmarkOutlinedIcon />} value="bookmarks" />
      <StyledBottomNavigationAction label="Tabs" icon={<WidgetsOutlinedIcon />} value="tabs-switcher" />
    </BottomNavigation>
  )
}
