import { SubTitle } from '@/shared/ContentComponents/SubTitle/SubTitle'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Avatar, styled } from '@mui/material'

export const StyledProfileAvatar = styled(Avatar)(() => ({
  height: 40,
  width: 40,
  margin: '0 auto'
}))

export const StyledName = styled(SubTitle)(({ theme }) => ({
  color: theme.palette.light.light,
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: '12px'
}))

export const StyledWrapper = styled(Wrapper)({
  minWidth: '6rem',
  height: 'fit-content'
})
