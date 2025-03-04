import React from 'react';
import { Button, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function FileUploader({ onFileSelect }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        id="csv-upload"
        hidden
      />
      <label htmlFor="csv-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<UploadFileIcon />}
        >
          Upload CSV
        </Button>
      </label>
      <Typography variant="caption" sx={{ mt: 1 }}>
        Supported format: .csv
      </Typography>
    </div>
  );
}