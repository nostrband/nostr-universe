import { StyledKindView } from './styled'

export const KindView = ({ children, ...rest }: { children: React.ReactNode }) => {
  return <StyledKindView {...rest}>Kind: {children}</StyledKindView>
}
