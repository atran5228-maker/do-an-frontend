import { useMemo, useState, createContext, useContext } from 'react'
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ThemeModeContext = createContext({ mode: 'light', toggleMode: () => {} })

export const useThemeMode = () => useContext(ThemeModeContext)

export default function AppTheme({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light')

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('themeMode', next)
      return next
    })
  }

  const theme = useMemo(() => {
    const isLight = mode === 'light'
    const primaryMain = isLight ? '#2563eb' : '#3b82f6' // Indigo / Royal Blue
    const secondaryMain = isLight ? '#0d9488' : '#14b8a6' // Teal

    return createTheme({
      palette: {
        mode,
        primary: {
          main: primaryMain,
          light: isLight ? '#60a5fa' : '#93c5fd',
          dark: isLight ? '#1d4ed8' : '#1e40af',
          contrastText: '#ffffff',
        },
        secondary: {
          main: secondaryMain,
          light: isLight ? '#2dd4bf' : '#5eead4',
          dark: isLight ? '#0f766e' : '#115e59',
          contrastText: '#ffffff',
        },
        success: {
          main: isLight ? '#10b981' : '#34d399',
          light: '#6ee7b7',
          dark: '#047857',
        },
        warning: {
          main: isLight ? '#f59e0b' : '#fbbf24',
          light: '#fde68a',
          dark: '#b45309',
        },
        error: {
          main: isLight ? '#ef4444' : '#f87171',
          light: '#fca5a5',
          dark: '#b91c1c',
        },
        background: isLight
          ? { default: '#f8fafc', paper: '#ffffff' }
          : { default: '#090d16', paper: '#111827' },
        divider: isLight ? 'rgba(226, 232, 240, 0.9)' : 'rgba(51, 65, 85, 0.45)',
        text: isLight
          ? { primary: '#0f172a', secondary: '#64748b' }
          : { primary: '#f8fafc', secondary: '#94a3b8' },
      },
      shape: { borderRadius: 12 },
      typography: {
        fontFamily: '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h4: { fontWeight: 800, letterSpacing: '-0.02em' },
        h5: { fontWeight: 700, letterSpacing: '-0.015em' },
        h6: { fontWeight: 700, letterSpacing: '-0.01em' },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
        body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
        body2: { fontSize: '0.875rem', lineHeight: 1.57 },
        button: { fontWeight: 600, textTransform: 'none' },
      },
      components: {
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: {
            root: {
              borderRadius: 10,
              padding: '8px 18px',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.18s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            },
            containedPrimary: {
              background: isLight
                ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: `0 4px 14px -3px ${alpha(primaryMain, 0.35)}`,
              '&:hover': {
                boxShadow: `0 6px 18px -3px ${alpha(primaryMain, 0.5)}`,
              },
            },
            containedSecondary: {
              background: isLight
                ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              boxShadow: `0 4px 14px -3px ${alpha(secondaryMain, 0.35)}`,
            },
            outlined: {
              borderColor: isLight ? '#cbd5e1' : '#334155',
              '&:hover': {
                borderColor: primaryMain,
                backgroundColor: alpha(primaryMain, 0.04),
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              backgroundImage: 'none',
              border: `1px solid ${isLight ? '#e2e8f0' : 'rgba(51, 65, 85, 0.5)'}`,
              boxShadow: isLight
                ? '0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 12px -2px rgba(15, 23, 42, 0.02)'
                : '0 1px 3px rgba(0, 0, 0, 0.25)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
            rounded: {
              borderRadius: 16,
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 11,
              '& fieldset': {
                borderColor: isLight ? '#e2e8f0' : '#334155',
              },
              '&:hover fieldset': {
                borderColor: isLight ? '#94a3b8' : '#64748b',
              },
              '&.Mui-focused fieldset': {
                borderColor: primaryMain,
                borderWidth: '1.5px',
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              padding: '12px 16px',
              borderBottom: `1px solid ${isLight ? '#f1f5f9' : '#1e293b'}`,
            },
            head: {
              fontWeight: 700,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: isLight ? '#64748b' : '#94a3b8',
              backgroundColor: isLight ? '#f8fafc' : '#0f172a',
              borderBottom: `1px solid ${isLight ? '#e2e8f0' : '#334155'}`,
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              transition: 'background-color 0.15s',
              '&:last-child td, &:last-child th': { borderBottom: 0 },
              '&:hover': {
                backgroundColor: isLight ? '#f8fafc' : alpha('#ffffff', 0.03),
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              fontWeight: 600,
              borderRadius: 8,
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              borderRadius: 8,
              fontSize: '0.75rem',
              fontWeight: 500,
              padding: '6px 12px',
              backgroundColor: isLight ? '#0f172a' : '#334155',
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 20,
              border: `1px solid ${isLight ? '#e2e8f0' : '#334155'}`,
              boxShadow: isLight
                ? '0 24px 48px -12px rgba(15, 23, 42, 0.18)'
                : '0 24px 48px -12px rgba(0, 0, 0, 0.6)',
            },
          },
        },
      },
    })
  }, [mode])

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

