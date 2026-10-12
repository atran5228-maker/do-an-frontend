import { useEffect, useState, useCallback } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Chip,
  Avatar,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Box,
  Snackbar,
  Alert,
} from '@mui/material'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded'
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded'
import PageHeader from '../components/PageHeader'
import PageCard from '../components/PageCard'
import { FormDialog, ConfirmDialog } from '../components/FormDialog'
import { adminApi } from '../api'
import { getErrorMessage } from '../api/http'
import { fmtDate } from '../utils/format'

export default function UserManagementPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  const [confirm, setConfirm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState('')
  const [resetTarget, setResetTarget] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [snack, setSnack] = useState(null)

  const load = useCallback(async (q = '') => {
    setLoading(true)
    setError('')
    try {
      const res = await adminApi.getUsers(q)
      setUsers(res.data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const runAction = async (action, successMessage) => {
    setSaving(true)
    setActionError('')
    try {
      await action()
      setConfirm(null)
      setResetTarget(null)
      setNewPassword('')
      if (successMessage) {
        setSnack({ msg: successMessage, severity: 'success' })
      }
      await load(search)
    } catch (e) {
      const msg = getErrorMessage(e, 'Thao tác thất bại')
      if (resetTarget) setActionError(msg)
      else setConfirm((c) => (c ? { ...c, error: msg } : c))
    } finally {
      setSaving(false)
    }
  }

  const toggleLock = (u) =>
    setConfirm({
      title: u.status === 'active' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?',
      content:
        u.status === 'active'
          ? `Người dùng ${u.email} sẽ không thể đăng nhập cho đến khi được mở khóa.`
          : `Người dùng ${u.email} sẽ có thể đăng nhập và sử dụng hệ thống bình thường.`,
      confirmText: u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa',
      danger: u.status === 'active',
      action: () =>
        runAction(
          () => adminApi.setStatus(u.id, u.status === 'active' ? 'locked' : 'active'),
          u.status === 'active' ? `Đã khóa tài khoản ${u.email}` : `Đã mở khóa tài khoản ${u.email}`
        ),
    })

  const deleteUser = (u) =>
    setConfirm({
      title: 'Xóa người dùng vĩnh viễn?',
      content: `Thao tác này sẽ xóa vĩnh viễn tài khoản ${u.email} cùng dữ liệu liên kết. Không thể khôi phục sau khi xóa!`,
      confirmText: 'Xóa vĩnh viễn',
      danger: true,
      action: () =>
        runAction(() => adminApi.remove(u.id), `Đã xóa người dùng ${u.email}`),
    })

  const submitReset = () => {
    if (!newPassword || newPassword.length < 6) {
      setActionError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    runAction(
      () => adminApi.resetPassword(resetTarget.id, newPassword),
      `Đã đặt lại mật khẩu thành công cho ${resetTarget.email}`
    )
  }

  const roleChip = (u) =>
    u.role === 'admin' ? (
      <Chip
        size="small"
        color="secondary"
        icon={<ShieldRoundedIcon sx={{ fontSize: '13px !important' }} />}
        label="Quản trị"
        sx={{ fontWeight: 700 }}
      />
    ) : (
      <Chip size="small" variant="outlined" label="Người dùng" sx={{ fontWeight: 600 }} />
    )

  const statusChip = (u) =>
    u.status === 'locked' ? (
      <Chip
        size="small"
        color="error"
        icon={<BlockRoundedIcon sx={{ fontSize: '13px !important' }} />}
        label="Bị khóa"
        sx={{ fontWeight: 700 }}
      />
    ) : (
      <Chip
        size="small"
        color="success"
        icon={<CheckCircleRoundedIcon sx={{ fontSize: '13px !important' }} />}
        variant="outlined"
        label="Hoạt động"
        sx={{ fontWeight: 700 }}
      />
    )

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Quản lý tài khoản"
        subtitle={`Tổng số ${users.length} tài khoản trong hệ thống FinAdmin`}
      />

      <PageCard
        title="Danh sách tài khoản"
        subtitle="Kiểm soát trạng thái đăng nhập, phân quyền và cấp lại mật khẩu"
        loading={loading}
        error={error}
        onRetry={() => load(search)}
        isEmpty={users.length === 0}
        emptyIcon="👤"
        emptyText="Không tìm thấy người dùng nào phù hợp với từ khóa."
        action={
          <TextField
            size="small"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(search)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
        }
      >
        <TableContainer sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Tài khoản</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Lượng dữ liệu</TableCell>
                <TableCell>Ngày tham gia</TableCell>
                <TableCell align="right">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.75} alignItems="center">
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          fontWeight: 700,
                          bgcolor: u.role === 'admin' ? 'secondary.main' : 'primary.main',
                        }}
                      >
                        {(u.username || 'U').charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {u.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block">
                          {u.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{roleChip(u)}</TableCell>
                  <TableCell>{statusChip(u)}</TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {u.txCount} giao dịch
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {fmtDate(u.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      {u.role !== 'admin' && (
                        <>
                          <Tooltip title={u.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}>
                            <IconButton
                              size="small"
                              color={u.status === 'active' ? 'warning' : 'success'}
                              onClick={() => toggleLock(u)}
                            >
                              {u.status === 'active' ? (
                                <BlockRoundedIcon fontSize="small" />
                              ) : (
                                <LockOpenRoundedIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Đặt lại mật khẩu">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setResetTarget(u)
                                setNewPassword('')
                                setActionError('')
                              }}
                            >
                              <VpnKeyRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa người dùng">
                            <IconButton size="small" color="error" onClick={() => deleteUser(u)}>
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                      {u.role === 'admin' && (
                        <Typography variant="caption" color="text.disabled" sx={{ px: 1, fontWeight: 600 }}>
                          Quản trị viên
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </PageCard>

      {/* Xác nhận hành động */}
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        content={confirm?.content}
        saving={saving}
        error={confirm?.error}
        confirmLabel={confirm?.confirmText || 'Xác nhận'}
        danger={confirm?.danger}
        onClose={() => setConfirm(null)}
        onConfirm={confirm?.action}
      />

      {/* Đặt lại mật khẩu */}
      <FormDialog
        open={!!resetTarget}
        title={`Đặt lại mật khẩu: ${resetTarget?.email || ''}`}
        onClose={() => setResetTarget(null)}
        onSubmit={submitReset}
        saving={saving}
        error={actionError}
        submitLabel="Cập nhật mật khẩu"
      >
        <Typography variant="body2" color="text.secondary">
          Nhập mật khẩu mới cho tài khoản <strong>{resetTarget?.username}</strong> ({resetTarget?.email}):
        </Typography>
        <TextField
          fullWidth
          type="text"
          label="Mật khẩu mới"
          placeholder="Tối thiểu 6 ký tự"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoFocus
        />
      </FormDialog>

      {/* Feedback Toast */}
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnack(null)} severity={snack?.severity || 'info'} sx={{ borderRadius: 2.5 }}>
          {snack?.msg}
        </Alert>
      </Snackbar>
    </Stack>
  )
}

