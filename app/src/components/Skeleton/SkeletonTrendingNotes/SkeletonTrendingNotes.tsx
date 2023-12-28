import { generateSkeletonItems } from '@/utils/helpers/prepare-data'
import { SkeletonNote } from '../SkeletonNote'

export const SkeletonTrendingNotes = () => {
  const mockTrendingNotes = generateSkeletonItems({})
  return mockTrendingNotes.map((_, index) => {
    return <SkeletonNote key={`slide_${index}`} />
  })
}
