import { useCallback, useMemo, useState } from 'react'
import { Grid } from '@mui/material'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
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
import { StyledAppBar, StyledDialog, StyledWrap, StyledSwipeableDrawerContent } from './styled'
import { AppNostr as AppNostroType } from '@/types/app-nostr'
import { Header } from '@/components/Header/Header'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { useOpenApp } from '@/hooks/open-entity'
import { AppNostroSortable } from '@/shared/AppNostroSortable/AppNostroSortable'
import { swapTabGroupsThunk } from '@/store/reducers/workspaces.slice'
import { SortableContext, rectSwappingStrategy } from '@dnd-kit/sortable'

type TabGroupID = string | number

export const AppsPage = () => {
  const { openApp } = useOpenApp()
  const { getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.APPS_PAGE)
  const dispatch = useAppDispatch()
  const { workspaces } = useAppSelector((state) => state.workspaces)
  const { currentPubKey } = useAppSelector((state) => state.keys)
  const currentWorkSpace = workspaces.find((workspace) => workspace.pubkey === currentPubKey)
  const [activeId, setActiveId] = useState<TabGroupID | null>(null)

  const tabGroups = currentWorkSpace?.tabGroups || []
  const sortedTabGroups = useMemo(() => {
    if (tabGroups) {
      return tabGroups.slice().sort((tabA, tabB) => {
        const lastActiveA = (tabA.tabs.length > 0 && tabA.lastActive) || 0
        const lastActiveB = (tabB.tabs.length > 0 && tabB.lastActive) || 0

        // both groups are active? desc by lastActive
        if (lastActiveA != 0 && lastActiveB != 0) return lastActiveB - lastActiveA

        // active goes before inactive
        if (lastActiveA != 0) return -1
        if (lastActiveB != 0) return 1

        // inactive ones go by order asc
        return tabA.order - tabB.order
      })
    }

    return []
  }, [tabGroups])

  const tabGroupsIds = sortedTabGroups.map((tabGroup) => tabGroup.id)

  const handleOpen = async (app: AppNostroType) => {
    await openApp(app)
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
    (fromTabGroupId: TabGroupID, toTabGroupId: TabGroupID) => {
      if (currentWorkSpace) {
        dispatch(
          swapTabGroupsThunk({
            fromID: fromTabGroupId,
            toID: toTabGroupId,
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
    <StyledDialog fullScreen open={isOpen}>
      <StyledAppBar>
        <Header />
      </StyledAppBar>

      <StyledWrap>
        <StyledSwipeableDrawerContent>
          <DndContext
            sensors={sensors}
            autoScroll={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragOver}
          >
            <SortableContext items={tabGroupsIds} strategy={rectSwappingStrategy}>
              <Container>
                <Grid columns={10} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                  {sortedTabGroups.map((tab, i) => {
                    const app = {
                      picture: tab.info.icon,
                      name: tab.info.title,
                      naddr: tab.info.appNaddr,
                      url: tab.info.url,
                      order: tab.info.order
                    }

                    const isActive = Boolean(tab.tabs.length)

                    return (
                      <Grid key={i} item xs={2}>
                        <AppNostroSortable
                          isDragging={activeId === tab.id}
                          id={tab.id}
                          isActive={isActive}
                          app={app}
                          size="small"
                          onOpen={handleOpen}
                        />
                      </Grid>
                    )
                  })}
                </Grid>
              </Container>
            </SortableContext>
          </DndContext>
        </StyledSwipeableDrawerContent>
      </StyledWrap>
    </StyledDialog>
  )
}
