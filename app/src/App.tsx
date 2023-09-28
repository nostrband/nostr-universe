import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { NavigationBottom } from './components/NavigationBottom/NavigationBottom'
import { AppsPage } from './pages/AppsPage/AppsPage'
import { MainPage } from './pages/MainPage/MainPage'
import { TabsSwitcherPage } from './pages/TabsSwitcherPage/TabsSwitcherPage'
import { ModalImportKey } from './components/Modal/ModalImporKey/ModalImportKey'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { ModalTabMenu } from './components/Modal/ModalTabMenu/ModalTabMenu'
import { ModalTabSwitcher } from './components/Modal/ModalTabSwitcher/ModalTabSwitcher'
import { ModalWallet } from './components/Modal/ModalWallet/ModalWallet'
import { ModalSearch } from './components/Modal/ModalSearch/ModaSearch'
import { ModalSelectApp } from './components/Modal/ModalSelectApp/ModalSelectApp'
import { ModalPermissionsRequest } from './components/Modal/ModalPermissionsRequest/ModalPermissionsRequest'
import { TabPage } from './pages/TabPage/TabPage'
import { ModalContextMenu } from './components/Modal/ModalContextMenu/ModalContextMenu'
import { ModalProfileTabMenu } from './components/Modal/ModalProfileTabMenu/ModalProfileTabMenu'
import { StyledWrapper } from './styled'
import { Header } from './components/Header/Header'

export const App = () => {
  const { pathname } = useLocation()

  const handleScroll = () => {
    localStorage.setItem(pathname, String(window.scrollY))
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  useEffect(() => {
    window.scrollTo(0, Number(localStorage.getItem(pathname)))
  }, [pathname])

  useEffect(() => {
    localStorage.clear()
  }, [])

  const getTitle = () => {
    switch (pathname) {
      case '/':
        return 'Apps'

      case '/content':
        return 'Content'

      case '/tabs-switcher':
        return 'Tabs'

      default:
        return 'Apps'
    }
  }

  return (
    <>
      <StyledWrapper>
        <Header title={getTitle()} />

        <Routes>
          <Route index path="/" element={<AppsPage />} />
          <Route path="/content" element={<MainPage />} />
          <Route path="/tabs-switcher" element={<TabsSwitcherPage />} />
          <Route path="*" element={<AppsPage />} />
        </Routes>

        <NavigationBottom />
      </StyledWrapper>

      {/* Modal pages */}
      <ModalImportKey />
      <ProfilePage />
      <ModalTabSwitcher />
      <ModalTabMenu />
      <ModalWallet />
      <ModalSearch />
      <ModalSelectApp />
      <ModalPermissionsRequest />
      <TabPage />
      <ModalContextMenu />
      <ModalProfileTabMenu />
    </>
  )
}
