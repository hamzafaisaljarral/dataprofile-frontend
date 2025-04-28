import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from './components/FileUploader';
import ProfileViewer from './components/ProfileView';
import DataQualityView from './components/DataQualityView';
import FixedDataPreview from './components/FixedDataPreview';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import './App.css';

const STEPS = {
  UPLOAD: 'upload',
  QUALITY: 'quality',
  FIXED: 'fixed',
  PROFILE: 'profile'
};

function App() {
  const [currentStep, setCurrentStep] = useState(STEPS.UPLOAD);
  const [fileId, setFileId] = useState(null);
  const [qualityReport, setQualityReport] = useState(null);
  const [fixedData, setFixedData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. First API Call - Upload and Get Quality Report
  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Call UPLOAD endpoint
      const response = await axios.post(
        'http://localhost:8880/api/upload/',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      console.log("upload response:", response.data)
      if (!response.data.file_id || !response.data.report) {
        throw new Error("Invalid response from server");
      } 

      setFileId(response.data.file_id);
      setQualityReport(response.data.report);
      setCurrentStep(STEPS.QUALITY);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. Second API Call - Fix Data
  const handleFixData = async () => {
    try {
      setLoading(true);
      
      // Call FIX-DATA endpoint
      const response = await axios.post(
        'http://localhost:8880/api/fix-data/',
        { file_id: fileId },
        {
          headers:{
            "Content-Type":"application/json", 
          }
        }
      );
      console.log("fixed_Data:", response.data);
      setFixedData(response.data); 
      setCurrentStep(STEPS.FIXED);
    } catch (err) {
      setError(err.response?.data?.detail || 'Data fixing failed');
    } finally {
      setLoading(false);
    }
  };
  

  // 3. Third API Call - Generate Profile
  const handleGenerateProfile = async () => {
    try {
      setLoading(true);
      
      // Call PROFILE endpoint
      const response = await axios.post(
        'http://localhost:8880/api/profile/',
        { file_id: fileId },
        {
          headers:{
            "Content-Type":"application/json", 
          }
        }
      );
      
      setProfileData(response.data);
      setCurrentStep(STEPS.PROFILE);
    } catch (err) {
      setError(err.response?.data?.detail || 'Profile generation failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case STEPS.QUALITY:
        return <DataQualityView report={qualityReport} onProceed={handleFixData} />;
      
      case STEPS.FIXED:
        return <FixedDataPreview 
        data={fixedData}  // Pass the full response object
        onProceed={handleGenerateProfile}
      />;
      
      case STEPS.PROFILE:
        return <ProfileViewer profileData={profileData} />;
      
      default:
        return <FileUploader onFileSelect={handleFileUpload} />;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Data Quality Pipeline</h1>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
      </header>
      
      <Box sx={{ p: 3 }}>
        {renderStepContent()}
      </Box>
    </div>
  );
}

export default App;