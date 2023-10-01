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

export const MainPage = () => {
  const [searchParams] = useSearchParams()
  const isShow = searchParams.get('page') === 'content'

  return (
    <StyledWrapVisibility isShow={isShow}>
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
    </StyledWrapVisibility>
  )
}
