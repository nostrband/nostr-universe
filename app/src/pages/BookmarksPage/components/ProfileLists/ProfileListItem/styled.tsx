import { Content } from '@/shared/ContentComponents/Content/Content'
import { Wrapper } from '@/shared/ContentComponents/Wrapper/Wrapper'
import { Typography, TypographyProps, styled } from '@mui/material'

export const StyledWrapper = styled(Wrapper)({
  display: 'flex',
  flexDirection: 'column'
})

export const StyledContent = styled(Content)({
  flex: 1
})

export const StyledProfilesCount = styled((props: TypographyProps) => <Typography {...props} variant="caption" />)(
  ({ theme }) => ({
    color: theme.palette.light.light,
    fontSize: '1.2em',
    fontWeight: 'bold',
    textAlign: 'left'
  })
)
