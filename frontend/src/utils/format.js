export const fmtVND = (n) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0)

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('vi-VN') : '—')

export const walletTypeLabel = {
  cash: 'Tiền mặt',
  bank: 'Ngân hàng',
  'e-wallet': 'Ví điện tử',
}
