import { useAppSelector } from '@/store/hooks/redux'
import { AppsPageContent } from './AppsPageContent'
import { StyledWrapVisibility } from '../styled'
import { memo } from 'react'
import { selectSearchParam } from '@/store/reducers/router.slice'

export const AppsPage = memo(function AppsPage() {
  const page = useAppSelector((state) => selectSearchParam(state, 'page'))
  const isOpen = page === 'apps' || !page

  return (
    <StyledWrapVisibility isShow={isOpen}>
      <AppsPageContent />
    </StyledWrapVisibility>
  )
})
