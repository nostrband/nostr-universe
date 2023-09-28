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
import { SearchPage } from './pages/SearchPage/SearchPage'
import { ModalAddKey } from './components/Modal/ModalAddKey/ModalAddKey'
import { ModalAbout } from './components/Modal/ModalAbout/ModalAbout'
import { useAppDispatch, useAppSelector } from './store/hooks/redux'
import { setPositionScroll } from './store/reducers/positionScrollPage.slice'

export const App = () => {
  const { pathname } = useLocation()
  const { position } = useAppSelector((state) => state.positionScrollPage)
  const dispatch = useAppDispatch()

  const handleScroll = () => {
    dispatch(setPositionScroll({ page: pathname, value: window.scrollY }))
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  useEffect(() => {
    window.scrollTo(0, position[pathname])
  }, [pathname])

  const getTitle = () => {
    switch (pathname) {
      case '/':
        return 'Apps'

      case '/content':
        return 'Content'

      case '/tabs-switcher':
        return 'Tabs'

      case '/search':
        return 'Search'

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
          <Route path="/search" element={<SearchPage />} />
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
      <ModalAddKey />
      <ModalAbout />
    </>
  )
}
