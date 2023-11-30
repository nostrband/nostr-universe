import { FC } from 'react'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { IAppNostro } from '@/shared/AppNostro/types'
import { Box, IconButton, styled } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import { useDraggable, useDroppable } from '@dnd-kit/core'

type AppNostroRemovableProps = IAppNostro & {
  isRemoveMode: boolean
  handleRemovePin: () => void
  id: string
}

export const AppNostroRemovable: FC<AppNostroRemovableProps> = ({ handleRemovePin, isRemoveMode, id, ...props }) => {
  const {
    setNodeRef: setDroppableNodeRef,
    isOver,
    ...rest
  } = useDroppable({
    id
  })

  const { setNodeRef, listeners, isDragging, attributes } = useDraggable({
    id
  })

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transition: 'opacity 0.1s'
  }

  const appContainerProps = {
    sx: {
      scale: isOver && rest.active?.id !== rest.over?.id ? '1.05' : '1'
    }
  }

  return (
    <StyledContainer position={'relative'} ref={setDroppableNodeRef}>
      <Box {...attributes} ref={setNodeRef} style={style} {...listeners}>
        <AppNostro {...props} containerProps={appContainerProps} />
        {isRemoveMode && (
          <IconButton className="remove" size="small" onClick={handleRemovePin}>
            <RemoveIcon htmlColor="white" />
          </IconButton>
        )}
      </Box>
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
