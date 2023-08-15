import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { TrendingProfiles } from './components/TrendingProfiles/TrendingProfiles'
import { AppsNostro } from './components/AppsNostro/AppsNostro'
import { AppPinMenu } from '../../components/AppPinMenu/AppPinMenu'

export const MainContainer = () => {
  const location = useLocation()

  const isShowAppPinMenu = location.pathname !== '/profile'

  console.log(location.pathname)
  return (
    <>
      <Header />
      <TrendingProfiles />
      <AppsNostro />
      <Outlet />
      {isShowAppPinMenu && <AppPinMenu />}
    </>
  )
}
