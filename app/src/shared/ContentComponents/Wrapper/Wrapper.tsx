import { StyledWrapper } from './styled'

export const Wrapper = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
  return <StyledWrapper onClick={onClick}>{children}</StyledWrapper>
}
