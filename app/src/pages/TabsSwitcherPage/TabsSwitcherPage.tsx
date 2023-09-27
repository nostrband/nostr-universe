import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledDialog } from './styled'
import { TabsSwitcherPageContent } from './TabsSwitcherPageContent'

export const TabsSwitcherPage = () => {
  const { getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.TABS_SWITCHER_PAGE)

  return (
    <StyledDialog fullScreen open={isOpen}>
      {isOpen && <TabsSwitcherPageContent />}
    </StyledDialog>
  )
}
