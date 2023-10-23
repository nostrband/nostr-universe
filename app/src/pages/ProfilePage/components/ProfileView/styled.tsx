import { forwardRef } from 'react'
import { styled } from '@mui/material/styles'
import {
  Box,
  Avatar,
  Typography,
  TypographyProps,
  Button,
  BoxProps,
  StackProps,
  Stack,
  IconButton,
  IconButtonProps
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const AVATAR_SIZE = 80

export const StyledViewBaner = styled((props: BoxProps & { url: string }) => <Box {...props} />)(({ theme, url }) => ({
  position: 'relative',
  height: 100,
  background: url
    ? `url(${url})`
    : 'linear-gradient(45deg, rgba(238,59,255,1) 0%, rgba(121,9,95,1) 35%, rgba(117,0,255,1) 100%)',
  borderRadius: theme.shape.borderRadius,
  backgroundSize: 'cover',
  marginBottom: '4rem'
}))

export const CurrentProfileWrapper = styled((props: BoxProps) => <Box {...props}></Box>)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 90,
  flex: 1,
  width: 'fit-content',
  position: 'absolute',
  bottom: -60,
  left: '0.5rem',
  right: 0,
  zIndex: 1
}))

export const SuggestedProfilesWrapper = styled((props: StackProps) => (
  <Stack {...props} flexDirection={'row'} gap={'0.5rem'} alignItems={'center'} />
))({ position: 'absolute', bottom: `calc(${AVATAR_SIZE / -2}px - 0.5rem)`, width: '100%' })

export const StyledAddButton = styled((props: IconButtonProps) => (
  <IconButton {...props}>
    <AddIcon color="inherit" />
  </IconButton>
))(({ theme }) => ({
  color: theme.palette.light.light,
  height: 'fit-content',
  alignSelf: 'center',
  '&:is(&, &:hover, &:active)': {
    background: theme.palette.decorate.main
  },
  marginLeft: 'auto'
}))

export const StyledViewAvatar = styled(Avatar)(({ theme }) => ({
  border: '3px solid',
  height: AVATAR_SIZE,
  width: AVATAR_SIZE,
  borderColor: theme.palette.light.light
}))

export const ProfilesList = styled((props: StackProps) => (
  <Stack {...props} flexDirection={'row'} gap={'0.5rem'} alignItems={'center'} />
))({
  flex: 2,
  overflow: 'auto',
  borderRadius: '12px',
  paddingLeft: `calc(${AVATAR_SIZE}px + 0.5rem)`
})

export const StyledViewName = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'bold',
  textAlign: 'center',
  color: theme.palette.light.light,
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: 10
}))

export const StyledViewKey = styled(
  forwardRef<HTMLAnchorElement, TypographyProps>(function TypographyDisplayName(props, ref) {
    return <Typography ref={ref} {...props} />
  })
)(({ theme }) => ({
  fontWeight: 'normal',
  textAlign: 'center',
  marginBottom: 10,
  color: theme.palette.light.light
}))

export const StyledViewAction = styled(Button)(() => ({
  textTransform: 'capitalize',
  borderRadius: 50,
  minWidth: 100,
  margin: 'auto',
  display: 'flex',
  marginBottom: 20
}))

export const StyledForm = styled('div')(() => ({
  marginBottom: 15,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
}))
