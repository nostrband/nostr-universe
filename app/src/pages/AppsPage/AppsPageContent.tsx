import { useCallback, useState } from 'react'
import { Grid } from '@mui/material'
import { Container } from '@/layout/Container/Conatiner'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  StyledSwipeableDrawerContent,
  StyledAddButtonWrapper,
  StyledIconButton
} from './styled'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { AppNostr as AppNostroType } from '@/types/app-nostr'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { useOpenApp } from '@/hooks/open-entity'
import { AppNostroSortable } from '@/shared/AppNostroSortable/AppNostroSortable'
import { swapPins } from '@/store/reducers/workspaces.slice'
import { SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'
import { getTabGroupId } from '@/modules/AppInitialisation/utils'
import { selectCurrentWorkspace, selectCurrentWorkspaceTabs } from '@/store/store'
import AddIcon from '@mui/icons-material/Add'
import { useOpenModalSearchParams } from '@/hooks/modal'

type PinID = string | number

export const AppsPageContent = () => {
  const { openApp } = useOpenApp()
  const dispatch = useAppDispatch()
  const currentWorkSpace = useAppSelector(selectCurrentWorkspace)
  const tabs = useAppSelector(selectCurrentWorkspaceTabs)

  const { handleOpen: handleOpenModal } = useOpenModalSearchParams()

  const [activeId, setActiveId] = useState<PinID | null>(null)

  const pins = currentWorkSpace?.pins || []

  const pinIds = pins.map((p) => p.id)

  const handleOpen = async (app: AppNostroType) => {
    await openApp(app, { replace: true })
  }

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating.
    // Slight distance prevents sortable logic messing with
    // interactive elements in the handler toolbar component.
    activationConstraint: {
      distance: 10
    }
  })
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 300ms, with tolerance of 5px of movement.
    activationConstraint: {
      delay: 300,
      tolerance: 5
    }
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const onSortEnd = useCallback(
    (fromPinId: PinID, toPinId: PinID) => {
      if (currentWorkSpace) {
        console.log('swap pins', fromPinId, toPinId)
        dispatch(
          swapPins({
            fromID: fromPinId,
            toID: toPinId,
            workspacePubkey: currentWorkSpace.pubkey
          })
        )
      }
    },
    [dispatch, currentWorkSpace]
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active) {
      setActiveId(active.id)
    }
  }
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      onSortEnd(active.id, over.id)
    }
    setActiveId(null)
  }

  const handleDragOver = () => setActiveId(null)

  return (
    <StyledSwipeableDrawerContent>
      <DndContext
        sensors={sensors}
        autoScroll={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragOver}
      >
        <SortableContext items={pinIds} strategy={rectSwappingStrategy}>
          <Container>
            <Grid columns={10} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              {pins.map((pin, i) => {
                const app = {
                  picture: pin.icon,
                  name: pin.title,
                  naddr: pin.appNaddr,
                  url: pin.url,
                  order: pin.order
                }

                const gid = getTabGroupId(pin)
                const isActive = !!tabs.find((t) => getTabGroupId(t) === gid)

                return (
                  <Grid key={i} item xs={2}>
                    <AppNostroSortable
                      isDragging={activeId === pin.id}
                      id={pin.id}
                      isActive={isActive}
                      app={app}
                      size="small"
                      onOpen={handleOpen}
                    />
                  </Grid>
                )
              })}
              <StyledAddButtonWrapper>
                <StyledIconButton onClick={() => handleOpenModal(MODAL_PARAMS_KEYS.FIND_APP)}>
                  <AddIcon />
                </StyledIconButton>
              </StyledAddButtonWrapper>
            </Grid>
          </Container>
        </SortableContext>
      </DndContext>
    </StyledSwipeableDrawerContent>
  )
}
