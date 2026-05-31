import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Transactions from './components/Transactions';
import ExpenseChart from './components/ExpenseChart';
import SummaryCards from './components/SummaryCards';
import Auth from './components/Auth';
import { Container, Typography, AppBar, Toolbar, Button, Grid, Fade, Select, MenuItem, Box, IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', NPR: '₨', OMR: 'ر.ع.' };

function App({ toggleTheme, mode }) {
  const [user, setUser] = useState(localStorage.getItem('username') || null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [currency, setCurrency] = useState('INR'); // Base Currency is INR
  const [rates, setRates] = useState({ INR: 1, USD: 0.012, NPR: 1.60, OMR: 0.0046 });

  // Fetch Live Rates targeting INR base metrics
  useEffect(() => {
    axios.get('https://open.er-api.com/v6/latest/INR')
      .then(res => {
        if (res.data && res.data.rates) setRates(res.data.rates);
      })
      .catch(() => console.log("Using cached currency profiles."));
  }, []);

  const handleData = (data) => {
    setTransactions(data);
    const grouped = {};
    data.forEach(t => {
      if (!grouped[t.category]) grouped[t.category] = 0;
      grouped[t.category] += t.amount;
    });
    setChartData(Object.keys(grouped).map(cat => ({ name: cat, value: grouped[cat] })));
  };

  const convertAmount = (amountInINR) => {
    return (amountInINR * (rates[currency] || 1)).toFixed(2);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (!user) return <Auth onAuthSuccess={(name) => setUser(name)} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Dynamic Centered Greeting Strip & Theme Selector */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        p: 3, mb: 4, borderRadius: '24px', backgroundColor: 'background.paper',
        backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Box sx={{ flex: 1 }} />
        <Typography variant="h6" sx={{
          textAlign: 'center', fontWeight: 800, flex: 2,
          background: mode === 'dark' ? 'linear-gradient(45deg, #FFF 30%, #FFD700 90%)' : 'linear-gradient(45deg, #4169E1 30%, #101F42 90%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Welcome {user} ! Let's stay on track!
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: 1, alignItems: 'center' }}>
          <Select
            value={currency} onChange={(e) => setCurrency(e.target.value)} size="small"
            sx={{ borderRadius: '12px', mx: 1, height: '40px', fontWeight: 700 }}
          >
            <MenuItem value="INR">INR (₹)</MenuItem>
            <MenuItem value="USD">USD ($)</MenuItem>
            <MenuItem value="NPR">NPR (₨)</MenuItem>
            <MenuItem value="OMR">OMR (ر.ع.)</MenuItem>
          </Select>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <LightModeIcon sx={{ color: '#FFD700' }} /> : <DarkModeIcon sx={{ color: '#4169E1' }} />}
          </IconButton>
          <IconButton onClick={logout} color="error"><LogoutIcon /></IconButton>
        </Box>
      </Box>

      {/* Target Custom Order Layout Grid */}
      <Fade in={true} timeout={800}>
        <Grid container spacing={4}>
          {/* Section 1: Top Ledger Input Form */}
          <Grid item xs={12}>
            <Transactions onData={handleData} convertAmount={convertAmount} currencySymbol={CURRENCY_SYMBOLS[currency]} />
          </Grid>
          
          {/* Section 2: Equal-Width Summary Metrics Layout Row */}
          <Grid item xs={12}>
            <SummaryCards transactions={transactions} convertAmount={convertAmount} currencySymbol={CURRENCY_SYMBOLS[currency]} />
          </Grid>

          {/* Section 3: Distribution Breakdown Visualizer Card */}
          <Grid item xs={12} display="flex" justifyContent="center">
            <ExpenseChart data={chartData} convertAmount={convertAmount} currencySymbol={CURRENCY_SYMBOLS[currency]} mode={mode} />
          </Grid>
        </Grid>
      </Fade>
    </Container>
  );
}

export default App;