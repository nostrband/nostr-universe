import { List, ListItemButton, ListItemAvatar, Avatar, ListItem, ListItemText } from '@mui/material'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import { StyledViewModal } from './styled'
import { IModalAccounts } from './types'
import { getProfileImage, getProfileName } from '@/utils/helpers/prepare-data'
import { checkIsCurrentUser } from '@/utils/helpers/general'

export const ModalAccounts = ({ handleClose, open, accounts, currentPubKey }: IModalAccounts) => {
  return (
    <StyledViewModal onClose={handleClose} open={open} fullWidth maxWidth="lg">
      <List>
        {accounts.map((account, i) => (
          <ListItem
            key={i}
            secondaryAction={
              checkIsCurrentUser(currentPubKey, account) ? <CheckCircleOutlinedIcon htmlColor="#48ff91" /> : ''
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar src={getProfileImage(account)}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={getProfileName(account)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </StyledViewModal>
  )
}
