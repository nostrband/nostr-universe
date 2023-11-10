import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, IconButton, IconButtonProps } from '@mui/material'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

export const StyledItemSelectedEventActions = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 10
}))

export const ExpandMore = styled(
  forwardRef<HTMLAnchorElement, ExpandMoreProps>(function IconButtonDisplayName(props) {
    const exclude = new Set(['expand'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <IconButton color="decorate" {...omitProps} />
  })
)(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))
