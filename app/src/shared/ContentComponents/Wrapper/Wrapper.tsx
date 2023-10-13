import { StyledWrapper } from './styled'

export const Wrapper = ({ children, onClick, ...rest }: { children: React.ReactNode; onClick?: () => void }) => {
  return (
    <StyledWrapper onClick={onClick} {...rest}>
      {children}
    </StyledWrapper>
  )
}
