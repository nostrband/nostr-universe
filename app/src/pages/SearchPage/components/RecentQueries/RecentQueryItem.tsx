import { StyledCloseTabBtn, StyledRecentQueryWrap, StyledSearchTermValue } from '../../styled'
import CloseIcon from '@mui/icons-material/Close'
import { FC } from 'react'
import { SearchTerm } from '@/modules/types/db'

type Props = {
  onClick: () => void
  onDelete: () => void
} & SearchTerm

export const RecentQueryItem: FC<Props> = ({ onClick, value, onDelete }) => {
  return (
    <StyledRecentQueryWrap onClick={onClick}>
      <StyledCloseTabBtn
        size="small"
        edge="start"
        color="inherit"
        aria-label="close"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <CloseIcon />
      </StyledCloseTabBtn>
      <StyledSearchTermValue>{value}</StyledSearchTermValue>
    </StyledRecentQueryWrap>
  )
}
