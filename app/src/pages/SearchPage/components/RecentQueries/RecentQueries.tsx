import { StyledTitle, StyledWrapper } from '../../styled'
import { Container } from '@/layout/Container/Conatiner'
import { SearchTerm } from '@/modules/types/db'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { FC, useCallback } from 'react'
import { RecentQueryItem } from './RecentQueryItem'

type Props = {
  queries: SearchTerm[]
  isLoading: boolean
  onDeleteSearchTerm: (id: string) => void
  onClickSearchTerm: (id: SearchTerm) => void
}

export const RecentQueries: FC<Props> = ({ queries, isLoading = false, onDeleteSearchTerm, onClickSearchTerm }) => {
  const renderContent = useCallback(() => {
    if (!queries || !queries.length || isLoading) {
      return null
    }
    return queries.map((query) => (
      <RecentQueryItem
        key={query.id}
        onDelete={() => onDeleteSearchTerm(query.id)}
        onClick={() => onClickSearchTerm(query)}
        {...query}
      />
    ))
  }, [queries, isLoading, onDeleteSearchTerm, onClickSearchTerm])

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Recent queries
        </StyledTitle>
      </Container>

      <HorizontalSwipeContent childrenWidth={115}>{renderContent()}</HorizontalSwipeContent>
    </StyledWrapper>
  )
}
