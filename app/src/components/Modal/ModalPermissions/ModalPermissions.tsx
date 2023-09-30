import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Modal } from '@/modules/Modal/Modal'
import { useAppSelector } from '@/store/hooks/redux'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { useOpenApp } from '@/hooks/open-entity'
import { selectCurrentWorkspace } from '@/store/store'

export const ModalPermissions = () => {
  const { deletePermission } = useOpenApp()
  const { handleClose, getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PERMISSIONS_MODAL)
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const { apps: appsList } = useAppSelector((state) => state.apps)

  const apps = [...new Set(currentWorkSpace?.perms.map((p) => p.app))].map((id) => {
    const app = appsList.find((app) => app.naddr === id)

    let title = app?.name || id
    try {
      const U = new URL(id)
      title = U.hostname.startsWith('www.') ? U.hostname.substring(4) : U.hostname
    } catch {}

    return {
      id,
      title,
      icon: app?.picture,
      naddr: app?.naddr,
      perms: currentWorkSpace?.perms.filter((p) => p.app === id)
    }
  })

  const handleCloseModal = () => {
    handleClose()
  }

  const handleDelete = (id: string) => {
    deletePermission(id)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.plugins.toast.showShortBottom(`Permission deleted`)
  }

  return (
    <Modal title="App permissions" open={isOpen} handleClose={handleCloseModal}>
      <Container>
        {!currentWorkSpace?.perms.length ? (
          'No permissions given yet.'
        ) : (
          <List dense>
            {apps.map((app) => (
              <ListItem
                key={app.id}
                secondaryAction={
                  <IconButton color="secondary" edge="end" aria-label="delete" onClick={() => handleDelete(app.id)}>
                    <CloseOutlinedIcon htmlColor="#fff" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar src={app.icon}>
                    <ImageOutlinedIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  secondaryTypographyProps={{ color: '#fff' }}
                  primaryTypographyProps={{ color: '#fff' }}
                  primary={app.title}
                  secondary={`${app.perms?.length} permissions`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Modal>
  )
}
