import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

function Root() {
  const [mode, setMode] = useState('dark');

  const theme = createTheme({
    palette: {
      mode,
      primary: { 
        main: '#4169E1', // Ultramarine Blue
      },
      secondary: { 
        main: '#FFD700', // Golden Yellow
      },
      background: {
        default: mode === 'dark' ? '#0B0C10' : '#F4F6F9',
        paper: mode === 'dark' ? 'rgba(20, 24, 45, 0.65)' : 'rgba(255, 255, 255, 0.8)',
      },
      text: {
        primary: mode === 'dark' ? '#FFFFFF' : '#1A1D20',
        secondary: mode === 'dark' ? '#A0AEC0' : '#64748B',
      }
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      h5: { fontWeight: 800 },
      h6: { fontWeight: 700 }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: mode === 'dark' 
              ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)' 
              : '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
            borderRadius: '24px',
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '14px',
            textTransform: 'none',
            fontWeight: 700,
            padding: '10px 22px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App toggleTheme={() => setMode(mode === 'dark' ? 'light' : 'dark')} mode={mode} />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);