import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress
} from '@mui/material';

export default function FixedDataPreview({ data, onProceed }) {
  // Debug: Always log the incoming data
  console.log('FixedDataPreview received:', data);

  // Loading state
  if (data === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state - no data received
  if (!data || typeof data !== 'object') {
    return (
      <Typography color="error" sx={{ p: 3 }}>
        Error: Invalid data received from server
      </Typography>
    );
  }

  // Check for cleaned_data specifically
  if (!data.cleaned_data || !Array.isArray(data.cleaned_data)) {
    return (
      <Typography color="error" sx={{ p: 3 }}>
        Error: No cleaned data available in response
      </Typography>
    );
  }

  const cleanedData = data.cleaned_data;

  // Get column names from first item
  const columns = cleanedData.length > 0 ? Object.keys(cleanedData[0]) : [];

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Cleaned Data (Complete Dataset)
      </Typography>

      {columns.length > 0 ? (
        <TableContainer sx={{ maxHeight: '70vh', overflow: 'auto', mb: 3 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col}>
                    <Typography fontWeight="bold">{col}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {cleanedData.map((row, index) => (
                <TableRow key={`row-${index}`}>
                  {columns.map((col) => (
                    <TableCell key={`${index}-${col}`}>
                      {String(row[col] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography sx={{ p: 2 }}>No columns to display</Typography>
      )}

      <Button
        variant="contained"
        onClick={onProceed}
        sx={{ mt: 2 }}
      >
        Generate Profile
      </Button>
    </Paper>
  );
}