import { StyledContainer } from './styled'
import { IContainer } from './types'

export const Container = ({ children, ...props }: IContainer) => (
  <StyledContainer {...props}>{children}</StyledContainer>
)
