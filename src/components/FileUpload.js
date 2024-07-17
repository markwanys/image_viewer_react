import React, { useContext  } from "react";
import Dropzone from "react-dropzone";
import { FileContext } from "../pages/ViewImage";
import Button from '@mui/material/Button';

const FileUpload = () => {
  const { file, handleUpload } = useContext(FileContext)

  return (
    <FileContext.Provider value={file}>
      <div className="main-container">
        <Dropzone onDrop={handleUpload} accept="image/*" minSize={1024} maxSize={3072000}>
          {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
            const additionalClass = isDragAccept ? "accept" : isDragReject ? "reject" : "";

            return (
              <div
                {...getRootProps({
                  className: `dropzone ${additionalClass}`,
                })}
              >
                <input {...getInputProps()} />
                <Button variant="outlined" size="large">Drag & drop images, or click to select files</Button>
              </div>
            );
          }}
        </Dropzone>
      </div>
    </FileContext.Provider>
  );
};

export default FileUpload;