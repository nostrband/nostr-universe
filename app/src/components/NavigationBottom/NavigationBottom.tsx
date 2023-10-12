import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { useAppDispatch } from '@/store/hooks/redux'
import { setPage } from '@/store/reducers/positionScrollPage.slice'

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
      <BottomNavigationAction label="Apps" icon={<AppsOutlinedIcon />} value="apps" />
      <BottomNavigationAction label="New" icon={<AutoAwesomeOutlinedIcon />} value="content" />
      <BottomNavigationAction label="Search" icon={<SearchOutlinedIcon />} value="search" />
      <BottomNavigationAction label="Best" icon={<BookmarkOutlinedIcon />} value="bookmarks" />
      <BottomNavigationAction label="Tabs" icon={<WidgetsOutlinedIcon />} value="tabs-switcher" />
    </BottomNavigation>
  )
}
