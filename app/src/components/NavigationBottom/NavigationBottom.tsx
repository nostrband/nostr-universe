import BottomNavigation from '@mui/material/BottomNavigation'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { StyledBottomNavigationAction } from './styled'
import { navigate } from '@/store/reducers/router.slice'
import { getValuePageSlug } from '@/utils/helpers/general'

export const NavigationBottom = () => {
  const dispatch = useAppDispatch()
  const activeValueTab = useAppSelector((state) => getValuePageSlug(state.router.slugs))

  return (
    <BottomNavigation
      showLabels
      value={activeValueTab}
      onChange={(_, path) => {
        dispatch(
          navigate({
            navigateOptions: {
              pathname: '/',
              search: `?page=${path}`
            }
          })
        )
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
