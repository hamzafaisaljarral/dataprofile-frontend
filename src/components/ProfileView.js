import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProfileViewer({ profileData }) {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  // Handle loading or missing data
  if (!profileData?.profile) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography>
          {!profileData ? 'Loading profile data...' : 'No profile data available'}
        </Typography>
      </Paper>
    );
  }

  // Extract the actual profile data from the response
  const { overview, column_analysis } = profileData.profile;

  // Prepare chart data for numeric columns
  const numericColumns = Object.entries(column_analysis)
    .filter(([_, col]) => col.type === 'numeric');

  const numericChartData = {
    labels: numericColumns.map(([name]) => name),
    datasets: [{
      label: 'Average Values',
      data: numericColumns.map(([_, col]) => col.stats?.mean || 0),
      backgroundColor: '#2196f3'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: 'category' },
      y: { beginAtZero: true }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Data Profile Report
      </Typography>

      {/* Overview Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Overview</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <strong>Rows:</strong> {overview.num_rows}
          </Grid>
          <Grid item xs={4}>
            <strong>Columns:</strong> {overview.num_columns}
          </Grid>
          <Grid item xs={4}>
            <strong>Missing Values:</strong> {Object.values(overview.missing_values).reduce((a, b) => a + b, 0)}
          </Grid>
        </Grid>
      </Box>

      {/* Numeric Columns Chart */}
      {numericColumns.length > 0 && (
        <Box sx={{ height: 400, mb: 4 }}>
          <Typography variant="h6">Numeric Columns Analysis</Typography>
          <Bar 
            data={numericChartData}
            options={chartOptions}
            ref={chartRef}
          />
        </Box>
      )}

      {/* Column Details */}
      <Box>
        <Typography variant="h6" gutterBottom>Column Details</Typography>
        {Object.entries(column_analysis).map(([colName, colData]) => (
          <Box key={colName} sx={{ mb: 3 }}>
            <Typography variant="subtitle1">{colName} ({colData.type})</Typography>
            <Box component="pre" sx={{ 
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              overflowX: 'auto'
            }}>
              {JSON.stringify(colData.stats, null, 2)}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}