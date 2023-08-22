import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { IconButton } from '@mui/material'
import { IIconButton } from './types'

export const StyledIconButton = styled(
  forwardRef<HTMLButtonElement, IIconButton>(function TypographyDisplayName(props, ref) {
    return <IconButton ref={ref} {...props} />
  })
)(() => ({
  padding: 0
}))
