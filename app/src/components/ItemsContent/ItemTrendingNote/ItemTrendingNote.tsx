import { Content } from '@/shared/ContentComponents/Content/Content'
import { Head } from '@/shared/ContentComponents/Head/Head'
import { ProfileInfo } from '@/shared/ContentComponents/ProfileInfo/ProfileInfo'
import { Time } from '@/shared/ContentComponents/Time/Time'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { IItemTrendingNote } from './types'
import { cropName } from '@/utils/helpers/prepare-data'

export const ItemTrendingNote = ({ name, picture, time, content }: IItemTrendingNote) => {
  return (
    <Wrapper>
      <Head>
        <ProfileInfo picture={picture} name={cropName(name, 10)} />
        <Time date={time} />
      </Head>
      <Content>{content}</Content>
    </Wrapper>
  )
}
