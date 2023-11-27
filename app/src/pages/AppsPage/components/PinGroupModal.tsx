import { ChangeEvent, FC, forwardRef, useEffect, useRef, useState } from 'react'
import { DialogContent, DialogProps, DialogTitle, Grid, Grow, GrowProps, IconButton } from '@mui/material'
import { IPin } from '@/types/workspace'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { AppNostr } from '@/types/app-nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { selectCurrentWorkspace, selectCurrentWorkspaceTabs } from '@/store/store'
import { StyledDialog, StyledInput } from './styled'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { useOpenApp } from '@/hooks/open-entity'
import { bulkEditPinsWorkspace } from '@/store/reducers/workspaces.slice'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'

const Transition = forwardRef(function Transition(props: GrowProps, ref) {
  return <Grow ref={ref} {...props} />
})

type PinGroupModalProps = DialogProps & {
  groupName: string
  pinsGroup: IPin[]
  handleClose: () => void
  pins: IPin[]
}

export const PinGroupModal: FC<PinGroupModalProps> = ({ open, handleClose, pinsGroup = [], groupName = '', pins }) => {
  const tabs = useAppSelector(selectCurrentWorkspaceTabs)
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const { handleOpen: handleOpenModal } = useOpenModalSearchParams()
  const { openApp } = useOpenApp()
  const dispatch = useAppDispatch()

  const [newGroupName, setGroupName] = useState(groupName)
  const [editMode, setEditMode] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChangeGroupName = () => {
    const newPins = pins.map((pin) => {
      if (pin.groupName === groupName) {
        return {
          ...pin,
          groupName: newGroupName
        }
      }
      return pin
    })
    dispatch(bulkEditPinsWorkspace({ pins: newPins, workspacePubkey: currentWorkSpace?.pubkey }))
  }

  const groupNameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value)
  }

  const handleBlurInput = () => {
    const isGroupNameExists = pins.some((p) => p.groupName === newGroupName)

    if (newGroupName.trim().length === 0 || isGroupNameExists) {
      setGroupName(groupName)
      return setEditMode(false)
    }

    handleChangeGroupName()
    handleOpenModal(MODAL_PARAMS_KEYS.PIN_GROUP_MODAL, {
      replace: true,
      search: {
        groupName: newGroupName
      }
    })
    return setEditMode(false)
  }

  useEffect(() => {
    setGroupName(groupName)
  }, [groupName])

  const handleOpen = async (app: AppNostr) => {
    await openApp(app, { replace: true })
  }

  const handleClickEditButton = () => {
    setEditMode(true)
    inputRef.current?.focus()
  }

  return (
    <StyledDialog open={open} TransitionComponent={Transition} onClose={() => handleClose()}>
      <DialogTitle>
        <StyledInput
          readOnly={!editMode}
          value={newGroupName}
          onChange={groupNameChangeHandler}
          onBlur={handleBlurInput}
          inputRef={inputRef}
          endAdornment={
            <IconButton color="inherit" size="medium" type="button" onClick={handleClickEditButton}>
              <EditOutlinedIcon />
            </IconButton>
          }
        />
      </DialogTitle>
      <DialogContent>
        <Grid columns={4} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {pinsGroup.map((pin) => {
            const app: AppNostr = {
              picture: pin.icon,
              name: pin.title,
              naddr: pin.appNaddr,
              url: pin.url,
              order: pin.order
            }

            const gid = getTabGroupId(pin)
            const isActive = !!tabs.find((t) => getTabGroupId(t) === gid)
            return (
              <Grid item xs={1} key={pin.id}>
                <AppNostro isActive={isActive} app={app} size="small" onOpen={() => handleOpen(app)} />
              </Grid>
            )
          })}
        </Grid>
      </DialogContent>
    </StyledDialog>
  )
}
