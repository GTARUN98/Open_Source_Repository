import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Container,
  Typography,
  TextField,
  Button,
  Input
} from "@material-ui/core";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  // Initialize state variables for form fields
  const [component, setComponent] = useState("");
  const [domain, setDomain] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");
  const [language, setLanguage] = useState("");
  const [functionality, setFunctionality] = useState("");
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate()
  // Function to handle file upload
  
  
useEffect(()=>{
  console.log(`file name is changed to ${fileName}`)
},[fileName])

async function handleUpload() {
  try {
    setUploading(true);

    const formData = new FormData();
    formData.append('profileImage', file);
    console.log(`file is `,file)
    setFileName(file.name)
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      // handle success
    } else {
      throw new Error('Upload failed');
    }
  } catch (error) {
    // handle error
  } finally {
    setUploading(false);
  }
}

function handleFileUpload(event) {
  setFile(event.target.files[0]);
}
  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(
      component,
      domain,
      fileName,
      operatingSystem,
      functionality,
      description,
      language
    );

    // Check if all fields are filled
    if (
      component &&
      domain &&
      operatingSystem &&
      language &&
      functionality &&
      fileName &&
      description
    ) {
      
      const res = await fetch("/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          //server does'nt undestand json dat so we have tostringify it
          component,
          domain,
          operatingSystem,
          language,
          functionality,
          fileName,
          description,
        }),
      });
      const response = await res.json()
      console.log(`response from authenticate is ${response}`)
      if (res.status === 200) {
        console.log(`ipfs hash is made succesfully`);
       console.log(`response from /authenticate api is `,response.functionality);
        localStorage.setItem("functionality",response.functionality)
        localStorage.setItem("component",response.component)
        localStorage.setItem("language",response.language)
        localStorage.setItem("operatingSystem",response.operatingSystem)
        localStorage.setItem("date",response.date)
        localStorage.setItem("domain",response.domain)
        localStorage.setItem("fileHash",response.fileHash)
        localStorage.setItem("description",response.description)
        navigate('/transaction')
        
      }
    } else {
      console.log("Please fill all the fields.");
    }
  };

  return (
    <>
    <NavBar/>
    <Container
      maxWidth="xs"
      style={{
        marginTop: "4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography>Make A Block</Typography>
      <Box style={{ marginTop: "15px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="component"
              id="component"
              required
              fullWidth
              label="Component"
              onChange={(e) => {
                setComponent(e.target.value);
              }}
              value={component}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="domain"
              id="domain"
              required
              fullWidth
              label="Domain"
              onChange={(e) => {
                setDomain(e.target.value);
              }}
              value={domain}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="operatingSystem"
              id="operatingSystem"
              required
              fullWidth
              label="Operting System"
              onChange={(e) => {
                setOperatingSystem(e.target.value);
              }}
              value={operatingSystem}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="language"
              id="language"
              required
              fullWidth
              label="language"
              onChange={(e) => {
                setLanguage(e.target.value);
              }}
              value={language}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="functionality"
              id="functionality"
              required
              fullWidth
              label="functionality"
              onChange={(e) => {
                setFunctionality(e.target.value);
              }}
              value={functionality}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              id="description"
              required
              fullWidth
              label="description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
          </Grid>
          <Grid item xs={12}>
          <div>
      <Typography variant="h3">Upload File</Typography>
      <input
        type="file"
        onChange={handleFileUpload}
      />
      <Button
        variant="contained"
        color="default"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
            
          </Grid>
        </Grid>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          style={{ marginTop: "15px", marginBottom: "3px" }}
        >
          Make A Block
        </Button>
      </Box>
    </Container>
    </>
  );
};

export default HomePage;