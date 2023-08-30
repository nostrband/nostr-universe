import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemCommunitie } from './types'
import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { cropName } from '@/utils/helpers/prepare-data'

export const ItemCommunitie = ({ name, picture, time, content, subtitle }: IItemCommunitie) => {
  return (
    <Wrapper>
      <Head>
        <ProfileInfo picture={picture} name={cropName(name, 10)} isNotRounded />
        <Time date={time} />
      </Head>
      <SubTitle>{subtitle}</SubTitle>
      <Content contentLine={2}>{content}</Content>
    </Wrapper>
  )
}
