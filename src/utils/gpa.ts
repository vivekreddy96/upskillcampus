const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  D: 1.0,
  F: 0.0,
}

export function marksToGrade(total: number): string {
  if (total >= 90) return 'A+'
  if (total >= 85) return 'A'
  if (total >= 80) return 'A-'
  if (total >= 75) return 'B+'
  if (total >= 70) return 'B'
  if (total >= 65) return 'B-'
  if (total >= 60) return 'C+'
  if (total >= 55) return 'C'
  if (total >= 50) return 'C-'
  if (total >= 40) return 'D'
  return 'F'
}

export function calculateGPA(
  results: { grade: string; credits: number }[]
): number {
  if (results.length === 0) return 0
  let totalPoints = 0
  let totalCredits = 0
  for (const r of results) {
    const points = GRADE_POINTS[r.grade] ?? 0
    totalPoints += points * r.credits
    totalCredits += r.credits
  }
  return totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0
}

export function calculateTotalMarks(internal: number, external: number): number {
  return Math.round(internal * 0.4 + external * 0.6)
}

export { GRADE_POINTS }
