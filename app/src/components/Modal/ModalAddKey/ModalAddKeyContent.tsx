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
import { useOpenApp } from '@/hooks/open-entity'

export const ModalAddKeyContent = () => {
  const { handleOpen } = useOpenModalSearchParams()
  const { onImportKey } = useOpenApp()

  return (
    <Container>
      <StyledViewTitle>Existing key</StyledViewTitle>
      <StyledList dense>
        <StyledListItem disablePadding>
          <ListItemText primary="Import your existing nsec, it will be encrypted and stored securely." />
        </StyledListItem>

        <StyledListItem disablePadding>
          <StyledItemButton alignItems="center" onClick={() => onImportKey()}>
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
            onClick={() => handleOpen(MODAL_PARAMS_KEYS.KEY_IMPORT, { append: true })}
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
    </Container>
  )
}
