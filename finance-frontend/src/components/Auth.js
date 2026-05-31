import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Card, ToggleButtonGroup, ToggleButton, Fade } from '@mui/material';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? 'login' : 'register';
    try {
      const res = await axios.post(`http://localhost:5000/${endpoint}`, { username, password });
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        onAuthSuccess(res.data.username);
      } else {
        setIsLogin(true);
        alert('Registration complete! Please log in.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <Box sx={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0A1128 0%, #101F42 100%)',
      overflow: 'hidden'
    }}>
      {/* Floating Currency Symbols Animation Overlay */}
      <Box sx={{
        position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1,
        '& span': {
          position: 'absolute', color: 'rgba(65, 105, 225, 0.15)', fontSize: '3rem', fontWeight: 'bold',
          animation: 'floatAnimation 12s infinite linear'
        },
        '@keyframes floatAnimation': {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(-10vh) rotate(360deg)', opacity: 0 }
        }
      }}>
        <span style={{ left: '10%', animationDelay: '0s', animationDuration: '14s' }}>₹</span>
        <span style={{ left: '25%', animationDelay: '3s', animationDuration: '18s' }}>$</span>
        <span style={{ left: '45%', animationDelay: '1s', animationDuration: '15s' }}>ر.ع.</span>
        <span style={{ left: '65%', animationDelay: '5s', animationDuration: '12s' }}>£</span>
        <span style={{ left: '85%', animationDelay: '2s', animationDuration: '20s' }}>₹</span>
      </Box>

      <Fade in={true} timeout={1000}>
        <Card sx={{
          p: 5, width: '100%', maxWidth: 420, zIndex: 2, textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 900, mb: 1, letterSpacing: '-0.5px' }}>
            Fintrack
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
            Manage assets intelligently
          </Typography>

          <ToggleButtonGroup
            value={isLogin}
            exclusive
            onChange={(e, val) => val !== null && setIsLogin(val)}
            sx={{ mb: 4, width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', p: 0.5 }}
          >
            <ToggleButton value={true} sx={{ flex: 1, color: '#FFF', '&.Mui-selected': { borderRadius: '10px', backgroundColor: '#4169E1', color: '#FFF' } }}>Sign In</ToggleButton>
            <ToggleButton value={false} sx={{ flex: 1, color: '#FFF', '&.Mui-selected': { borderRadius: '10px', backgroundColor: '#4169E1', color: '#FFF' } }}>Register</ToggleButton>
          </ToggleButtonGroup>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth variant="outlined" label="Username" value={username}
              onChange={(e) => setUsername(e.target.value)} required
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: '#FFF', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#4169E1' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }}
            />
            <TextField
              fullWidth variant="outlined" label="Password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { color: '#FFF', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&:hover fieldset': { borderColor: '#4169E1' } }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' } }}
            />

            {error && <Typography variant="caption" sx={{ color: '#FF0844', display: 'block', mb: 2 }}>{error}</Typography>}

            <Button type="submit" variant="contained" fullWidth sx={{
              background: 'linear-gradient(135deg, #4169E1 0%, #2A47A1 100%)',
              boxShadow: '0 4px 20px rgba(65, 105, 225, 0.4)', color: '#FFF', py: 1.5
            }}>
              {isLogin ? 'Access Ledger' : 'Create Account'}
            </Button>
          </form>
        </Card>
      </Fade>
    </Box>
  );
}

export default Auth;