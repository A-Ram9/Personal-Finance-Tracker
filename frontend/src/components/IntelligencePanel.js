import React from 'react';
import { Card, Typography, Grid, Box, Stack, Chip } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function IntelligencePanel({ transactions, convertAmount, currencySymbol }) {
  // 1. Separate calculation vectors
  const inflows = transactions.filter(t => t.type === 'income');
  const outflows = transactions.filter(t => t.type === 'expense');

  const totalInflow = inflows.reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = outflows.reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalInflow - totalOutflow;

  // 2. Compute Top Expense Category
  const categoryMap = {};
  outflows.forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });
  
  let topCategory = "None";
  let maxExpense = 0;
  Object.keys(categoryMap).forEach(cat => {
    if (categoryMap[cat] > maxExpense) {
      maxExpense = categoryMap[cat];
      topCategory = cat;
    }
  });

  // 3. Algorithmic Health Grader Core
  const computeHealthScore = () => {
    if (totalInflow === 0 && totalOutflow === 0) return { grade: 'N/A', label: 'No Data Ledgered', color: '#888' };
    if (totalInflow === 0 && totalOutflow > 0) return { grade: 'F', label: 'Critical Outflow Deficit', color: '#FF3B30' };
    
    const burnRatio = totalOutflow / totalInflow;
    
    if (burnRatio <= 0.3) return { grade: 'A+', label: 'Elite Wealth Accumulation', color: '#4169E1' };
    if (burnRatio <= 0.5) return { grade: 'A', label: 'Strong Financial Health', color: '#00BFFF' };
    if (burnRatio <= 0.7) return { grade: 'B', label: 'Moderate Burn Trajectory', color: '#FFD700' };
    if (burnRatio <= 0.9) return { grade: 'C', label: 'Tight Operational Bounds', color: '#FF9500' };
    return { grade: 'D', label: 'High Dependency Risk', color: '#FF5722' };
  };

  const health = computeHealthScore();

  // 4. Burn Velocity Analytics (Past 7 Days vs Total Average)
  const computeVelocity = () => {
    if (outflows.length === 0) return { status: 'Optimal', rate: '0%', text: 'No recorded drainage pathways.', color: '#4169E1' };
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOutflow = outflows
      .filter(t => new Date(t.date) >= sevenDaysAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    if (recentOutflow > (totalOutflow * 0.5) && outflows.length > 2) {
      return { status: 'Accelerating', rate: 'High', text: 'Recent outlays are heavy. Consider freezing non-essentials.', color: '#FFD700' };
    }
    return { status: 'Stable', rate: 'Nominal', text: 'Velocity parameters remain fully stable.', color: '#00BFFF' };
  };

  const velocity = computeVelocity();

  return (
    <Card sx={{ p: 4, background: 'background.paper', width: '100%', mt: 4 }}>
      <Stack direction="row" alignItems="center" gap={1} mb={3}>
        <AutoAwesomeIcon sx={{ color: '#FFD700' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
          Fintrack Financial Intelligence
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Metric Card 1: Algorithmic Health Grade */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <AccountBalanceWalletIcon fontSize="inherit" /> SYSTEM HEALTH GRADE
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{health.label}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Based on income-to-loss ratios</Typography>
            </Box>
            <Box sx={{ width: 65, height: 65, borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: `2px solid ${health.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: health.color }}>{health.grade}</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Metric Card 2: Highest Inroad Loss Vector */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)', height: '100%' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <TrendingUpIcon fontSize="inherit" /> PRIMARY OUTFLOW DRAIN
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: maxExpense > 0 ? '#FFD700' : 'text.primary', mb: 0.5 }}>
              {topCategory}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {maxExpense > 0 ? `Accounting for ${currencySymbol}${convertAmount(maxExpense)}` : 'No expenses logged yet'}
            </Typography>
          </Box>
        </Grid>

        {/* Metric Card 3: Spending Velocity Tracker */}
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, borderRadius: '16px', background: 'rgba(255, 255, 255, 0.01)', border: '1px solid rgba(255,255,255,0.04)', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <SpeedIcon fontSize="inherit" /> CAPITAL VELOCITY
              </Typography>
              <Chip label={velocity.status} size="small" sx={{ background: 'rgba(255,255,255,0.03)', color: velocity.color, fontWeight: 700, border: `1px solid ${velocity.color}`, fontSize: '0.65rem' }} />
            </Stack>
            <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
              {velocity.rate} Spending Momentum
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.3 }}>
              {velocity.text}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default IntelligencePanel;