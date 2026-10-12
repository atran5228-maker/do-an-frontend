import { Box, Card, CardContent, Stack, Typography, useTheme, useMediaQuery, alpha } from '@mui/material'
import { fmtVND } from '../utils/format'

// Thẻ thống kê hiện đại với glassmorphism & accent icon
export function StatCard({ title, value, icon: Icon, gradient, sub}) {
  return (
    <Card
      elevation={0}
      sx={{
        flex: 1,
        minWidth: { xs: '100%', sm: 220 },
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.22s ease-in-out',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'light'
              ? '0 12px 28px -10px rgba(15, 23, 42, 0.08)'
              : '0 12px 28px -10px rgba(0, 0, 0, 0.4)',
        },
      }}
    >
      {/* Subtle background glow */}
      <Box
        sx={{
          position: 'absolute',
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: gradient || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          opacity: 0.12,
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }}
      />

      <CardContent sx={{ p: 2.75 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={600}
            sx={{ letterSpacing: '0.01em' }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 3,
              background: gradient || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.2)',
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
        </Stack>

        <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em', my: 0.5 }}>
          {value}
        </Typography>

        {sub && (
          <Typography variant="caption" color="text.secondary" fontWeight={500} display="block" mt={0.5}>
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

// Biểu đồ cột hiện đại và mượt mà
export function SimpleBarChart({ data }) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
  const max = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1) * 1.15
  const axisColor = theme.palette.text.secondary

  return (
    <Box sx={{ pt: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: { xs: 1.5, sm: 3 },
          height: 240,
          px: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {data.map((d) => (
          <Box
            key={d.month}
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: { xs: 0.75, sm: 1.25 },
              height: '100%',
              pb: 0.5,
            }}
          >
            <TooltipBox
              label={`Thu nhập: ${fmtVND(d.income)}`}
              height={`${(d.income / max) * 100}%`}
              color="linear-gradient(180deg, #10b981 0%, #059669 100%)"
              showValue={isDesktop && d.income > 0 ? fmtVND(d.income) : null}
            />
            <TooltipBox
              label={`Chi tiêu: ${fmtVND(d.expense)}`}
              height={`${(d.expense / max) * 100}%`}
              color="linear-gradient(180deg, #f43f5e 0%, #e11d48 100%)"
              showValue={isDesktop && d.expense > 0 ? fmtVND(d.expense) : null}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 3 }, px: 1, pt: 1.5 }}>
        {data.map((d) => (
          <Typography
            key={d.month}
            sx={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: '0.75rem' }}
            variant="caption"
            color={axisColor}
          >
            {d.month}
          </Typography>
        ))}
      </Box>

      <Stack direction="row" spacing={3} mt={2.5} justifyContent="center">
        <Legend color="#10b981" label="Thu nhập" />
        <Legend color="#f43f5e" label="Chi tiêu" />
      </Stack>
    </Box>
  )
}

function TooltipBox({ label, height, color, showValue }) {
  return (
    <Stack
      alignItems="center"
      spacing={0.5}
      sx={{
        height: '100%',
        justifyContent: 'flex-end',
        cursor: 'pointer',
        '&:hover .bar': {
          filter: 'brightness(1.15)',
          transform: 'scaleY(1.02)',
        },
      }}
      title={label}
    >
      {showValue && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: 10,
            color: 'text.secondary',
            whiteSpace: 'nowrap',
            mb: 0.25,
          }}
        >
          {showValue}
        </Typography>
      )}
      <Box
        className="bar"
        sx={{
          width: { xs: 16, sm: 24 },
          height,
          background: color,
          borderRadius: '6px 6px 2px 2px',
          minHeight: 4,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'bottom',
          boxShadow: '0 2px 6px -1px rgba(0,0,0,0.15)',
        }}
      />
    </Stack>
  )
}

function Legend({ color, label }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          width: 12,
          height: 12,
          bgcolor: color,
          borderRadius: '4px',
          boxShadow: `0 2px 6px ${alpha(color, 0.4)}`,
        }}
      />
      <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.8125rem">
        {label}
      </Typography>
    </Stack>
  )
}

export const MONTH_NAMES = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']

