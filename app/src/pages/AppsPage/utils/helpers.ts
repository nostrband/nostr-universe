import { IPin } from '@/types/workspace'
import { Active, Over } from '@dnd-kit/core'

export const checkIsGroupType = (item: Active | Over) => {
  return item?.data?.current?.type === 'group'
}

export const checkIsGroupingMode = (active: Active, over: Over) => {
  return active?.data?.current?.type === 'item' && over?.data.current?.type === 'group'
}

const DEFAULT_GROUP_NAME = 'Folder'

export const getDefaultGroupName = (pins: IPin[] = []) => {
  const foldersCount = pins.filter((p) => p.pins?.length)?.length || 0
  const defaultName = foldersCount ? `${DEFAULT_GROUP_NAME} ${foldersCount}` : DEFAULT_GROUP_NAME

  const isNameExists = pins.some((p) => p.groupName === defaultName)
  if (!isNameExists) return defaultName

  return `${DEFAULT_GROUP_NAME} ${foldersCount + 1}`
}
