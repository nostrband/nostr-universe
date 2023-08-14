import { Container } from '../Container/Conatiner'
import { StyledHeader } from './styled'
import { IHeader } from './types'

export const Header = ({ children }: IHeader) => (
  <Container>
    <StyledHeader>{children} </StyledHeader>
  </Container>
)
