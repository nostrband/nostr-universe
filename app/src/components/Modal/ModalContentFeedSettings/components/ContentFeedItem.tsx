import { FC } from 'react'
import { ListItemText } from '@mui/material'
import { StyledListItem, SwitchControl } from '../styled'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined'

type ContentFeedItemProps = {
  title: string
  checked: boolean
  id: string
  onSwitchFeedVisibility: () => void
}

export const ContentFeedItem: FC<ContentFeedItemProps> = ({ title, checked, id, onSwitchFeedVisibility }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <StyledListItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ListItemText>{title}</ListItemText>
      <SwitchControl checked={checked} onChange={onSwitchFeedVisibility} />
      {/* <StyledListItemButton>
            <DragIndicatorOutlinedIcon color="inherit" />
         </StyledListItemButton> */}
    </StyledListItem>
  )
}
