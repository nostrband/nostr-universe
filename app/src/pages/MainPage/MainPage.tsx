import { TrendingProfiles } from './components/TrendingProfiles/TrendingProfiles'
import { AppsNostro } from './components/AppsNostro/AppsNostro'
import { ModalSelectApp } from '@/components/Modal/ModalSelectApp/ModalSelectApp'
import { Highlights } from './components/Highlights/Highlights'
import { TrendingNotes } from './components/TrendingNotes/TrendingNotes'
import { BigZaps } from './components/BigZaps/BigZaps'
import { LongPosts } from './components/LongPosts/LongPosts'
import { LiveEvents } from './components/LiveEvents/LiveEvents'
import { Communities } from './components/Communities/Communities'
import { StyledWrapperMain } from './styled'
import { SuggestedProfiles } from './components/SuggestedProfiles/SuggestedProfiles'
import { ModalSearch } from '@/components/Modal/ModalSearch/ModaSearch'
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage'
import { ModalTabMenu } from '@/components/Modal/ModalTabMenu/ModalTabMenu'
import { TabPage } from '../TabPage/TabPage'
import { ModalContextMenu } from '@/components/Modal/ModalContextMenu/ModalContextMenu'
import { ModalPermissionsRequest } from '@/components/Modal/ModalPermissionsRequest/ModalPermissionsRequest'
import { ModalTabSwitcher } from '@/components/Modal/ModalTabSwitcher/ModalTabSwitcher'
import { ModalWallet } from '@/components/Modal/ModalWallet/ModalWallet'
import { TabsSwitcherPage } from '../TabsSwitcherPage/TabsSwitcherPage'
import { NavigationBottom } from '@/components/NavigationBottom/NavigationBottom'
import { Header } from '@/components/Header/Header'
import { AppsPage } from '../AppsPage/AppsPage'
import { WelcomeWidget } from '@/components/WelcomeWidget/WelcomeWidget'
import { ModalImportKey } from '@/components/Modal/ModalImporKey/ModalImportKey'

export const MainPage = () => {
  return (
    <StyledWrapperMain>
      <Header />
      <WelcomeWidget />
      <TrendingNotes />
      <TrendingProfiles />
      <Highlights />
      <BigZaps />
      <LongPosts />
      <LiveEvents />
      <Communities />
      <SuggestedProfiles />

      <AppsNostro />

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
      <TabsSwitcherPage />
      <AppsPage />

      <NavigationBottom />
    </StyledWrapperMain>
  )
}
