import { StyledContent } from './styled'

export const Content = ({
  children,
  isHighlight,
  contentLine,
  ...rest
}: {
  isHighlight?: boolean
  children: React.ReactNode
  contentLine?: number
}) => {
  return (
    <StyledContent contentLine={contentLine} isHighlight={isHighlight} {...rest}>
      {children}
    </StyledContent>
  )
}
