import BottomNavigation from '@mui/material/BottomNavigation'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledBottomNavigationAction } from './styled'
import { useCustomNavigate } from '@/hooks/useCustomNavigate.ts'
import { useSearchParams } from '@/hooks/useSearchParams.ts'

export const NavigationBottom = () => {
  const navigate = useCustomNavigate()

  const getSearchParams = useSearchParams()
  const activeValueTab = getSearchParams('page')

  const slugs = useAppSelector((state) => state.router)
  console.log({ slugs_store: slugs })

  return (
    <BottomNavigation
      showLabels
      value={activeValueTab}
      onChange={(_, path) => {
        navigate({
          pathname: '/',
          search: `?page=${path}`
        })
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
