import { Outlet, useLocation } from 'react-router-dom'
import { AppPinMenu } from '@/components/AppPinMenu/AppPinMenu'
import { useAppSelector } from '@/store/hooks/redux'
import { Header } from './components/Header/Header'
import { TrendingProfiles } from './components/TrendingProfiles/TrendingProfiles'
import { AppsNostro } from './components/AppsNostro/AppsNostro'
import { TabMenu } from './components/TabMenu/TabMenu'

export const MainContainer = () => {
  const { isOpen } = useAppSelector((state) => state.tab)
  const location = useLocation()
  const isShowAppPinMenu = location.pathname !== '/profile'
  console.log({ isOpen })
  return (
    <>
      <Header />
      <main id="main">
        <TrendingProfiles />
        <AppsNostro />
      </main>
      <Outlet />
      {isShowAppPinMenu && !isOpen && <AppPinMenu />}
      {isOpen && <TabMenu />}
    </>
  )
}
