import { FC } from 'react'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { IAppNostro } from '@/shared/AppNostro/types'
import { Box, IconButton, styled } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'

type AppNostroRemovableProps = IAppNostro & {
  isRemoveMode: boolean
  handleRemovePin: () => void
}

export const AppNostroRemovable: FC<AppNostroRemovableProps> = ({ handleRemovePin, isRemoveMode, ...props }) => {
  return (
    <StyledContainer position={'relative'}>
      <AppNostro {...props} />
      {isRemoveMode && (
        <IconButton className="remove" size="small" onClick={handleRemovePin}>
          <RemoveIcon htmlColor="white" />
        </IconButton>
      )}
    </StyledContainer>
  )
}

const StyledContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  '& .remove': {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '24px',
    height: '24px',
    '&:is(&, :hover, :active)': {
      background: theme.palette.secondary.main
    }
  }
}))
