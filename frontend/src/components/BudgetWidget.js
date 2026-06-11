import React, { useState } from 'react';
import { Card, Typography, Box, Slider, LinearProgress, Stack } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

function BudgetWidget({ transactions, convertAmount, currencySymbol }) {
  const [budgetLimit, setBudgetLimit] = useState(50000); // Base Default limits inside INR

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInflow = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Compute metric ratios safely
  const percentageUsed = Math.min((totalExpenses / budgetLimit) * 100, 100);
  const savingsRate = totalInflow > 0 ? Math.max(((totalInflow - totalExpenses) / totalInflow) * 100, 0) : 0;

  // Change indicator color if expenses run out of bounds
  const getProgressBarColor = () => {
    if (percentageUsed >= 90) return '#FFD700'; // Target theme alert accents
    return '#4169E1';
  };

  return (
    <Card sx={{ p: 4, background: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrackChangesIcon /> Target Ceiling Budget
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            BASE INR SETTING
          </Typography>
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Adjust Monthly Target Limit:
        </Typography>
        
        <Slider
          value={budgetLimit}
          min={5000}
          max={200000}
          step={5000}
          onChange={(e, val) => setBudgetLimit(val)}
          sx={{ color: 'primary.main', mb: 3 }}
        />

        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Ceiling Spent Rate:</Typography>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {percentageUsed.toFixed(0)}% ({currencySymbol}{convertAmount(totalExpenses)} / {currencySymbol}{convertAmount(budgetLimit)})
          </Typography>
        </Stack>

        <Box sx={{ width: '100%', mb: 4 }}>
          <LinearProgress 
            variant="determinate" 
            value={percentageUsed} 
            sx={{
              height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.05)',
              '& .MuiLinearProgress-bar': { backgroundColor: getProgressBarColor(), borderRadius: 5 }
            }}
          />
        </Box>
      </Box>

      <Box sx={{ p: 2, borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Dynamic Net Savings Rate</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: 'secondary.main' }}>{savingsRate.toFixed(1)}%</Typography>
          </Box>
          <Box sx={{ width: 50, height: 50, borderRadius: '50%', border: `4px solid #FFD700`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
            ROI
          </Box>
        </Stack>
      </Box>
    </Card>
  );
}

export default BudgetWidget;