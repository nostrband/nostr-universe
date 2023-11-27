import { FC } from 'react'
import { IPin } from '@/types/workspace'
import { Grid, Zoom } from '@mui/material'
import { useDroppable } from '@dnd-kit/core'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { StyledAppIcon, StyledGroup, StyledGroupName } from './styled'

type PinsGroupProps = {
  group: IPin[]
  id: string
  title: string
  isSwapMode: boolean
}

const GROUP_DATA = { type: 'group' }

export const PinsGroup: FC<PinsGroupProps> = ({ group, id, title, isSwapMode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: GROUP_DATA
  })

  const { handleOpen } = useOpenModalSearchParams()

  const handleOpenModal = () => {
    if (isSwapMode) return null

    return handleOpen(MODAL_PARAMS_KEYS.PIN_GROUP_MODAL, {
      search: {
        groupName: id
      }
    })
  }

  return (
    <Grid item xs={2} ref={setNodeRef} onClick={handleOpenModal} minHeight={77}>
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
    </Grid>
  )
}
