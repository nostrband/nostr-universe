import { Over } from '@dnd-kit/core'
import { GroupedPin } from './usePinDragAndDrop'

export const checkIsGroupType = (over: Over | null) => {
  return over?.data?.current?.type === 'group'
}

const DEFAULT_GROUP_NAME = 'Folder'

export const getDefaultGroupName = (pins: GroupedPin[] = []) => {
  const foldersCount = pins.filter((p) => p.pins?.length).length
  const defaultName = foldersCount ? `${DEFAULT_GROUP_NAME} ${foldersCount}` : DEFAULT_GROUP_NAME

  const isNameExists = pins.some((p) => p.groupName === defaultName)
  if (!isNameExists) return defaultName

  return `${DEFAULT_GROUP_NAME} ${foldersCount + 1}`
}
