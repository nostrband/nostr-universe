import { Avatar, Box, Slider, Typography, styled } from '@mui/material'
import { purple } from '@mui/material/colors'

export const StyledProfile = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '0.5rem 1rem 0 1rem',
  width: '100%',
  overflow: 'hidden',
  background: theme.palette.secondary.main,
  borderRadius: theme.shape.borderRadius,
  gap: '0rem',
  boxSizing: 'border-box'
}))

export const StyledProfileAvatar = styled(Avatar)(() => ({
  height: 50,
  width: 50
}))

export const StyledProfileName = styled(Typography)(({ theme }) => ({
  color: theme.palette.light.contrastText,
  fontWeight: 'bold',
  textWrap: 'nowrap',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginBottom: '2px'
}))

export const StyledScore = styled(Typography)(({ theme }) => ({
  color: theme.palette.light.contrastText,
  fontWeight: 'bold',
  textWrap: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '1.25rem'
}))

export const StyledSlider = styled(Slider)({
  color: purple[500],
  height: 8,
  margin: '0 0.5rem',
  flex: 1,
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit'
    },
    '&:before': {
      display: 'none'
    }
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    },
    '& > *': {
      transform: 'rotate(45deg)'
    }
  }
})
