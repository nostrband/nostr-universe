type ScoreLabel = 'New person' | 'Acquaintance' | 'Friend' | 'Peer' | 'Partner'

export const getScoreLabel = (score: number): ScoreLabel => {
  if (score === 100) return 'Partner'
  if (score >= 75) return 'Peer'
  if (score >= 25) return 'Friend'
  if (score >= 1) return 'Acquaintance'
  return 'New person'
}

export const getFixedScore = (score: number): string => {
  return score.toFixed(0)
}
