import { Card, CardContent, Typography, Stack, Box, Skeleton, Button, alpha } from '@mui/material'

export default function PageCard({
  title,
  subtitle,
  action,
  loading,
  error,
  onRetry,
  isEmpty,
  emptyIcon,
  emptyText,
  children,
}) {
  const hasHeader = title || subtitle || action

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
        {hasHeader && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mb={3}
            gap={1.5}
          >
            <Box>
              {title && (
                <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.01em' }}>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action && <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>{action}</Box>}
          </Stack>
        )}

        {loading ? (
          <Stack spacing={2}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rounded" height={54} sx={{ borderRadius: 2.5 }} />
            ))}
          </Stack>
        ) : error ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              px: 2,
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
              border: '1px dashed',
              borderColor: 'error.light',
            }}
          >
            <Typography fontSize={42} mb={1}>⚠️</Typography>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Không thể tải dữ liệu
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2.5} maxWidth={440} mx="auto">
              {error}
            </Typography>
            {onRetry && (
              <Button variant="outlined" color="primary" onClick={onRetry}>
                Thử lại
              </Button>
            )}
          </Box>
        ) : isEmpty ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 7,
              px: 2,
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.text.secondary, 0.03),
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                display: 'grid',
                placeItems: 'center',
                fontSize: 32,
                mx: 'auto',
                mb: 2,
              }}
            >
              {emptyIcon || '📭'}
            </Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Chưa có dữ liệu
            </Typography>
            <Typography variant="body2" color="text.secondary" maxWidth={400} mx="auto">
              {emptyText}
            </Typography>
          </Box>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}


