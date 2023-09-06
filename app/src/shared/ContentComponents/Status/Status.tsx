import { StyledTime } from '../Time/styled'
import { Time } from '../Time/Time'

type Props = {
  isLive: boolean
  date: number
}

export const Status = ({ isLive, date }: Props) => {
  return isLive ? <StyledTime>Live</StyledTime> : <Time date={date} />
}
