import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemBigZap } from './types'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { memo } from 'react'

export const ItemBigZap = memo(({ targetPubkey, targetMeta, time, subtitle }: IItemBigZap) => {
  return (
    <Wrapper>
      <Head>
        <ProfileInfo pubkey={targetPubkey} profile={targetMeta} />
        <Time date={time} />
      </Head>
      <SubTitle>{subtitle}</SubTitle>
    </Wrapper>
  )
})
