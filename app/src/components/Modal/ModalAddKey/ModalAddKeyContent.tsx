import { ListItemAvatar, ListItemText } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { Container } from '@/layout/Container/Conatiner'
import {
  StyledViewTitle,
  StyledListItem,
  StyledList,
  StyledItemButton,
  StyledItemIconAvatar,
  StyledItemText
} from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useAddKey } from '@/hooks/workspaces'

export const ModalAddKeyContent = ({ handleClose }: { handleClose: () => void}) => {
  const { handleOpen } = useOpenModalSearchParams()
  const { addKey } = useAddKey()

  const handleAddKey = async () => {
    await addKey()
    handleClose()
  }

  return (
    <Container>
      <StyledViewTitle>Existing key</StyledViewTitle>
      <StyledList dense>
        <StyledListItem disablePadding>
          <ListItemText primary="Import your existing nsec, it will be encrypted and stored securely." />
        </StyledListItem>

        <StyledListItem disablePadding>
          <StyledItemButton alignItems="center" onClick={handleAddKey}>
            <ListItemAvatar>
              <StyledItemIconAvatar>
                <AddIcon />
              </StyledItemIconAvatar>
            </ListItemAvatar>
            <StyledItemText primary="Import private key" />
          </StyledItemButton>
        </StyledListItem>
      </StyledList>

      <StyledViewTitle>Read-only account</StyledViewTitle>
      <StyledList dense>
        <StyledListItem disablePadding>
          <ListItemText primary="You can import any npub and get read-only access to the public data of a Nostr account" />
        </StyledListItem>
        <StyledListItem disablePadding>
          <StyledItemButton
            alignItems="center"
            onClick={() => handleOpen(MODAL_PARAMS_KEYS.KEY_IMPORT, { replace: true })}
          >
            <ListItemAvatar>
              <StyledItemIconAvatar>
                <AddIcon />
              </StyledItemIconAvatar>
            </ListItemAvatar>
            <StyledItemText primary="Add read-only account" />
          </StyledItemButton>
        </StyledListItem>
      </StyledList>

      <StyledViewTitle>NsecBunker key</StyledViewTitle>
      <StyledList dense>
        <StyledListItem disablePadding>
          <ListItemText primary="Events can be signed remotely by your nsecBunker" />
        </StyledListItem>
        <StyledListItem disablePadding>
          <StyledItemButton
            alignItems="center"
            onClick={() => handleOpen(MODAL_PARAMS_KEYS.ADD_NSB_KEY_MODAL, { replace: true })}
          >
            <ListItemAvatar>
              <StyledItemIconAvatar>
                <AddIcon />
              </StyledItemIconAvatar>
            </ListItemAvatar>
            <StyledItemText primary="Add nsecBunker key" />
          </StyledItemButton>
        </StyledListItem>
      </StyledList>

    </Container>
  )
}
