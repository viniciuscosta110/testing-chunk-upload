import React, { useEffect, useState } from 'react';
import './App.css';
import { Dropzone } from "dropzone";

function App() {
  return (
    <>
      <form id="csv-upload" className="">
        <MyDropzone />
      </form>
    </>
  );
}

export default App;

function MyDropzone() {
  const [fileContent, setFileContent] = useState('');
  const [dropzoneElement, setDropzoneElement] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./abalone_app.csv');
        const content = await response.text();
        setFileContent(content);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (fileContent && !dropzoneElement) {
      const divTest = document.getElementById("dropzoneElement1");

      // Initialize Dropzone here after adding the element to the DOM
      const myDropzone = new Dropzone(divTest, {
        url: "/test", // Replace with your API endpoint
        chunking: true,
        parallelUploads: 2,
        chunkSize: 1000,
        params: {
          tp_planilha: 2,
        },
        init: function () {
          this.on("success", function (file, response) {
            console.log("File uploaded successfully.", response);
          });
          this.on("error", function (file, errorMessage) {
            console.error("Error uploading file.", errorMessage);
          });
        },
      });

      setDropzoneElement(myDropzone);
      
    }
  }, [fileContent]);

  useEffect(() => {
    if (fileContent && dropzoneElement) {
      const blob = new Blob([fileContent], { type: 'text/csv' });
      const file = new File([blob], 'yourFile.csv', { type: 'text/csv' });

      // Manually add the file to Dropzone
      dropzoneElement.addFile(file);
    }
  }, [fileContent, dropzoneElement]);

  return <div id="dropzoneElement1" style={{ display: 'none' }}></div>;
}
