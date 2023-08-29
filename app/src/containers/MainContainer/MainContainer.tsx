import { Outlet, useLocation } from 'react-router-dom'
import { AppPinMenu } from '@/components/AppPinMenu/AppPinMenu'
import { useAppSelector } from '@/store/hooks/redux'
import { ModalImportKey } from '@/components/Modal/ModaImporKey/ModalImportKey'
import { Header } from './components/Header/Header'
import { TrendingProfiles } from './components/TrendingProfiles/TrendingProfiles'
import { AppsNostro } from './components/AppsNostro/AppsNostro'
import { TabMenu } from './components/TabMenu/TabMenu'
import { ModalSelectApp } from '@/components/Modal/ModalSelectApp/ModalSelectApp'
import { ContactList } from './components/ContactList/ContactList'

export const MainContainer = () => {
  const { isOpenTabWindow } = useAppSelector((state) => state.tab)
  const location = useLocation()
  const isShowAppPinMenu = location.pathname !== '/profile'

  return (
    <>
      <Header />
      <TrendingProfiles />

      <ContactList />
      <AppsNostro />

      <ModalSelectApp />
      <ModalImportKey />

      {isShowAppPinMenu && !isOpenTabWindow && <AppPinMenu />}
      {isOpenTabWindow && <TabMenu />}

      <Outlet />
    </>
  )
}
