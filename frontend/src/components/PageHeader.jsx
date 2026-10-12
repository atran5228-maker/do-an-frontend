import { Stack, Typography, Box } from '@mui/material'

export default function PageHeader({ title, subtitle, action, badge }) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={2}
      mb={3.5}
    >
      <Box>
        <Stack direction="row" alignItems="center" spacing={1.5} mb={subtitle ? 0.75 : 0}>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
          {badge}
        </Stack>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Stack>
  )
}

