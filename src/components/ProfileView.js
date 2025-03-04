import React, { useEffect, useRef } from 'react';
import { Paper, Typography, Grid } from '@mui/material';
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

// Register Chart.js components
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

  // Cleanup chart instance on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  if (!profileData) return null;

  // Chart configuration
  const numericChartData = {
    labels: Object.keys(profileData.column_analysis).filter(
      col => profileData.column_analysis[col].type === 'numeric'
    ),
    datasets: [{
      label: 'Average Values',
      data: Object.values(profileData.column_analysis)
        .filter(col => col.type === 'numeric')
        .map(col => col.stats.mean),
      backgroundColor: '#2196f3'
    }]
  };

  // Chart options with axis configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        ticks: {
          autoSkip: false
        }
      },
      y: {
        type: 'linear',
        beginAtZero: true
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Data Profile Report
      </Typography>

      {/* Overview Section */}
      <div className="section">
        <Typography variant="h6">Overview</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <strong>Rows:</strong> {profileData.overview.num_rows}
          </Grid>
          <Grid item xs={4}>
            <strong>Columns:</strong> {profileData.overview.num_columns}
          </Grid>
        </Grid>
      </div>

      {/* Numeric Columns Chart */}
      <div className="section" style={{ position: 'relative', height: '400px' }}>
        <Typography variant="h6">Numeric Columns Analysis</Typography>
        <Bar 
          data={numericChartData} 
          options={chartOptions}
          ref={(ref) => {
            if (ref) {
              chartRef.current = ref;
            }
          }}
        />
      </div>

      {/* Column Details */}
      {Object.entries(profileData.column_analysis).map(([colName, colData]) => (
        <div key={colName} className="section">
          <Typography variant="h6">{colName}</Typography>
          <pre>{JSON.stringify(colData, null, 2)}</pre>
        </div>
      ))}
    </Paper>
  );
}