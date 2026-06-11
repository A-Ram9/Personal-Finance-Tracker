import React, { useState } from 'react';
import { Card, Typography, TextField, Button, Box, Stack, Paper, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

function FinGanPanel() {
  const [messages, setMessages] = useState([
    { sender: 'fingan', text: 'Salutations. I am FinGan, your private financial analytics core. How can I optimize your capital vector today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Fetch token to satisfy the backend token security validation layer
      const token = localStorage.getItem('token'); 
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.post('http://localhost:5000/api/fingan/chat', 
        { message: input }, 
        { headers }
      );

      setMessages(prev => [...prev, { sender: 'fingan', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'fingan', text: 'FinGan core communication array connection timeout.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, background: 'background.paper', mt: 4, display: 'flex', flexDirection: 'column', height: '450px' }}>
      <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <AutoAwesomeIcon sx={{ color: '#00BFFF' }} />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          FinGan Core Intel (Premium Local AI)
        </Typography>
      </Stack>

      {/* Chat Space */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5, pr: 1 }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <Paper sx={{
              p: 2,
              borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              backgroundColor: msg.sender === 'user' ? 'primary.main' : 'rgba(255,255,255,0.02)',
              border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)'
            }}>
              <Typography variant="body2" sx={{ color: 'text.primary', whiteSpace: 'pre-line' }}>
                {msg.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} sx={{ color: '#00BFFF' }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Evaluating financial matrices...</Typography>
          </Box>
        )}
      </Box>

      {/* Input Tray */}
      <Stack direction="row" gap={1}>
        <TextField
          fullWidth size="small" variant="outlined" placeholder="Ask FinGan about your burn velocity or transaction metrics..."
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
        />
        <Button variant="contained" onClick={handleSend} sx={{ borderRadius: '12px', minWidth: '50px' }}>
          <SendIcon fontSize="small" />
        </Button>
      </Stack>
    </Card>
  );
}

export default FinGanPanel;