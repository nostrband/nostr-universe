import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Box, BoxProps } from '@mui/material'

export interface IBoxStyled extends BoxProps {
  childrenWidth?: number
}

export const StyledWrapper = styled(
  forwardRef<HTMLAnchorElement, IBoxStyled>(function BoxDisplayName(props, ref) {
    const exclude = new Set(['childrenWidth'])
    const omitProps = Object.fromEntries(Object.entries(props).filter((e) => !exclude.has(e[0])))

    return <Box ref={ref} {...omitProps} />
  })
)(({ childrenWidth = null }) => ({
  display: 'flex',
  flexDirection: 'row',
  overflowX: 'scroll',
  '& > *': {
    marginRight: '8px',
    flex: childrenWidth ? `0 0 ${childrenWidth}px` : 'initial',
    '&:first-of-type': {
      marginLeft: '16px'
    }
  }
}))
