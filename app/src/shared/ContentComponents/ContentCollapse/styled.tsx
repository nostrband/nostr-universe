import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps } from '@mui/material'

export interface IContentStyled extends TypographyProps {
  isHighlight?: boolean
}

export const StyledContent = styled(
  forwardRef<HTMLAnchorElement, IContentStyled>(function TypographyDisplayName(props) {
    const exclude = new Set(['isHighlight'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Typography variant="caption" component="div" {...omitProps} />
  })
)(({ theme, isHighlight = false }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  fontStyle: isHighlight ? 'italic' : 'normal',
  wordWrap: 'break-word'
}))
