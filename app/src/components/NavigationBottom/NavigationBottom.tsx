import { useLocation } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'

export const NavigationBottom = () => {
  const { handleOpen, handleClose } = useOpenModalSearchParams()
  const location = useLocation()
  const isShowNavigationBottom =
    location.search.includes(MODAL_PARAMS_KEYS.TABS_SWITCHER_PAGE) ||
    location.search.includes(MODAL_PARAMS_KEYS.APPS_PAGE) ||
    !location.search

  const getActivePath = () => {
    if (location.search.includes(MODAL_PARAMS_KEYS.TABS_SWITCHER_PAGE)) {
      return MODAL_PARAMS_KEYS.TABS_SWITCHER_PAGE
    }

    if (location.search.includes(MODAL_PARAMS_KEYS.APPS_PAGE)) {
      return MODAL_PARAMS_KEYS.APPS_PAGE
    }

    if (!location.search) {
      return '/'
    }
  }

  return (
    <BottomNavigation
      sx={{ zIndex: !isShowNavigationBottom ? 1 : 9999 }}
      showLabels
      value={getActivePath()}
      onChange={(_, path) => {
        if (path === '/') {
          handleClose(path)
        } else {
          handleOpen(path, { replace: true })
        }
      }}
    >
      <BottomNavigationAction label="Apps" icon={<AppsOutlinedIcon />} value={MODAL_PARAMS_KEYS.APPS_PAGE} />
      <BottomNavigationAction label="Content" icon={<DashboardOutlinedIcon />} value="/" />
      <BottomNavigationAction
        label="Tabs"
        icon={<WidgetsOutlinedIcon />}
        value={MODAL_PARAMS_KEYS.TABS_SWITCHER_PAGE}
      />
    </BottomNavigation>
  )
}
