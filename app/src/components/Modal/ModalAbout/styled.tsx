import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps, Box } from '@mui/material'

export const StyledViewTitle = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography component="div" ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.light.light
}))

export const StyledWrap = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  height: 'calc(100vh - 60px)',
  gap: 5
}))

export const StyledLogs = styled('textarea')(() => ({
  display: 'flex',
  height: '200px',
  overflow: 'scroll',
  width: '100%',
  padding: '10px',
  border: '1px solid #666',
  borderRadius: '10px',
  backgroundColor: '#ddd'
}))
