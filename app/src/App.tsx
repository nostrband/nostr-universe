/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { ModalNPSScore } from './components/Modal/ModalNPSScore/ModalNPSScore'
import { ModalPaymentHistory } from './components/Modal/ModalPaymentHistory/ModalPaymentHistory'
import { ModalAppOfTheDay } from './components/Modal/ModalAppOfTheDay/ModalAppOfTheDay'
import { setAppOfTheDay } from './store/reducers/notifications.slice'
import { dbi } from './modules/db'
import { formatDate } from './consts'
import { format } from 'date-fns'
import { useOpenModalSearchParams } from './hooks/modal'
import { MODAL_PARAMS_KEYS } from './types/modal'
import { ModalSync } from './components/Modal/ModalSync/ModalSync'
import { ModalFeed } from './components/Modal/ModalFeed/ModalFeed'
import { ModalFeedApp } from './components/Modal/ModalFeedApp/ModalFeedApp'
import { ModalTrust } from './components/Modal/ModalTrust/ModalTrust'

export const App = () => {
  // const { pathname,search } = useLocation()
  const { page } = useAppSelector((state) => state.positionScrollPage)
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { handleOpen } = useOpenModalSearchParams()

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
    const load = async () => {
      console.log('AOTD start load', Date.now())
      let clicked = false
      // @ts-ignore
      if (window.cordova) {
        // @ts-ignore
        const clickedNotification = window.cordova.plugins.notification.local.launchDetails
        clicked = !!clickedNotification
      }

      if (!clicked) return
      const currentDate = format(new Date(), formatDate)
      const existedApp = await dbi.getAOTDByShownDate(currentDate)
      if (!existedApp) return

      dispatch(setAppOfTheDay({ app: existedApp.app }))
      handleOpen(MODAL_PARAMS_KEYS.APP_OF_THE_DAY_MODAL)
      console.log('AOTD start loaded', Date.now(), existedApp)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(setPage({ page: searchParams.get('page') }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTitle = () => {
    ;``
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
      <ModalProfileTabMenu />
      <ModalAddKey />
      <ModalAbout />
      <ModalFindApp />
      <ModalAddNSBKey />
      <ModalPinSettings />
      <ModalContentFeedSettings />
      <ModalSignedEvents />
      <ModalNPSScore />
      <ModalPaymentHistory />
      <ModalAppOfTheDay />
      <ModalSync />
      <ModalFeedApp />
      <ModalFeed />
      <ModalContextMenu />
      <ModalTrust />
    </>
  )
}
