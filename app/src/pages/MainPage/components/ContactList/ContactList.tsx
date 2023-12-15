import { Container } from '@/layout/Container/Conatiner'
import { useOpenModalSearchParams } from '@/hooks/modal'
import { useAppSelector } from '@/store/hooks/redux'
import { StyledTitle, StyledWrapper } from './styled'
import { memo, useCallback, FC, CSSProperties } from 'react'
import { Profile } from '@/shared/Profile/Profile'
import {
  HorizontalSwipeVirtualContent,
  HorizontalSwipeVirtualItem
} from '@/shared/HorizontalSwipeVirtualContent/HorizontalSwipeVirtualContent'
import { HorizontalSwipeContent } from '@/shared/HorizontalSwipeContent/HorizontalSwipeContent'
import { EmptyListMessage } from '@/shared/EmptyListMessage/EmptyListMessage'
import { SkeletonContactList } from '@/components/Skeleton/SkeletonContactList/SkeletonContactList'
import { selectContactList } from '@/store/reducers/contentWorkspace'
import { MetaEvent } from '@/types/meta-event'
import { MODAL_PARAMS_KEYS } from '@/types/modal'
import { IconButton } from '@mui/material'
import OpenInFullOutlinedIcon from '@mui/icons-material/OpenInFullOutlined'
import { useFeeds } from '@/hooks/feeds'

export const ContactList = memo(function ContactList() {
  const { handleOpenContextMenu, handleOpen } = useOpenModalSearchParams()
  const contactList = useAppSelector(selectContactList)
  const { reloadContactList } = useFeeds()

  const handleOpenProfile = useCallback(
    (event: MetaEvent) => {
      handleOpenContextMenu({ event })
    },
    [handleOpenContextMenu]
  )

  const handleOpenFeedModal = () => {
    handleOpen(MODAL_PARAMS_KEYS.FEED_MODAL, {
      search: {
        keyData: 'contactList'
      }
    })
  }

  const renderContent = useCallback(() => {
    if (contactList === null) {
      return (
        <HorizontalSwipeContent childrenWidth={115}>
          <SkeletonContactList />
        </HorizontalSwipeContent>
      )
    }
    if (!contactList || !contactList?.contactEvents.length) {
      return <EmptyListMessage onReload={reloadContactList} />
    }

    const RowContact: FC<{ index: number; style: CSSProperties }> = ({ index, style }) => {
      const profile = contactList.contactEvents[index]

      return (
        <HorizontalSwipeVirtualItem style={style} index={index} itemCount={contactList.contactEvents.length}>
          <Profile isContact onClick={handleOpenProfile} profile={profile} />
        </HorizontalSwipeVirtualItem>
      )
    }

    return (
      <HorizontalSwipeVirtualContent
        itemHeight={114}
        itemSize={115}
        itemCount={contactList?.contactEvents.length}
        RowComponent={RowContact}
      />
    )
  }, [contactList, reloadContactList, handleOpenProfile])

  const isVisible = Boolean(contactList && contactList.contactEvents.length)

  return (
    <StyledWrapper>
      <Container>
        <StyledTitle variant="h5" gutterBottom component="div">
          Following
          {isVisible && (
            <IconButton color="light" size="small" onClick={handleOpenFeedModal}>
              <OpenInFullOutlinedIcon fontSize="inherit" />
            </IconButton>
          )}
        </StyledTitle>
      </Container>

      {renderContent()}
    </StyledWrapper>
  )
})
