// components/DataQualityView.js
import React from 'react';
import { Box, Button, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';

export default function DataQualityView({ report, onProceed }) {
  if (!report) return null;

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Data Quality Report
      </Typography>

      {/* Missing Values Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Missing Values Analysis
        </Typography>
        <List dense>
          {Object.entries(report.missing_values).map(([column, count]) => (
            <ListItem key={column}>
              <ListItemText
                primary={column}
                secondary={`Missing values: ${count}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Data Types Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Data Type Analysis
        </Typography>
        <List dense>
          {Object.entries(report.data_types).map(([column, dtype]) => (
            <ListItem key={column}>
              <ListItemText
                primary={column}
                secondary={`Data type: ${dtype}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Duplicates Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Duplicates Found: {report.duplicates}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={onProceed}
      >
        Proceed to Data Fixing
      </Button>
    </Paper>
  );
}