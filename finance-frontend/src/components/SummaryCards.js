import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function SummaryCards({ transactions, convertAmount, currencySymbol }) {
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  const cards = [
    { label: 'Total Inflow', value: income, color: '#4169E1', icon: <ArrowUpwardIcon /> },
    { label: 'Total Outflow', value: expense, color: '#FFD700', icon: <ArrowDownwardIcon /> },
    { label: 'Net Balance', value: balance, color: balance >= 0 ? '#4169E1' : '#FFD700', icon: <AccountBalanceWalletIcon /> }
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((c, i) => (
        <Grid item xs={12} md={4} key={i}>
          <Card sx={{ background: 'background.paper' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 1 }}>{c.label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {currencySymbol} {convertAmount(c.value)}
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.05)', color: c.color }}>
                {c.icon}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default SummaryCards;