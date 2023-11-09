import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import { Avatar, AvatarProps, Typography, TypographyProps, Box, ListItemText } from '@mui/material'

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
  marginTop: '3em',
  marginBottom: '3em',
  gap: 5
}))

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const StyledItemIconAvatar = styled(({ danger, ...props }: AvatarProps & { danger?: boolean }) => (
  <Avatar {...props} />
))(({ theme, danger }) => ({
  background: danger ? '#a91b0d' : theme.palette.secondary.dark,
  color: theme.palette.light.light
}))

export const StyledMenuWrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.secondary.main,
  overflow: 'hidden',
  marginTop: '1rem'
}))

export const StyledItemText = styled(ListItemText)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold',
  flex: 'none'
}))