import { StyledContent } from './styled'
import { Collapse } from '@mui/material'

export const ContentCollapse = ({
  text,
  open,
  isHighlight,
  maxContentLength = 150,
  ...rest
}: {
  isHighlight?: boolean
  open: boolean
  text: string
  maxContentLength?: number
}) => {
  const getContent = () => {
    let firstPart = ''
    let lastPart = ''

    if (text) {
      const lastSpace = text.slice(0, maxContentLength).lastIndexOf(' ')

      firstPart = text.slice(0, lastSpace)

      lastPart = text.slice(firstPart.length)
    }

    return { firstPart, lastPart }
  }

  const { firstPart, lastPart } = getContent()

  return (
    <StyledContent isHighlight={isHighlight} {...rest}>
      {text.length <= maxContentLength ? (
        text
      ) : (
        <>
          {open ? firstPart : `${firstPart}...`}
          <Collapse in={open} timeout="auto" unmountOnExit>
            {lastPart}
          </Collapse>
        </>
      )}
    </StyledContent>
  )
}
