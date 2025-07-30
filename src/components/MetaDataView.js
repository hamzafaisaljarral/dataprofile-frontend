import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Paper, Box
} from '@mui/material';

function MetadataView({ metadata }) {
  if (!metadata || !metadata.columns) {
    return <Typography>No metadata available.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Metadata for Dataset ID: <strong>{metadata.dataset_id}</strong>
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Tags</strong></TableCell>
              <TableCell><strong>Glossary Terms</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {metadata.columns.map((col, index) => (
              <TableRow key={index}>
                <TableCell>{col.name}</TableCell>
                <TableCell>{col.type}</TableCell>
                <TableCell>{col.description}</TableCell>
                <TableCell>{col.tags.join(', ')}</TableCell>
                <TableCell>{col.glossary_terms.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MetadataView;