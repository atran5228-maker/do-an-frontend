import { useEffect, useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
  Chip,
  Skeleton,
  LinearProgress,
  Divider,
} from '@mui/material'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import TrackChangesRoundedIcon from '@mui/icons-material/TrackChangesRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import PageHeader from '../components/PageHeader'
import PageCard from '../components/PageCard'
import { StatCard } from '../components/Chart'
import { adminApi } from '../api'
import { getErrorMessage } from '../api/http'
import { fmtDate } from '../utils/format'

export default function SystemStatsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await adminApi.getStats()
      setStats(res.data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rounded" height={42} width={320} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={130} sx={{ flex: 1, borderRadius: 4 }} />
          ))}
        </Stack>
        <Skeleton variant="rounded" height={360} sx={{ borderRadius: 4 }} />
      </Stack>
    )
  }

  if (error || !stats) {
    return (
      <PageCard title="Thống kê hệ thống" error={error || 'Không có dữ liệu'} onRetry={load}>
        <Box />
      </PageCard>
    )
  }

  const { totals, latestUsers } = stats
  const activeUsers = Math.max(0, totals.users - totals.lockedUsers)
  const goalCompletionRate = totals.goals > 0 ? Math.round((totals.completedGoals / totals.goals) * 100) : 0

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Quản trị hệ thống"
        subtitle="Tổng quan trạng thái hoạt động, người dùng và dữ liệu hệ thống"
        badge={
          <Chip
            size="small"
            color="secondary"
            label="Admin Control Panel"
            icon={<ShieldRoundedIcon sx={{ fontSize: '16px !important' }} />}
            sx={{ fontWeight: 700 }}
          />
        }
      />

      {/* 4 Metric cards - System Operational Metrics only */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} flexWrap="wrap">
        <StatCard
          title="Tổng tài khoản"
          value={String(totals.users)}
          icon={PeopleAltRoundedIcon}
          gradient="linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
          sub={`${activeUsers} đang hoạt động · ${totals.lockedUsers} bị khóa`}
        />
        <StatCard
          title="Lượng giao dịch"
          value={totals.transactions.toLocaleString('vi-VN')}
          icon={SwapHorizRoundedIcon}
          gradient="linear-gradient(135deg, #0d9488 0%, #0f766e 100%)"
          sub={`Lưu trữ qua ${totals.wallets} ví tài chính`}
        />
        <StatCard
          title="Danh mục & Ngân sách"
          value={`${totals.categories} / ${totals.budgets}`}
          icon={CategoryRoundedIcon}
          gradient="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
          sub="Phân loại thu chi & hạn mức định kỳ"
        />
        <StatCard
          title="Mục tiêu tiết kiệm"
          value={`${totals.completedGoals} / ${totals.goals}`}
          icon={TrackChangesRoundedIcon}
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          sub={`Tỷ lệ hoàn thành đạt ${goalCompletionRate}%`}
        />
      </Stack>

      {/* Detail breakdown: System Status & Latest Registered Users */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* System Health Summary */}
        <Card elevation={0} sx={{ flex: 1, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3.5 }}>
            <Typography variant="h6" fontWeight={800} mb={1}>
              Tình trạng vận hành hệ thống
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Theo dõi tính ổn định và mức độ tương tác của các thực thể dữ liệu
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={700}>
                    Tài khoản hoạt động bình thường
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="success.main">
                    {totals.users > 0 ? Math.round((activeUsers / totals.users) * 100) : 100}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={totals.users > 0 ? (activeUsers / totals.users) * 100 : 100}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                  {activeUsers} trên tổng số {totals.users} tài khoản có quyền truy cập
                </Typography>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" fontWeight={700}>
                    Tỷ lệ mục tiêu tích lũy hoàn thành
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="warning.main">
                    {goalCompletionRate}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={goalCompletionRate}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                  {totals.completedGoals} mục tiêu đạt mốc thành công
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover', flex: 1, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} color="primary.main">
                    {totals.wallets}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Tổng số ví
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover', flex: 1, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} color="secondary.main">
                    {totals.categories}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Danh mục
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover', flex: 1, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} color="info.main">
                    {totals.budgets}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Ngân sách
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Latest Registered Users */}
        <Card elevation={0} sx={{ flex: 1.2, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 3.5 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" fontWeight={800}>
                Người dùng mới gia nhập
              </Typography>
              <Chip size="small" label={`${latestUsers?.length || 0} gần nhất`} variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Các tài khoản vừa tạo trong hệ thống
            </Typography>

            {(!latestUsers || latestUsers.length === 0) && (
              <Typography variant="body2" color="text.secondary" py={4} textAlign="center">
                Chưa có người dùng nào.
              </Typography>
            )}

            <Stack spacing={2}>
              {latestUsers?.map((u) => (
                <Stack
                  key={u.id}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: 'action.hover',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 42,
                      height: 42,
                      fontWeight: 700,
                      bgcolor: u.role === 'admin' ? 'secondary.main' : 'primary.main',
                    }}
                  >
                    {(u.username || 'U').charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.25}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {u.username}
                      </Typography>
                      {u.role === 'admin' && (
                        <Chip size="small" color="secondary" label="Admin" sx={{ height: 20, fontSize: 11 }} />
                      )}
                      {u.status === 'locked' ? (
                        <Chip
                          size="small"
                          color="error"
                          icon={<BlockRoundedIcon sx={{ fontSize: '13px !important' }} />}
                          label="Khóa"
                          sx={{ height: 20, fontSize: 11 }}
                        />
                      ) : (
                        <Chip
                          size="small"
                          color="success"
                          icon={<CheckCircleRoundedIcon sx={{ fontSize: '13px !important' }} />}
                          label="Hoạt động"
                          variant="outlined"
                          sx={{ height: 20, fontSize: 11 }}
                        />
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {u.email}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={500} whiteSpace="nowrap">
                    {fmtDate(u.createdAt)}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  )
}

