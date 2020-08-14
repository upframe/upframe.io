export const ordNum = n => {
  if (n >= 10 && n < 20) return n + 'th'
  switch (n % 10) {
    case 1:
      return n + 'st'
    case 2:
      return n + 'nd'
    case 3:
      return n + 'rd'
    default:
      return n + 'th'
  }
}

export const isSameDay = (date, comp = new Date()) =>
  date.getFullYear() === comp.getFullYear() &&
  date.getMonth() === comp.getMonth() &&
  date.getDate() === comp.getDate()

export const isPreviousDay = (
  date,
  comp = new Date(Date.now() - 1000 * 60 ** 2 * 24)
) => date.toLocaleDateString() === comp.toLocaleDateString()
