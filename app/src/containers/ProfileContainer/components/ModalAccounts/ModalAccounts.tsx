import { List, ListItemButton, ListItemAvatar, Avatar, ListItem } from '@mui/material'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import AddIcon from '@mui/icons-material/Add'
import { getProfileImage, getProfileName } from '@/utils/helpers/prepare-data'
import { checkIsCurrentUser } from '@/utils/helpers/general'
import { StyledItemButton, StyledItemIconAvatar, StyledItemText, StyledViewModal } from './styled'
import { IModalAccounts } from './types'
import { useAddKey } from '@/hooks/workspaces'
import { useAppSelector } from '@/store/hooks/redux'

export const ModalAccounts = ({ handleClose, changeAccount, open, accounts, currentPubKey }: IModalAccounts) => {
  const { addKey } = useAddKey()
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)

  console.log({ currentWorkSpace })

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
            <ListItemButton onClick={() => changeAccount(account.pubkey)}>
              <ListItemAvatar>
                <Avatar src={getProfileImage(account)}></Avatar>
              </ListItemAvatar>
              <StyledItemText primary={getProfileName(account)} />
            </ListItemButton>
          </ListItem>
        ))}

        <ListItem disablePadding>
          <StyledItemButton alignItems="center" onClick={addKey}>
            <ListItemAvatar>
              <StyledItemIconAvatar>
                <AddIcon />
              </StyledItemIconAvatar>
            </ListItemAvatar>
            <StyledItemText primary={'Add key'} />
          </StyledItemButton>
        </ListItem>
      </List>
    </StyledViewModal>
  )
}
