import { StyledContent } from './styled'

export const Content = ({
  children,
  isHighlight,
  isEllipsis,
  contentLine,
  ...rest
}: {
  isHighlight?: boolean
  isEllipsis?: boolean
  children: React.ReactNode
  contentLine?: number
}) => {
  return (
    <StyledContent contentLine={contentLine} isHighlight={isHighlight} isEllipsis={isEllipsis} {...rest}>
      {children}
    </StyledContent>
  )
}
