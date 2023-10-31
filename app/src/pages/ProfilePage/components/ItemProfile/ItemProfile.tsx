import { useProfileImageSource } from '@/hooks/profile-image'
import { IAccount } from '../ModalAccounts/types'
import { FC } from 'react'
import { StyledProfileAvatar } from './styled'

type ItemProfileProps = IAccount & {
  onChangeAccount: () => void
}

export const ItemProfile: FC<ItemProfileProps> = ({ onChangeAccount, ...props }) => {
  const { pubkey, profile } = props

  const { url, viewRef } = useProfileImageSource({
    pubkey: pubkey,
    originalImage: profile?.picture
  })

  return <StyledProfileAvatar onClick={onChangeAccount} src={url} ref={viewRef} imgProps={{ loading: 'lazy' }} />
}
