import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  DialogContentText,
  TextField,
  Typography,
  IconButton,
  Box,
  alpha,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

export function FormDialog({
  open,
  title,
  onClose,
  onSubmit,
  saving,
  error,
  children,
  submitLabel = 'Lưu',
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 23, 42, 0.45)' },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          fontWeight: 800,
          fontSize: '1.125rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Stack
          spacing={2.5}
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
        >
          {error && (
            <Alert severity="error" sx={{ borderRadius: 2.5 }}>
              {error}
            </Alert>
          )}
          {children}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, bgcolor: (t) => (t.palette.mode === 'light' ? '#f8fafc' : '#0d131f') }}>
        <Button onClick={onClose} color="inherit" disabled={saving}>
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          onClick={onSubmit}
          sx={{ minWidth: 90 }}
        >
          {saving ? 'Đang lưu...' : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function ConfirmDialog({
  open,
  title = 'Xác nhận xóa',
  content,
  onClose,
  onConfirm,
  saving,
  error,
  confirmLabel = 'Xóa',
  danger = true,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 23, 42, 0.45)' },
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        {danger && (
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              bgcolor: (t) => alpha(t.palette.error.main, 0.1),
              color: 'error.main',
              display: 'grid',
              placeItems: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <WarningAmberRoundedIcon sx={{ fontSize: 32 }} />
          </Box>
        )}
        <Typography variant="h6" fontWeight={800} gutterBottom>
          {title}
        </Typography>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 1 }}>
          {content}
        </DialogContentText>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2.5, mt: 2, textAlign: 'left' }}>
            {error}
          </Alert>
        )}
      </Box>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 0,
          justifyContent: 'center',
          gap: 1.5,
        }}
      >
        <Button onClick={onClose} color="inherit" disabled={saving} sx={{ flex: 1 }}>
          Hủy
        </Button>
        <Button
          color={danger ? 'error' : 'primary'}
          variant="contained"
          onClick={onConfirm}
          disabled={saving}
          sx={{ flex: 1 }}
        >
          {saving ? 'Đang xử lý...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function MoneyInput({ value, onChange, label = 'Số tiền', autoFocus = false }) {
  return (
    <TextField
      fullWidth
      label={label}
      type="number"
      autoFocus={autoFocus}
      slotProps={{
        inputLabel: { shrink: true },
        input: {
          endAdornment: (
            <Typography variant="caption" fontWeight={700} color="text.secondary">
              VND
            </Typography>
          ),
        },
      }}
      value={value}
      onChange={onChange}
      sx={{
        '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
          appearance: 'none',
        },
      }}
    />
  )
}

