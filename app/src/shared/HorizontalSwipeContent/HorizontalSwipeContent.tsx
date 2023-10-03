import { StyledWrapper } from './styled'

export const HorizontalSwipeContent = ({
  children,
  childrenWidth
}: {
  children: React.ReactNode
  childrenWidth?: number
}) => {
  return <StyledWrapper childrenWidth={childrenWidth}>{children}</StyledWrapper>
}
