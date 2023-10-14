import { Content } from '@/shared/ContentComponents/Content/Content'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { styled } from '@mui/material'

export const StyledWrapper = styled(Wrapper)({
  display: 'flex',
  flexDirection: 'column'
})

export const StyledContent = styled(Content)({
  flex: 1
})
