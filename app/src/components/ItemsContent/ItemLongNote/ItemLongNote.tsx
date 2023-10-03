import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemLongNote } from './types'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { memo } from 'react'

export const ItemLongNote = memo(function ItemLongNote({
  pubkey,
  author,
  time,
  content,
  subtitle,
  onClick
}: IItemLongNote) {
  return (
    <Wrapper onClick={onClick}>
      <Head>
        <ProfileInfo pubkey={pubkey} profile={author} />
        <Time date={time} />
      </Head>
      <SubTitle>{subtitle}</SubTitle>
      <Content contentLine={2}>{content}</Content>
    </Wrapper>
  )
})
