import React, { useState, createContext } from 'react';
import ImageViewer from "../components/ImageViewer";
import FileUpload from "../components/FileUpload"
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';

export const FileContext = createContext();

const ViewImage = () => {
  const [file, setFile] = useState(null)
  const handleUpload = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile)
    console.log("logging drop/selected file",uploadedFile);
  };

  return (
    <FileContext.Provider value={{file, handleUpload}}>
      <div className="App">
          <Typography variant="h1">Image Viewer</Typography>
          <FileUpload />
          <ImageViewer />
      </div>
    <Button variant="text" size="small">Text</Button>
    <Button variant="contained">Contained</Button>
    <Button variant="outlined">Outlined</Button>
    </FileContext.Provider>     
  )
};

export default ViewImage;