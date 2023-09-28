import { useLocation, useNavigate } from 'react-router-dom'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'

export const NavigationBottom = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <BottomNavigation
      showLabels
      value={location.pathname}
      onChange={(_, path) => {
        navigate(path)
      }}
    >
      <BottomNavigationAction label="Apps" icon={<AppsOutlinedIcon />} value="/" />
      <BottomNavigationAction label="Content" icon={<DashboardOutlinedIcon />} value="/content" />
      <BottomNavigationAction label="Tabs" icon={<WidgetsOutlinedIcon />} value="/tabs-switcher" />
    </BottomNavigation>
  )
}
