import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps } from '@mui/material'

export interface IContentStyled extends TypographyProps {
  isHighlight?: boolean
  contentLine?: number
}

export const StyledContent = styled(
  forwardRef<HTMLAnchorElement, IContentStyled>(function TypographyDisplayName(props) {
    const exclude = new Set(['isHighlight', 'contentLine'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Typography variant="caption" component="div" {...omitProps} />
  })
)(({ theme, isHighlight = false, contentLine = 3 }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: contentLine,
  WebkitBoxOrient: 'vertical',
  fontStyle: isHighlight ? 'italic' : 'normal',
  wordWrap: 'break-word'
}))
