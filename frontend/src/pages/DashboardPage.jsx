import { useEffect, useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  LinearProgress,
  Chip,
  Skeleton,
  Button,
} from '@mui/material'
import { Link } from 'react-router-dom'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PageHeader from '../components/PageHeader'
import { StatCard, SimpleBarChart, MONTH_NAMES } from '../components/Chart'
import { walletApi, transactionApi, budgetApi, goalApi } from '../api'
import { fmtVND, fmtDate } from '../utils/format'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wallets, setWallets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [wRes, tRes, bRes, gRes] = await Promise.all([
        walletApi.getAll(),
        transactionApi.getAll(),
        budgetApi.getAll(),
        goalApi.getAll(),
      ])
      setWallets(wRes.data)
      setTransactions(tRes.data)
      setBudgets(bRes.data)
      setGoals(gRes.data)
    } catch {
      setError('Không tải được dữ liệu. Hãy kiểm tra kết nối tới server.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  if (loading) {
    return (
      <Stack spacing={3.5}>
        <Skeleton variant="rounded" height={42} width={280} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={130} sx={{ flex: 1, borderRadius: 4 }} />
          ))}
        </Stack>
        <Skeleton variant="rounded" height={360} sx={{ borderRadius: 4 }} />
      </Stack>
    )
  }

  if (error) {
    return (
      <Card elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          ⚠️ {error}
        </Typography>
        <Button variant="contained" onClick={loadAll} sx={{ mt: 2 }}>
          Thử lại
        </Button>
      </Card>
    )
  }

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'
  const userName =
    JSON.parse(localStorage.getItem('user') || '{}')?.name?.split(' ').slice(-1)[0] || ''

  const totalBalance = wallets.reduce((s, w) => s + Number(w.balance), 0)
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthTx = transactions.filter((t) => (t.transaction_date || '').startsWith(monthPrefix))
  const monthIncome = monthTx
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0)
  const monthExpense = monthTx
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0)

  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const prefix = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const txs = transactions.filter((t) => (t.transaction_date || '').startsWith(prefix))
    months.push({
      month: MONTH_NAMES[d.getMonth()],
      income: txs.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0),
      expense: txs.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0),
    })
  }

  const savingTotal = goals.reduce((s, g) => s + Number(g.current_amount), 0)
  const activeGoals = goals.filter((g) => g.status === 'in_progress').length
  const overBudgets = budgets.filter((b) => b.isOverBudget).length

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title={`${greeting}${userName ? ', ' + userName : ''} 👋`}
        subtitle={`Hôm nay là ${now.toLocaleDateString('vi-VN', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`}
        badge={
          overBudgets > 0 ? (
            <Chip
              size="small"
              color="error"
              icon={<WarningAmberRoundedIcon sx={{ fontSize: '15px !important' }} />}
              label={`${overBudgets} ngân sách vượt hạn`}
              sx={{ fontWeight: 700 }}
            />
          ) : null
        }
      />

      {/* 4 Cards Thống kê tài chính */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} flexWrap="wrap">
        <StatCard
          title="Tổng số dư"
          value={fmtVND(totalBalance)}
          icon={AccountBalanceWalletRoundedIcon}
          gradient="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
          sub={`${wallets.length} ví đang hoạt động`}
        />
        <StatCard
          title={`Thu nhập T${now.getMonth() + 1}`}
          value={fmtVND(monthIncome)}
          icon={TrendingUpRoundedIcon}
          gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          sub="Tổng thu trong tháng này"
        />
        <StatCard
          title={`Chi tiêu T${now.getMonth() + 1}`}
          value={fmtVND(monthExpense)}
          icon={TrendingDownRoundedIcon}
          gradient="linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)"
          sub="Tổng chi trong tháng này"
        />
        <StatCard
          title="Đang tích lũy"
          value={fmtVND(savingTotal)}
          icon={TrackChangesRoundedIcon}
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          sub={`${activeGoals} mục tiêu đang thực hiện`}
        />
      </Stack>

      {/* Biểu đồ thu chi 6 tháng */}
      <Card elevation={0} sx={{ borderRadius: 4 }}>
        <CardContent sx={{ p: 3.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Dòng tiền Thu – Chi (6 tháng gần nhất)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                So sánh tổng quan giữa nguồn thu và các khoản chi
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/transactions"
              size="small"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ fontWeight: 600 }}
            >
              Xem giao dịch
            </Button>
          </Stack>
          <SimpleBarChart data={months} />
        </CardContent>
      </Card>

      {/* 2 Cột: Ngân sách & Mục tiêu tiết kiệm */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* Ngân sách */}
        <Card elevation={0} sx={{ flex: 1, borderRadius: 4 }}>
          <CardContent sx={{ p: 3.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Kiểm soát ngân sách
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Theo dõi hạn mức chi tiêu của từng danh mục
                </Typography>
              </Box>
              <Button component={Link} to="/budgets" size="small" endIcon={<ArrowForwardRoundedIcon />}>
                Chi tiết
              </Button>
            </Stack>

            {budgets.length === 0 ? (
              <Typography variant="body2" color="text.secondary" py={3} textAlign="center">
                Chưa thiết lập ngân sách nào. Hãy đặt hạn mức để kiểm soát chi tiêu!
              </Typography>
            ) : (
              <Stack spacing={2.5}>
                {budgets.slice(0, 4).map((b) => (
                  <Box key={b.id}>
                    <Stack direction="row" justifyContent="space-between" mb={0.75} alignItems="center">
                      <Typography variant="body2" fontWeight={700}>
                        {b.Category?.name || 'Danh mục'}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={b.isOverBudget ? 'error.main' : 'text.secondary'}
                        fontWeight={700}
                      >
                        {fmtVND(b.spent)} / {fmtVND(b.limit_amount)}
                        {b.isOverBudget && ' (Vượt hạn)'}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(b.percentage, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: b.isOverBudget
                            ? 'linear-gradient(90deg, #f43f5e, #e11d48)'
                            : b.percentage > 80
                              ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                              : 'linear-gradient(90deg, #10b981, #059669)',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Mục tiêu tiết kiệm */}
        <Card elevation={0} sx={{ flex: 1, borderRadius: 4 }}>
          <CardContent sx={{ p: 3.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  Mục tiêu tích lũy
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tiến độ hoàn thành các dự định tương lai
                </Typography>
              </Box>
              <Button component={Link} to="/goals" size="small" endIcon={<ArrowForwardRoundedIcon />}>
                Chi tiết
              </Button>
            </Stack>

            {goals.length === 0 ? (
              <Typography variant="body2" color="text.secondary" py={3} textAlign="center">
                Chưa có mục tiêu tiết kiệm. Hãy đặt mục tiêu để tích lũy ngay hôm nay!
              </Typography>
            ) : (
              <Stack spacing={2.5}>
                {goals.slice(0, 4).map((g) => {
                  const pct = Math.min(
                    Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100),
                    100
                  )
                  const isDone = g.status === 'completed'

                  return (
                    <Box key={g.id}>
                      <Stack direction="row" justifyContent="space-between" mb={0.75} alignItems="center">
                        <Typography variant="body2" fontWeight={700}>
                          {isDone ? '🏆 ' : ''}
                          {g.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${pct}%`}
                          color={isDone ? 'success' : 'primary'}
                          variant={isDone ? 'filled' : 'outlined'}
                          sx={{ height: 22, fontWeight: 700, fontSize: 11 }}
                        />
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        color={isDone ? 'success' : 'primary'}
                        sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }}
                      />
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        {fmtVND(g.current_amount)} / {fmtVND(g.target_amount)}
                        {g.deadline ? ` · Hạn chót: ${fmtDate(g.deadline)}` : ''}
                      </Typography>
                    </Box>
                  )
                })}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  )
}

