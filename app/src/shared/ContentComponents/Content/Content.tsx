import { StyledContent } from './styled'

export const Content = ({
  children,
  isHighlight,
  contentLine
}: {
  isHighlight?: boolean
  children: React.ReactNode
  contentLine?: number
}) => {
  return (
    <StyledContent contentLine={contentLine} isHighlight={isHighlight}>
      {children}
    </StyledContent>
  )
}
