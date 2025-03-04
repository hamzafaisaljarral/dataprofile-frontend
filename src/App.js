import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from './components/FileUploader';
import ProfileViewer from './components/ProfileView';
import './App.css';

function App() {
  console.log("check");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);  // Key must be 'file' to match FastAPI's File(...)
  
      const response = await axios.post(
        'http://localhost:8000/api/profile/',
          formData,
          {
              withCredentials: true,  // Required for cookies/sessions
          headers: {
              'Content-Type': 'multipart/form-data',
              'Access-Control-Request-Headers': '*'  // Explicit CORS headers
          }
          }
);
  
      setProfileData(response.data);
      setError('');
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Error processing file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>CSV Data Profiler</h1>
        <FileUploader onFileSelect={handleFileUpload} />
        {loading && <p>Analyzing your file...</p>}
        {error && <p className="error">{error}</p>}
      </header>

      {profileData && <ProfileViewer profileData={profileData} />}
    </div>
  );
}

export default App;