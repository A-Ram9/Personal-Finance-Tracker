import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Typography, Box } from '@mui/material';

function ExpenseChart({ data = [], convertAmount, currencySymbol, mode }) {
  // Use Ultramarine Blue, Golden Yellow, and related modern accents for dark/light modes
  const COLORS = mode === 'dark' 
    ? ['#4169E1', '#FFD700', '#2E4C9E', '#C5A000', '#5C7CD8']
    : ['#4169E1', '#E6B800', '#1C3B8B', '#FFEA75', '#708EE6'];

  if (!data || data.length === 0) {
    return (
      <Card sx={{ p: 4, width: '100%', maxWidth: 500, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>No distribution data found.</Typography>
      </Card>
    );
  }

  const convertedData = data.map(item => ({
    ...item,
    value: parseFloat(convertAmount(item.value))
  }));

  return (
    <Card sx={{ p: 4, width: '100%', maxWidth: 550, background: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 800, alignSelf: 'flex-start', color: 'primary.main' }}>Category Allocation</Typography>
      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={convertedData}
              cx="50%" cy="50%"
              outerRadius={100}
              innerRadius={60} // Donut style configuration for sleek look
              paddingAngle={4}
              dataKey="value"
            >
              {convertedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' }} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${currencySymbol}${value}`, 'Total']}
              contentStyle={{ background: mode === 'dark' ? '#14182D' : '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}

export default ExpenseChart;