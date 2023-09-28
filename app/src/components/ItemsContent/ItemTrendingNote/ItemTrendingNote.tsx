import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemTrendingNote } from './types'
import { memo } from 'react'

export const ItemTrendingNote = memo(function ItemTrendingNote({ author, pubkey, time, content }: IItemTrendingNote) {
  return (
    <Wrapper>
      <Head>
        <ProfileInfo profile={author} pubkey={pubkey} />
        <Time date={time} />
      </Head>
      <Content>{content}</Content>
    </Wrapper>
  )
})
