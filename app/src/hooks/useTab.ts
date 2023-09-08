import { browser } from '@/modules/browser'
import { useAppDispatch, useAppSelector } from '@/store/hooks/redux'
import { setOpenTab } from '@/store/reducers/tab.slice'

export const useTab = () => {
  const { openedTabs } = useAppSelector((state) => state.tab)
  const { currentWorkSpace } = useAppSelector((state) => state.workspaces)
  const dispatch = useAppDispatch()

  const open = async (id: string) => {
    const tab = currentWorkSpace.tabs.find((tab) => id === tab.id)

    if (tab) {
      const isOpened = openedTabs.find((openedTab) => tab.id === openedTab.id)

      if (!isOpened) {
        console.log('create ', tab)
        dispatch(setOpenTab({ tab }))
        await browser.open(tab)
        return
      } else {
        console.log('open', tab)
        await browser.show(id)
      }
    }
  }

  return {
    open
  }
}
