import { Container } from '../Container/Conatiner'
import { StyledHeader } from './styled'
import { IHeader } from './types'

export const Header = ({ children, ...restProps }: IHeader) => (
  <Container>
    <StyledHeader {...restProps}>{children}</StyledHeader>
  </Container>
)
