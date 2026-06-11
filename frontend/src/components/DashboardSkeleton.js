import React from 'react';
import { Grid, Box, Skeleton, Card, Stack } from '@mui/material';

function DashboardSkeleton() {
  // Common custom glassmorphic placeholder styling to match your theme
  const skeletonStyles = {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    '&::after': {
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
    },
  };

  return (
    <Box sx={{ py: 4 }}>
      {/* 1. Header Banner Skeleton */}
      <Card sx={{ p: 3, mb: 4, background: 'background.paper', borderRadius: '24px' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Skeleton variant="rectangular" width="40%" height={30} sx={skeletonStyles} animation="wave" />
          <Stack direction="row" gap={2} width="30%" justifyContent="flex-end">
            <Skeleton variant="rectangular" width={80} height={35} sx={skeletonStyles} animation="wave" />
            <Skeleton variant="circular" width={35} height={35} sx={skeletonStyles} animation="wave" />
            <Skeleton variant="circular" width={35} height={35} sx={skeletonStyles} animation="wave" />
          </Stack>
        </Stack>
      </Card>

      <Grid container spacing={4}>
        {/* 2. Left Column: Ledger Operations Placeholder */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 4, background: 'background.paper' }}>
            <Stack direction="row" justifyContent="space-between" mb={3}>
              <Skeleton variant="rectangular" width="35%" height={30} sx={skeletonStyles} animation="wave" />
              <Skeleton variant="rectangular" width="20%" height={30} sx={skeletonStyles} animation="wave" />
            </Stack>
            {/* Form Inputs Shimmer */}
            <Grid container spacing={2} mb={4}>
              <Grid item xs={4}><Skeleton variant="rectangular" height={50} sx={skeletonStyles} animation="wave" /></Grid>
              <Grid item xs={4}><Skeleton variant="rectangular" height={50} sx={skeletonStyles} animation="wave" /></Grid>
              <Grid item xs={4}><Skeleton variant="rectangular" height={50} sx={skeletonStyles} animation="wave" /></Grid>
            </Grid>
            {/* List Item Shimmers */}
            <Stack gap={2}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" height={70} sx={{ ...skeletonStyles, borderRadius: '16px' }} animation="wave" />
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* 3. Right Column: Target Budget Placeholder */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 4, background: 'background.paper', height: '100%' }}>
            <Skeleton variant="rectangular" width="60%" height={28} mb={3} sx={skeletonStyles} animation="wave" />
            <Box sx={{ my: 4 }}>
              <Skeleton variant="text" width="40%" sx={skeletonStyles} animation="wave" />
              <Skeleton variant="rectangular" height={12} sx={{ ...skeletonStyles, my: 1 }} animation="wave" />
              <Skeleton variant="rectangular" height={15} sx={{ ...skeletonStyles, mt: 3 }} animation="wave" />
            </Box>
            <Skeleton variant="rectangular" height={80} sx={{ ...skeletonStyles, borderRadius: '16px', mt: 'auto' }} animation="wave" />
          </Card>
        </Grid>

        {/* 4. Horizontal Metrics Cards Placeholder */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Card sx={{ p: 3, background: 'background.paper' }}>
                  <Skeleton variant="text" width="50%" sx={skeletonStyles} animation="wave" />
                  <Skeleton variant="rectangular" height={40} sx={{ ...skeletonStyles, my: 1 }} animation="wave" />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DashboardSkeleton;