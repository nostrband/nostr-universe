/* eslint-disable @typescript-eslint/ban-ts-comment */
import { memo } from 'react'
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
import { ModalFindApp } from './components/Modal/ModalFindApp/ModalFindApp'
import { ModalAddNSBKey } from './components/Modal/ModalAddNSBKey/ModalAddNSBKey'
import { ModalPinSettings } from './components/Modal/ModalPinSettings/ModalPinSettings'
import { ModalContentFeedSettings } from './components/Modal/ModalContentFeedSettings/ModalContentFeedSettings'
import { ModalSignedEvents } from './components/Modal/ModalSignedEvents/ModalSignedEvents'
import { BookmarksPage } from './pages/BookmarksPage/BookmarksPage'
import { ModalNPSScore } from './components/Modal/ModalNPSScore/ModalNPSScore'
import { ModalPaymentHistory } from './components/Modal/ModalPaymentHistory/ModalPaymentHistory'
import { ModalAppOfTheDay } from './components/Modal/ModalAppOfTheDay/ModalAppOfTheDay'
import { ModalSync } from './components/Modal/ModalSync/ModalSync'
import { ModalFeed } from './components/Modal/ModalFeed/ModalFeed'
import { ModalFeedApp } from './components/Modal/ModalFeedApp/ModalFeedApp'
import { ModalTrust } from './components/Modal/ModalTrust/ModalTrust'
import { useCustomNavigate } from '@/hooks/navigate'

export const App = memo(function App() {
  const navigate = useCustomNavigate()

  return (
    <>
      {import.meta.env.DEV && (
        <button
          style={{ position: 'fixed', zIndex: 9999 }}
          onClick={() => {
            navigate(-1)
          }}
        >
          back
        </button>
      )}
      <StyledWrapper>
        <Header />

        <AppsPage />
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
})
