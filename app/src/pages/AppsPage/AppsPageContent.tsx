import React, { useMemo, useState } from 'react'
import { Grid } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core'
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
import { PinGroupModal } from './components/PinGroupModal/PinGroupModal'
import { useSensors } from './utils/useSensors'
import { usePinDragAndDrop } from './utils/usePinDragAndDrop'
import { AppNostro } from '@/shared/AppNostro/AppNostro'
import MoreIcon from '@mui/icons-material/MoreHoriz'
import { ExtraMenu } from './components/ExtraMenu'
import { AppOfDayWidget } from '@/components/AppOfDayWidget/AppOfDayWidget'
import { getDefaultGroupName } from './utils/helpers'
import { getSlug } from '@/utils/helpers/general.ts'

export const AppsPageContent = () => {
  const { openApp } = useOpenApp()
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const { isShowAOTDWidget } = useAppSelector((state) => state.notifications)
  const tabs = useAppSelector(selectCurrentWorkspaceTabs)

  const sensors = useSensors()

  const { handleClose } = useOpenModalSearchParams()

  const { isOpen, slug } = useAppSelector((state) => getSlug(state.router.slugs, MODAL_PARAMS_KEYS.PIN_GROUP_MODAL))

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
    handleDragCancel,
    pinsGroup,
    currentGroupName,
    pinOverlay,
    groupedPins,
    overlay
  } = usePinDragAndDrop(pins, slug)

  const handleOpen = async (app: AppNostroType) => {
    await openApp(app, { replace: false })
  }

  const renderPinOverlay = () => {
    return createPortal(
      <DragOverlay modifiers={[restrictToWindowEdges]}>
        {overlay === 'item' && pinOverlay && (
          <AppNostro app={pinOverlay} hideName size="small" onOpen={() => undefined} />
        )}

        {overlay === 'group' && <PinsGroup group={[]} id={''} title={''} />}
      </DragOverlay>,
      document.body
    )
  }

  return (
    <StyledSwipeableDrawerContent>
      {isShowAOTDWidget && <AppOfDayWidget />}
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        collisionDetection={pointerWithin}
      >
        <Container>
          <Grid columns={8} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {groupedPins.map((pin) => {
              if (pin.groupName && pin.groupName.trim().length > 0) {
                return <PinsGroup key={pin.id} group={pin.pins} id={pin.id} title={pin.id} />
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
                  onOpen={() => handleOpen(app)}
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
        groupDefaultName={getDefaultGroupName(groupedPins)}
        slug={slug}
      />

      <ExtraMenu open={isExtraMenuOpen} anchorEl={anchorEl} handleClose={handleMenuClose} />
    </StyledSwipeableDrawerContent>
  )
}
