import React, { useState } from 'react';
import { Card, Stepper, Box, Step, StepLabel, Button, TextField } from '@mui/material';
import './Integration.css';

const Integration = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [ghSecretKey, setSecretKey] = useState('');
  
  const [ghPath, setghPath] = useState('');
  
  const [cloudflareId, setCloudflareId] = useState('');
  const [cloudflareApi, setCloudflareApi] = useState('');
  
  const [cloudflarepath, setcloudflarepath] = useState('');

  const steps = ['Github', 'Cloudflare'];

  const handleNext = () => {
    if(activeStep === steps.length - 1){
console.log(ghSecretKey,ghPath,cloudflareId,cloudflareApi,cloudflarepath);
var input ={setting:[{key:'cloudflare',value:{id:cloudflareId, secret:cloudflareApi, url:cloudflarepath}},{key:'github',value:{owner:ghPath, secret:ghSecretKey}}]};
console.log(JSON.stringify(input));

      fetch(`https://api.adappter.xyz/platform/integrate/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.login}`
        },
        body: JSON.stringify(input)
      })
      .then(response => {
        console.log('ai');
        if (!response.ok) {
          throw new Error('Session validation failed');
        }
        return response.json(); // Assuming the server responds with JSON
      })
      .then(data => {
        console.log(data);
        
        
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }else{
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleOwnerChange = (event) => {
    setghPath(event.target.value);
  };
  const handleSecretKeyChange = (event) => {
    setSecretKey(event.target.value);
  };

  const handleCloudflareIdChange = (event) => {
    setCloudflareId(event.target.value);
  };

  const handleCloudflareApiChange = (event) => {
    setCloudflareApi(event.target.value);
  };

  const handleCloudflareurlChange = (event) => {
    setcloudflarepath(event.target.value);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="step-container">
            <img src="/images/github-mark.svg" width="200px" alt="GitHub"/>
            <div className="field-label">Github Owner / Path</div>
            <TextField
              fullWidth
              variant="outlined"
              value={ghPath}
              onChange={handleOwnerChange}
              className="text-field"
            />
            <div className="field-label">Github Secret</div>
            <TextField
              fullWidth
              variant="outlined"
              value={ghSecretKey}
              onChange={handleSecretKeyChange}
              className="text-field"
            />
            
            <p></p>
          </div>
        );
      case 1:
        return (
          <div className="step-container">
            <img src="/images/cloudflare_logo.png" width="200px" alt="Cloudflare"/>
            <div className="field-label">Cloudflare ID</div>
            <TextField
              fullWidth
              variant="outlined"
              value={cloudflareId}
              onChange={handleCloudflareIdChange}
              className="text-field"
            />
            <div className="field-label">Cloudflare API</div>
            <TextField
              fullWidth
              variant="outlined"
              value={cloudflareApi}
              onChange={handleCloudflareApiChange}
              className="text-field"
            />
            <div className="field-label">Base URL</div>
            <TextField
              fullWidth
              variant="outlined"
              value={cloudflarepath}
              onChange={handleCloudflareurlChange}
              className="text-field"
            />
            <p></p>
          </div>
        );
      default:
        return 'Unknown Step';
    }
  };

  return (
    <div className='integration'>
      <Box className="integration-container">
        <Stepper activeStep={activeStep} className="stepper-container">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box className="content-box">
            <Card variant="outlined"> {getStepContent(activeStep)} </Card>
          </Box>

          <Box className="action-buttons">
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
    </div>
  );
};

export default Integration;
