import { ChangeEvent, FC, forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import {
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  Grow,
  GrowProps,
  IconButton,
  Stack,
  Typography
} from '@mui/material'
import { IPin } from '@/types/workspace'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { AppNostr } from '@/types/app-nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { selectCurrentWorkspaceTabs } from '@/store/store'
import { StyledDialog, StyledInput } from './styled'
import { useOpenApp } from '@/hooks/open-entity'
import { bulkEditPinsWorkspace, swapPins, updatePinWorkspace } from '@/store/reducers/workspaces.slice'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { PinsGroupExtraMenu } from './PinsGroupExtraMenu'
import { AppNostroRemovable } from './AppNostroRemovable'
import { dbi } from '@/modules/db'
import { useSearchParams } from 'react-router-dom'
import { addPinWorkspace } from '@/store/reducers/workspaces.slice'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, pointerWithin } from '@dnd-kit/core'
import { useSensors } from '../utils/useSensors'
import { createPortal } from 'react-dom'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { AppNostro } from '@/shared/AppNostro/AppNostro'

const Transition = forwardRef(function Transition(props: GrowProps, ref) {
  return <Grow ref={ref} {...props} />
})

type PinGroupModalContentProps = {
  groupName: string
  pinsGroup?: IPin[]
  handleClose: () => void
  pins: IPin[]
  groupDefaultName: string
}

type PinGroupModalProps = DialogProps & PinGroupModalContentProps

type PinID = string | number

export const PinGroupModalContent: FC<PinGroupModalContentProps> = ({
  pinsGroup = [],
  groupName = '',
  pins,
  groupDefaultName = '',
  handleClose
}) => {
  const tabs = useAppSelector(selectCurrentWorkspaceTabs)

  const { currentPubkey } = useAppSelector((state) => state.keys)

  const [searchParams] = useSearchParams()
  const isNewEmptyGroup = searchParams.get('groupName') === 'DEFAULT_GROUPNAME'

  const { handleOpen: handleOpenModal } = useOpenModalSearchParams()
  const { openApp } = useOpenApp()
  const dispatch = useAppDispatch()

  const sensors = useSensors()

  const [activeId, setActiveId] = useState<string | null>(null)

  const onSortEnd = useCallback(
    (activeId: PinID, overId: PinID) => {
      if (currentPubkey) {
        dispatch(
          swapPins({
            fromID: activeId,
            toID: overId,
            workspacePubkey: currentPubkey
          })
        )
      }
    },
    [dispatch, currentPubkey]
  )

  const [newGroupName, setGroupName] = useState(groupName)
  const [editMode, setEditMode] = useState(false)
  const [removeMode, setRemoveMode] = useState(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)

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
      order: 1000,
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
  }

  const handleBlurInput = () => {
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

  const handleRemoveClick = () => {
    setRemoveMode(true)
  }

  const handleRemovePinFromGroup = (pin: IPin) => {
    const updatedPin = { ...pin, groupName: '' }
    dispatch(
      updatePinWorkspace({
        pin: updatedPin,
        workspacePubkey: currentPubkey
      })
    )
    dbi.updatePin(updatedPin)
    if (pinsGroup.length === 1) {
      handleClose()
    }
  }

  useEffect(() => {
    if (isNewEmptyGroup) {
      handleRenameClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)

    if (over && active.id !== over.id) {
      const findActivePin = pins.find((pin) => pin.id === active.id)
      const findOverPin = pins.find((pin) => pin.id === over.id)

      if (!findActivePin || !findOverPin) return undefined
      onSortEnd(findActivePin.id, findOverPin.id)
    }
  }

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
              <AppNostroRemovable
                id={pin.id}
                isActive={isActive}
                app={app}
                size="small"
                onOpen={() => !removeMode && handleOpen(app)}
                isRemoveMode={removeMode}
                handleRemovePin={() => handleRemovePinFromGroup(pin)}
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
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={() => setActiveId(null)}
          collisionDetection={pointerWithin}
        >
          {renderContent()}
          {renderPinOverlay()}
        </DndContext>
      </DialogContent>

      <PinsGroupExtraMenu
        open={isMenuOpen}
        handleClose={handleCloseMenu}
        anchorEl={anchorEl}
        onRenameClick={handleRenameClick}
        onRemoveClick={handleRemoveClick}
      />
    </>
  )
}

export const PinGroupModal: FC<PinGroupModalProps> = ({ open, handleClose, ...rest }) => {
  return (
    <StyledDialog open={open} TransitionComponent={Transition} onClose={() => handleClose()}>
      {open && <PinGroupModalContent {...rest} handleClose={handleClose} />}
    </StyledDialog>
  )
}
