import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemBigZap } from './types'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'

export const ItemBigZap = ({ name, picture, time, subtitle }: IItemBigZap) => {
  return (
    <Wrapper>
      <Head>
        <ProfileInfo picture={picture} name={name} />
        <Time date={time} />
      </Head>
      <SubTitle>{subtitle}</SubTitle>
    </Wrapper>
  )
}
