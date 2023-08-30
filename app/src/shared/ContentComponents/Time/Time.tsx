// import { formatDistance, } from 'date-fns'
import { formatTime } from '@/utils/helpers/prepare-data'
import { StyledTime } from './styled'

export const Time = ({ date }: { date: number }) => {
  // const getDate = new Date(date)

  // const time = formatDistance(new Date(), new Date(getDate), { addSuffix: true })
  return <StyledTime>{formatTime(date)}</StyledTime>
}
