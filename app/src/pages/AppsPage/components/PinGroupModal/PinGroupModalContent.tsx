import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { IPin } from '@/types/workspace'
import { createPortal } from 'react-dom'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import { addPinWorkspace, bulkEditPinsWorkspace } from '@/store/reducers/workspaces.slice'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { PinsGroupExtraMenu } from './PinsGroupExtraMenu'
import { selectCurrentWorkspaceTabs } from '@/store/store'
import { useOpenApp } from '@/hooks/open-entity'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { AppNostr } from '@/types/app-nostr'
import { DialogContent, DialogTitle, Grid, IconButton, Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { DragOverlay } from '@dnd-kit/core'
import { StyledInput } from './styled'
import { AppNostroSortable } from '@/shared/AppNostroSortable/AppNostroSortable'
import { dbi } from '@/modules/db'
import { selectSearchParam } from '@/store/reducers/router.slice'

type PinGroupModalContentProps = {
  groupName: string
  pinsGroup?: IPin[]
  handleClose: () => void
  pins: IPin[]
  groupDefaultName: string
  activeId: string | null
}

export const PinGroupModalContent: FC<PinGroupModalContentProps> = ({
  pinsGroup = [],
  groupName = '',
  pins,
  groupDefaultName = '',
  activeId
}) => {
  const tabs = useAppSelector(selectCurrentWorkspaceTabs)

  const { currentPubkey } = useAppSelector((state) => state.keys)

  const wasGroupName = useAppSelector((state) => selectSearchParam(state, 'groupName'))
  const isNewEmptyGroup = wasGroupName === 'DEFAULT_GROUPNAME'

  const { handleOpen: handleOpenModal } = useOpenModalSearchParams()
  const { openApp } = useOpenApp()
  const dispatch = useAppDispatch()

  const [newGroupName, setGroupName] = useState(groupName)
  const [editMode, setEditMode] = useState(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChangeGroupName = () => {
    const newPins = pins.map((pin) => {
      if (pin.groupName === groupName) {
        return {
          ...pin,
          groupName: newGroupName,
          id: newGroupName
        }
      }
      return pin
    })
    dbi.deletePin(groupName)
    dispatch(bulkEditPinsWorkspace({ pins: newPins, workspacePubkey: currentPubkey }))
  }

  const groupNameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setGroupName(e.target.value)
  }

  const handleAddNewGroup = () => {
    const groupName = newGroupName.trim().length > 0 ? newGroupName : groupDefaultName
    const newEmptyGroup = {
      id: groupName,
      url: '',
      appNaddr: '',
      title: '',
      icon: '',
      order: pins.length,
      pubkey: currentPubkey,
      groupName: groupName,
      pins: null
    }

    handleOpenModal(MODAL_PARAMS_KEYS.PIN_GROUP_MODAL, {
      replace: true,
      search: {
        groupName: groupName
      }
    })

    dispatch(
      addPinWorkspace({
        workspacePubkey: currentPubkey,
        pin: newEmptyGroup
      })
    )
    dbi.addPin(newEmptyGroup)
  }

  const handleBlurInput = () => {
    if (newGroupName === groupName) return setEditMode(false)

    const isGroupNameExists = pins.some((p) => p.groupName === newGroupName)

    if (newGroupName.trim().length === 0 || isGroupNameExists) {
      setGroupName(isNewEmptyGroup ? groupDefaultName : groupName)
      return setEditMode(false)
    }

    if (isNewEmptyGroup) {
      handleAddNewGroup()
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
    if (isNewEmptyGroup) return setGroupName(groupDefaultName)

    return setGroupName(groupName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = async (app: AppNostr) => {
    await openApp(app, { replace: true })
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    handleBlurInput()
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleRenameClick = () => {
    inputRef.current?.focus()
    setEditMode(true)
  }

  useEffect(() => {
    if (isNewEmptyGroup) {
      handleRenameClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderContent = () => {
    if (pinsGroup.length === 0) {
      return <Typography textAlign={'center'}>Folder empty. Close it and drag apps into the folder.</Typography>
    }
    return (
      <Grid columns={4} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} marginTop={0}>
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
              <AppNostroSortable
                id={pin.id}
                isActive={isActive}
                app={app}
                size="small"
                onOpen={() => handleOpen(app)}
              />
            </Grid>
          )
        })}
      </Grid>
    )
  }

  const renderPinOverlay = () => {
    if (!activeId) return null

    const activePin = pins.find((p) => p.id === activeId)
    if (!activePin) return null

    const app: AppNostr = {
      picture: activePin.icon,
      name: activePin.title,
      naddr: activePin.appNaddr,
      url: activePin.url,
      order: activePin.order
    }

    return createPortal(
      <DragOverlay zIndex={1500} modifiers={[restrictToWindowEdges]}>
        {<AppNostro app={app} hideName size="small" onOpen={() => undefined} />}
      </DragOverlay>,
      document.body
    )
  }

  return (
    <>
      <DialogTitle>
        <Stack flexDirection={'row'}>
          <StyledInput
            readOnly={!editMode}
            value={newGroupName}
            onChange={groupNameChangeHandler}
            onBlur={handleBlurInput}
            inputRef={inputRef}
          />

          <IconButton color="inherit" size="medium" type="button" onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        {renderContent()}
        {renderPinOverlay()}
      </DialogContent>

      <PinsGroupExtraMenu
        open={isMenuOpen}
        handleClose={handleCloseMenu}
        anchorEl={anchorEl}
        onRenameClick={handleRenameClick}
      />
    </>
  )
}
