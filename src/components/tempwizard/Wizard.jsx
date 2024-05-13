import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, TextField, Grid } from '@mui/material';

import auth from '../../init/auth.json';

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGoogle, FaTelegram } from 'react-icons/fa';
import { FiKey } from 'react-icons/fi'; // Example for API Secret
import { MdOutlineSms, MdSecurity } from 'react-icons/md'; // Examples for SMS OTP and Google Authenticator OTP
import * as ChainIcons from "@thirdweb-dev/chain-icons";
import networks from '../../init/networks.json';
import { IconContext } from 'react-icons';
import './Wizard.css';;

const Wizard = ({ deployTemplate, functionOptions }) => {
  const [step, setStep] = useState(1);
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [selectedAuthMethods, setSelectedAuthMethods] = useState([]);
  const [templateName, setTemplateName] = useState('');
  
  const getAuthIcon = (method) => {
    const icons = {
      facebook: <FaFacebookF />,
      userpass: <FiKey />,
      instagram: <FaInstagram />,
      linkedin: <FaLinkedinIn />,
      google: <FaGoogle />,
      telegramchat:<FaTelegram/>,
      apiSecret: <FiKey />,
      googleAuth: <MdSecurity />,
      smsOTP: <MdOutlineSms />,
    };
  
    return icons[method] || <FiKey />; // Default icon if none matched
  };
  const toggleAuthMethod = (method) => {
    if (selectedAuthMethods.includes(method)) {
      setSelectedAuthMethods((prev) => prev.filter((item) => item !== method));
    } else {
      setSelectedAuthMethods((prev) => [...prev, method]);
    }
  };
  
  const handleNextStep = () => setStep((prevStep) => prevStep + 1);
  const handlePreviousStep = () => setStep((prevStep) => prevStep - 1);

  const handleNetworkSelection = (network) => {
    setSelectedNetworks((prevSelected) =>
      prevSelected.includes(network) ? prevSelected.filter((n) => n !== network) : [...prevSelected, network]
    );
  };

  const handleFunctionSelection = (func) => {
    setSelectedFunctions((prevSelected) =>
      prevSelected.includes(func) ? prevSelected.filter((f) => f !== func) : [...prevSelected, func]
    );
  };

  const handleAuthMethodSelection = (method) => {
    setSelectedAuthMethods((prevSelected) =>
      prevSelected.includes(method) ? prevSelected.filter((m) => m !== method) : [...prevSelected, method]
    );
  };

  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
  };

  const handleDeploy = () => {
    const templateData = {
      networks: selectedNetworks,
      functions: selectedFunctions,
      auth: selectedAuthMethods,
      templateName: templateName,
    };

    deployTemplate(templateData);
    setStep(1);
  };

  const IComponent = ({ value }) => {
    const IconComponent = ChainIcons[value] || (() => <img src={`/images/${value}.svg`} height="25" />);
  
    return (
      <div>
        <IconContext.Provider >{IconComponent && <IconComponent height={25} />}</IconContext.Provider>
      </div>
    );
  };



  return (
    <Box className="wizard-container" sx={{ width: '100%', padding: 2 }}>
      <Typography variant="h4" gutterBottom>SCA Template Creation</Typography>
<div className="step-container wizard">
      {step === 1 && (
        <Box>
          <Typography variant="h6">Step 1: Select Chain(s)</Typography>
          <Grid  container spacing={2}>
            {networks.map((option) => (
              <Grid  item xs={12} sm={6} md={4} lg={3} key={option.id}>
                <Card  className={selectedNetworks.includes(option.id) ? 'selected' : 'default'}
                  sx={{ padding: 2, cursor: 'pointer'}}
                  onClick={() => handleNetworkSelection(option.id)}
                >
                  <IComponent value={option.icon} />
                  <Typography>{option.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        
        </Box>
      )}

      {step === 2 && (
        <Box>
          <Typography variant="h6">Step 2: Select Functions</Typography>
          <Grid container spacing={2}>
            {functionOptions.map((option) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={option.value}>
                <Card  className={selectedFunctions.includes(option.value) ? 'selected' : 'default'}
                  sx={{ padding: 2, cursor: 'pointer' }}
                  onClick={() => handleFunctionSelection(option.value)}
                >
                  <Typography>{option.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          
        </Box>
      )}

      {step === 3 && (
      
         <Box>
          <Typography variant="h6">Step 3: Supported Auth Methods</Typography>
          <Grid container spacing={2}>
            {auth.map((option) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={option.value}>
                <Card className={selectedAuthMethods.includes(option.value) ?  'selected' : 'default'}
                  sx={{ padding: 2, cursor: 'pointer', backgroundColor: selectedAuthMethods.includes(option.value) ? 'primary.main' : 'default' }}
                  onClick={() => handleAuthMethodSelection(option.value)}
                >
                    {React.cloneElement(getAuthIcon(option.value), { fontSize: 'large' })} {/* Increase icon size */}
                  <Typography>{option.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
       
        </Box>
  
      )}

      {step === 4 && (
        <Box>
          <Typography variant="h6">Step 4: Template Name</Typography>
          <TextField
            fullWidth
            label="Template Name"
            value={templateName}
            onChange={handleTemplateNameChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
  
        </Box>
      )}
      </div>
         
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 ,'padding':'15px' }}>
    <Button 
      variant="outlined" 
      onClick={handlePreviousStep}
      style={{ visibility: step > 1 ? 'visible' : 'hidden' }} // Hide the button by changing visibility
    >
      Previous
    </Button>
    {step < 4 ? (
      <Button variant="contained" onClick={handleNextStep}>Next</Button>
    ) : (
      <Button variant="contained" onClick={handleDeploy} disabled={templateName.trim() === ''}>Generate</Button>
    )}
  </Box>
  
    </Box>
  );
};

export default Wizard;
