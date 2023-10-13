import { StyledSubTitle } from './styled'

export const SubTitle = ({ children, ...rest }: { children: React.ReactNode }) => {
  return <StyledSubTitle {...rest}>{children}</StyledSubTitle>
}
