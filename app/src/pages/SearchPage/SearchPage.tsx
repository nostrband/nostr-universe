import { useOpenModalSearchParams } from '@/hooks/modal'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { Header } from '@/components/Header/Header'
import { StyledDialog, StyledWrap } from './styled'
import { useRef } from 'react'
import { SearchPageContent } from './SearchPageContent'

export const SearchPage = () => {
  const { getModalOpened } = useOpenModalSearchParams()
  const isOpen = getModalOpened(MODAL_PARAMS_KEYS.SEARCH_PAGE)
  const enteredSearchValueRef = useRef('')

  return (
    <StyledDialog fullScreen open={isOpen}>
      <Header title="Search" />
      <StyledWrap>
        <SearchPageContent searchValueRef={enteredSearchValueRef} />
      </StyledWrap>
    </StyledDialog>
  )
}
