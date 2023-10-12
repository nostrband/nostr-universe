import { ChangeEvent, FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Container } from '@/layout/Container/Conatiner'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks/redux'
import { selectPin } from '@/store/reducers/workspaces.slice'
import { IconButton, List, ListItem, ListItemAvatar, ListItemButton } from '@mui/material'
import { StyledForm, StyledInput, StyledItemIconAvatar, StyledItemText, StyledMenuWrapper } from './styled'
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Input } from '@/shared/Input/Input'
import { copyToClipBoard } from '@/utils/helpers/prepare-data'
import { usePins } from '@/hooks/pins'

type ModalPinSettingsContentProps = {
  handleClose: () => void
  handleSetAppTitle: (appTitle: string) => void
}

export const ModalPinSettingsContent: FC<ModalPinSettingsContentProps> = ({ handleClose, handleSetAppTitle }) => {
  const [searchParams] = useSearchParams()
  const { onDeletePinnedApp, onUpdatePinnedApp } = usePins()

  const id = searchParams.get('pinId') || ''
  const currentPin = useAppSelector((state) => selectPin(state, id))

  const { title = '', url = '' } = currentPin || {}

  const [enteredAppTitle, setEnteredAppTitle] = useState(title)
  const [editMode, setEditMode] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setEnteredAppTitle(title)
    handleSetAppTitle(title || '')
  }, [title, handleSetAppTitle])

  const editAppTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEnteredAppTitle(e.target.value)
  }

  const appTitleBlurHandler = () => {
    if (enteredAppTitle.trim().length === 0) {
      setEnteredAppTitle(title)
    }
    setEditMode(false)
  }

  const removePinHandler = () => {
    if (!currentPin) return

    const confirmText = 'Are you sure to remove pin?'
    const isConfirm = confirm(confirmText)

    if (!isConfirm) return

    onDeletePinnedApp(currentPin).then(handleClose)
    // FIXME remake via "cordova-plugin-dialogs"

    // if (!window.cordova) {
    //   const isConfirm = confirm(confirmText)
    //   if (!isConfirm) return undefined
    //   return alert('Deleted')
    // }
    // return window.navigator.notification.confirm(
    //   confirmText, // message
    //   () => {
    //     handleClose()
    //   }, // callback to invoke with index of button pressed
    //   'Delete pinned app', // title
    //   'Delete,Cancel' // buttonLabels
    // )
  }

  const saveEdittedPinHandler = () => {
    if (!currentPin) return

    const edittedPin = {
      ...currentPin,
      title: enteredAppTitle
    }
    onUpdatePinnedApp(edittedPin).then(handleClose)
  }

  const renderItem = useCallback((label: string, icon: ReactNode, handler: () => void, danger: boolean = false) => {
    return (
      <ListItem disablePadding>
        <ListItemButton alignItems="center" onClick={handler}>
          <ListItemAvatar>
            <StyledItemIconAvatar danger={danger}>{icon}</StyledItemIconAvatar>
          </ListItemAvatar>
          <StyledItemText primary={label} />
        </ListItemButton>
      </ListItem>
    )
  }, [])

  return (
    <Container>
      <StyledForm>
        <Input
          readOnly
          value={url}
          endAdornment={
            <IconButton color="inherit" size="medium" type="button" onClick={() => copyToClipBoard(url)}>
              <ContentCopyIcon />
            </IconButton>
          }
        />
        <StyledInput
          readOnly={!editMode}
          value={enteredAppTitle}
          onChange={editAppTitleHandler}
          onBlur={appTitleBlurHandler}
          inputRef={inputRef}
          endAdornment={
            <IconButton
              color="inherit"
              size="medium"
              type="button"
              onClick={() => {
                setEditMode(true)
                inputRef.current?.focus()
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          }
        />
      </StyledForm>

      <StyledMenuWrapper>
        <List>
          {renderItem('Save', <DoneOutlineOutlinedIcon />, saveEdittedPinHandler)}
          {renderItem('Delete pin', <DeleteForeverOutlinedIcon />, removePinHandler, true)}
          {renderItem('Cancel', <CancelOutlinedIcon />, handleClose)}
        </List>
      </StyledMenuWrapper>
    </Container>
  )
}
