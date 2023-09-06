import { StyledTime } from '../Time/styled'

type Props = {
  status: string
}

export const Status = ({ status = 'Live' }: Props) => {
  return <StyledTime>{status}</StyledTime>
}
