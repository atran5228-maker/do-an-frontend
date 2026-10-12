export const fmtVND = (n) => {
  const v = Math.round(Number(n) || 0)
  const sign = v < 0 ? '-' : ''
  return sign + String(Math.abs(v)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫'
}

export const fmtDate = (d) => {
  if (!d) return '—'
  const [y, m, day] = String(d).slice(0, 10).split('-')
  return `${day}/${m}/${y}`
}

export const walletTypeLabel = {
  cash: 'Tiền mặt',
  bank: 'Ngân hàng',
  'e-wallet': 'Ví điện tử',
}