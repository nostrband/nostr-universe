import { FC } from 'react'
import { IPin } from '@/types/workspace'
import { Box, Grid, Zoom } from '@mui/material'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { StyledAppIcon, StyledGroup, StyledGroupName } from './styled'

type PinsGroupProps = {
  group: IPin[]
  id: string
  title: string
}

const GROUP_DATA = { type: 'group' }

export const PinsGroup: FC<PinsGroupProps> = ({ group, id, title }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: GROUP_DATA
  })

  const { setNodeRef: setDraggableRef, listeners } = useDraggable({
    id,
    data: GROUP_DATA
  })

  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenModal = () => {
    return handleOpen(MODAL_PARAMS_KEYS.PIN_GROUP_MODAL, {
      search: {
        groupName: id
      }
    })
  }

  return (
    <Grid item xs={2} ref={setDraggableRef} onClick={handleOpenModal} {...listeners} minHeight={77}>
      <Box ref={setNodeRef}>
        <StyledGroup className={isOver ? '__over' : ''}>
          {group.map((pin) => (
            <Zoom in key={pin.id}>
              <Grid item xs={1}>
                <StyledAppIcon picture={pin.icon} alt={pin.title} isPreviewTab />
              </Grid>
            </Zoom>
          ))}
        </StyledGroup>
        <StyledGroupName>{title}</StyledGroupName>
      </Box>
    </Grid>
  )
}
