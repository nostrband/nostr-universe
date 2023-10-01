import { TrendingProfiles } from './components/TrendingProfiles/TrendingProfiles'
import { AppsNostro } from './components/AppsNostro/AppsNostro'
import { Highlights } from './components/Highlights/Highlights'
import { TrendingNotes } from './components/TrendingNotes/TrendingNotes'
import { BigZaps } from './components/BigZaps/BigZaps'
import { LongPosts } from './components/LongPosts/LongPosts'
import { LiveEvents } from './components/LiveEvents/LiveEvents'
import { Communities } from './components/Communities/Communities'
import { SuggestedProfiles } from './components/SuggestedProfiles/SuggestedProfiles'
import { WelcomeWidget } from '@/components/WelcomeWidget/WelcomeWidget'
import { StyledWrapVisibility } from '../styled'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks/redux'
import { isGuest } from '@/utils/helpers/prepare-data'

export const MainPage = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'content'

  const { keys } = useAppSelector((state) => state.keys)
  const guest = !keys.length || isGuest(keys[0])

  return (
    <StyledWrapVisibility isShow={isShow}>
      {guest && (<WelcomeWidget />)}
      <TrendingNotes />
      <TrendingProfiles />
      {!guest && (
        <>
          <Highlights />
          <BigZaps />
          <LongPosts />
          <LiveEvents />
          <Communities />
          <SuggestedProfiles />
        </>
      )}
      <AppsNostro />
    </StyledWrapVisibility>
  )
}
