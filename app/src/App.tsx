import { useEffect } from 'react'
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { NavigationBottom } from './components/NavigationBottom/NavigationBottom'
import { AppsPage } from './pages/AppsPage/AppsPage'
import { MainPage } from './pages/MainPage/MainPage'
import { TabsSwitcherPage } from './pages/TabsSwitcherPage/TabsSwitcherPage'
import { ModalImportKey } from './components/Modal/ModalImporKey/ModalImportKey'
import { ProfilePage } from './pages/ProfilePage/ProfilePage'
import { ModalTabMenu } from './components/Modal/ModalTabMenu/ModalTabMenu'
import { ModalWallet } from './components/Modal/ModalWallet/ModalWallet'
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
import { setPage } from './store/reducers/positionScrollPage.slice'
import { ModalFindApp } from './components/Modal/ModalFindApp/ModalFindApp'
import { ModalAddNSBKey } from './components/Modal/ModalAddNSBKey/ModalAddNSBKey'
import { ModalPinSettings } from './components/Modal/ModalPinSettings/ModalPinSettings'
import { ModalContentFeedSettings } from './components/Modal/ModalContentFeedSettings/ModalContentFeedSettings'
import { ModalSignedEvents } from './components/Modal/ModalSignedEvents/ModalSignedEvents'
import { BookmarksPage } from './pages/BookmarksPage/BookmarksPage'
import { ModalPaymentHistory } from './components/Modal/ModalPaymentHistory/ModalPaymentHistory'

export const App = () => {
  // const { pathname,search } = useLocation()
  const { page } = useAppSelector((state) => state.positionScrollPage)
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  // const dispatch = useAppDispatch()

  // const handleScroll = () => {
  //   dispatch(setPositionScroll({ page: pathname, value: window.scrollY }))
  // }

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [pathname])

  // useEffect(() => {
  //   window.scrollTo(0, position[pathname])
  // }, [pathname])

  useEffect(() => {
    dispatch(setPage({ page: searchParams.get('page') }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTitle = () => {
    switch (page) {
      case '/':
        return 'Apps'

      case 'content':
        return 'New'

      case 'tabs-switcher':
        return 'Tabs'

      case 'bookmarks':
        return 'Best'

      case 'search':
        return 'Search'

      default:
        return 'Apps'
    }
  }

  return (
    <>
      <StyledWrapper>
        <Header title={getTitle()} />

        {/* <Routes>
          <Route index path="/" element={<AppsPage />} />
          <Route path="/content" element={<MainPage />} />
          <Route path="/tabs-switcher" element={<TabsSwitcherPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<AppsPage />} />
        </Routes> */}
        <Routes>
          <Route index path="/" element={<AppsPage />} />
          <Route path="*" element={<AppsPage />} />
        </Routes>

        <MainPage />
        <TabsSwitcherPage />
        <BookmarksPage />
        <SearchPage />

        <NavigationBottom />
      </StyledWrapper>

      {/* Modal pages */}
      <ModalImportKey />
      <ProfilePage />
      <ModalTabMenu />
      <ModalWallet />
      <ModalSelectApp />
      <ModalPermissionsRequest />
      <TabPage />
      <ModalContextMenu />
      <ModalProfileTabMenu />
      <ModalAddKey />
      <ModalAbout />
      <ModalFindApp />
      <ModalAddNSBKey />
      <ModalPinSettings />
      <ModalContentFeedSettings />
      <ModalSignedEvents />
      <ModalPaymentHistory />
    </>
  )
}
