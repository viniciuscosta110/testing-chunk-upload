import React, { useEffect, useState } from 'react'

import './App.css'
import { Dropzone } from "dropzone";
function App() {
  return (
    <>
      <form id="csv-upload" className="">
       <MyDropzone />
      </form>
    </>
  )
}

export default App

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
    if(fileContent) {
      const existingElement = document.getElementById("dropzoneElement1");
      if (!existingElement) {
        const divTest = document.createElement("div");
        divTest.setAttribute('id', 'dropzoneElement1');
        divTest.style.opacity = '0';
        document.getElementById("root").appendChild(divTest);
      }

      const myDropzone = new Dropzone(
        "div#dropzoneElement1", {
          url: "/test", // Replace with your API endpoint
          chunking: true,
          parallelUploads: 2, // Adjust based on your requirements
          chunkSize: 1000, // Set the chunk size (bytes)
          params: {
            tp_planilha: 2, // Additional parameters if needed
          },
          init: function () {
            this.on("success", function (file, response) {
              console.log("File uploaded successfully.", response);
            });
            this.on("error", function (file, errorMessage) {
              console.error("Error uploading file.", errorMessage);
            });
          },
        }
      );
  
      setDropzoneElement(myDropzone)
    }
  }, [fileContent]);

  useEffect(() => {
    if(fileContent && dropzoneElement) {
      const blob = new Blob([fileContent], { type: 'text/csv' });

      // Create a File object
      const file = new File([blob], 'yourFile.csv', { type: 'text/csv' });


      // Set the files property of the file input
      dropzoneElement.files = [file];

      // Trigger a change event to notify any change listeners
      
      console.log(dropzoneElement.addFile(file))
    }
    
  }, [fileContent, dropzoneElement]);
}

