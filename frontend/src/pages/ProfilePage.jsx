import { useEffect, useState, useCallback } from 'react'
import {
  Stack,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
  Switch,
  FormControlLabel,
  Typography,
  Avatar,
  Box,
  Chip,
} from '@mui/material'
import PageHeader from '../components/PageHeader'
import PageCard from '../components/PageCard'
import { useAuth } from '../context/AuthContext'
import { useThemeMode } from '../theme/AppTheme'
import { accountApi } from '../api'
import { getErrorMessage } from '../api/http'
import { fmtDate } from '../utils/format'

const LANGUAGES = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
]
const CURRENCIES = [
  { value: 'VND', label: 'VND (đồng)' },
  { value: 'USD', label: 'USD (đô la Mỹ)' },
]

export default function ProfilePage() {
  const { updateUser } = useAuth()
  const { mode, toggleMode } = useThemeMode()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', language: 'vi', currency: 'VND' })
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')

  const [snack, setSnack] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await accountApi.getProfile()
      setProfile(res.data)
      setForm({
        username: res.data.username,
        email: res.data.email,
        language: res.data.language || 'vi',
        currency: res.data.currency || 'VND',
      })
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const saveProfile = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.username.trim() || !form.email.trim()) {
      setFormError('Tên và email không được để trống')
      return
    }
    setSaving(true)
    try {
      const res = await accountApi.updateProfile(form)
      setProfile(res.data)
      updateUser({ name: res.data.username, username: res.data.username, email: res.data.email })
      setSnack({ msg: 'Đã lưu thông tin', severity: 'success' })
    } catch (err) {
      setFormError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const changeDarkMode = () => {
    const willBeDark = mode === 'light'
    toggleMode()
    accountApi.updateProfile({ dark_mode: willBeDark }).catch(() => {})
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    if (pw.next.length < 6) {
      setPwError('Mật khẩu mới phải có ít nhất 6 ký tự')
      return
    }
    if (pw.next !== pw.confirm) {
      setPwError('Mật khẩu xác nhận không khớp')
      return
    }
    setPwSaving(true)
    try {
      await accountApi.changePassword(pw.current, pw.next)
      setPw({ current: '', next: '', confirm: '' })
      setSnack({ msg: 'Đổi mật khẩu thành công', severity: 'success' })
    } catch (err) {
      setPwError(getErrorMessage(err))
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Hồ sơ cá nhân"
        subtitle="Quản lý thông tin tài khoản, cài đặt và mật khẩu"
      />

      <PageCard title="Thông tin tài khoản" loading={loading} error={error} onRetry={load}>
        {profile && (
          <Stack component="form" onSubmit={saveProfile} spacing={2.5}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  fontWeight: 700,
                  bgcolor: profile.role === 'admin' ? 'secondary.main' : 'primary.main',
                }}
              >
                {profile.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{profile.username}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Tham gia {fmtDate(profile.createdAt)}
                </Typography>
              </Box>
              {profile.role === 'admin' && (
                <Chip size="small" color="secondary" label="Quản trị" sx={{ fontWeight: 700 }} />
              )}
            </Stack>

            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              label="Tên hiển thị"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
              <TextField
                select
                label="Ngôn ngữ"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                fullWidth
              >
                {LANGUAGES.map((l) => (
                  <MenuItem key={l.value} value={l.value}>
                    {l.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Đơn vị tiền tệ"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                fullWidth
              >
                {CURRENCIES.map((c) => (
                  <MenuItem key={c.value} value={c.value}>
                    {c.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={changeDarkMode} />}
              label="Chế độ tối"
            />

            <Box>
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </Box>
          </Stack>
        )}
      </PageCard>

      <PageCard title="Đổi mật khẩu" subtitle="Nhập mật khẩu hiện tại để xác nhận">
        <Stack component="form" onSubmit={savePassword} spacing={2.5} sx={{ maxWidth: 420 }}>
          {pwError && <Alert severity="error">{pwError}</Alert>}
          <TextField
            label="Mật khẩu hiện tại"
            type="password"
            value={pw.current}
            onChange={(e) => setPw({ ...pw, current: e.target.value })}
            fullWidth
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={pw.next}
            onChange={(e) => setPw({ ...pw, next: e.target.value })}
            fullWidth
          />
          <TextField
            label="Nhập lại mật khẩu mới"
            type="password"
            value={pw.confirm}
            onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
            fullWidth
          />
          <Box>
            <Button type="submit" variant="contained" disabled={pwSaving || !pw.current}>
              {pwSaving ? 'Đang đổi...' : 'Đổi mật khẩu'}
            </Button>
          </Box>
        </Stack>
      </PageCard>

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