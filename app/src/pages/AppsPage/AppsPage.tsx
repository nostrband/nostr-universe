import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { StyledDialog } from './styled'
import { AppsPageContent } from './AppsPageContent'

export const AppsPage = () => {
  const { getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.APPS_PAGE)

  return (
    <StyledDialog fullScreen open={isOpen}>
      {isOpen && <AppsPageContent />}
    </StyledDialog>
  )
}
