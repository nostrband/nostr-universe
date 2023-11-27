import React, { useMemo, useState } from 'react'
import { Badge, Fade, Grid, IconButton, Stack, Typography } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { DndContext, DragOverlay, defaultDropAnimation, rectIntersection } from '@dnd-kit/core'
import { StyledSwipeableDrawerContent, StyledAddButtonWrapper, StyledIconButton } from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { AppNostr, AppNostr as AppNostroType } from '@/types/app-nostr'
import { useAppSelector } from '@/store/hooks/redux'
import { useOpenApp } from '@/hooks/open-entity'
import { AppNostroSortable } from '@/shared/AppNostroSortable/AppNostroSortable'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { selectCurrentWorkspace, selectCurrentWorkspaceTabs } from '@/store/store'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { createPortal } from 'react-dom'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { PinsGroup } from './components/PinsGroup'
import { PinGroupModal } from './components/PinGroupModal'
import { useSensors } from './utils/useSensors'
import { usePinDragAndDrop } from './utils/usePinDragAndDrop'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import MoreIcon from '@mui/icons-material/MoreHoriz'
import { ExtraMenu } from './components/ExtraMenu'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import AppsIcon from '@mui/icons-material/Apps'
import { useSearchParams } from 'react-router-dom'
import { AppOfDayWidget } from '@/components/AppOfDayWidget/AppOfDayWidget'

export const AppsPageContent = () => {
  const { openApp } = useOpenApp()
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const { isShowAOTDWidget } = useAppSelector((state) => state.notifications)
  const tabs = useAppSelector(selectCurrentWorkspaceTabs)

  const sensors = useSensors()
  const [searchParams, setSearchParams] = useSearchParams()

  const { getModalOpened, handleClose } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.PIN_GROUP_MODAL)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isExtraMenuOpen = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const pins = useMemo(() => currentWorkSpace?.pins || [], [currentWorkSpace?.pins])

  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    pinsGroup,
    currentGroupName,
    pinOverlay,
    groupedPins,
    isOverlayActive,
    isSwapMode
  } = usePinDragAndDrop(pins)

  const handleOpen = async (app: AppNostroType) => {
    await openApp(app, { replace: false })
  }

  const renderPinOverlay = () => {
    if (!pinOverlay) return null

    const styles = {
      transform: isOverlayActive && !isSwapMode ? 'scale(0.7)' : 'scale(1)',
      transition: 'transform 0.2s linear'
    }

    const badgeContent = isSwapMode ? <SwapHorizIcon fontSize="small" /> : <AppsIcon fontSize="small" />

    return createPortal(
      <DragOverlay dropAnimation={defaultDropAnimation} modifiers={[restrictToWindowEdges]}>
        <Badge color="secondary" badgeContent={badgeContent}>
          <AppNostro
            containerProps={{
              sx: styles
            }}
            app={pinOverlay}
            size="small"
            onOpen={() => undefined}
          />
        </Badge>
      </DragOverlay>,
      document.body
    )
  }

  const handleOffSwapMode = () => {
    searchParams.delete('mode')
    setSearchParams(searchParams)
  }

  return (
    <StyledSwipeableDrawerContent>
      {isShowAOTDWidget && <AppOfDayWidget />}
      {isSwapMode && (
        <Fade in>
          <Stack
            padding={'0 1rem'}
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
            marginBottom={'1rem'}
          >
            <Typography variant="body1">Drag the app icons to change their order.</Typography>
            <IconButton onClick={handleOffSwapMode}>
              <DoneOutlineIcon htmlColor="white" />
            </IconButton>
          </Stack>
        </Fade>
      )}
      <DndContext
        sensors={sensors}
        autoScroll={false}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        collisionDetection={rectIntersection}
      >
        <Container>
          <Grid columns={8} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {groupedPins.map((pin) => {
              if (pin.pins && pin.pins?.length > 0) {
                return <PinsGroup key={pin.id} group={pin.pins} id={pin.id} title={pin.id} isSwapMode={isSwapMode} />
              }
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
                <AppNostroSortable
                  key={pin.id}
                  id={pin.id}
                  isActive={isActive}
                  app={app}
                  size="small"
                  onOpen={() => !isSwapMode && handleOpen(app)}
                />
              )
            })}
            <StyledAddButtonWrapper>
              <StyledIconButton onClick={handleClick}>
                <MoreIcon />
              </StyledIconButton>
            </StyledAddButtonWrapper>
          </Grid>
        </Container>

        {renderPinOverlay()}
      </DndContext>

      <PinGroupModal
        groupName={currentGroupName}
        pinsGroup={pinsGroup}
        pins={pins}
        open={isOpen}
        handleClose={() => handleClose()}
      />

      <ExtraMenu open={isExtraMenuOpen} anchorEl={anchorEl} handleClose={handleMenuClose} />
    </StyledSwipeableDrawerContent>
  )
}
