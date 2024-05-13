import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import HorizontalNestedMenu from '../../components/nestedmenu/HorizontalNestedMenu';
import LEditor from '../../components/leditor/LEditor';
import contractsf from '../../init/contracts.json';
import networks from '../../init/networks.json';
import ContractExplorer from '../contracts/contractexplorer/ContractExplorer';
import FnPlayGround from '../contracts/contractexplorer/fnplayground/FnPlayGround';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FunctionsIcon from '@mui/icons-material/Functions';
import ContractIcon from '@mui/icons-material/Description'; // Using Description as a stand-in for Contract
import TransactionIcon from '@mui/icons-material/SwapHoriz';
import Power from '@mui/icons-material/Power';

const Swagger = ({ functionOptions, templateData, talknojutsu }) => {
  const [hideSections, setHideSections] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleRefresh = () => {
    setApiData(getInitialApiData());
  };


  const getInitialApiData = () => {
    const accountEndpoints = {
      'create-account': {
        request: ['templateid'],
        response: ['status', 'data'],
      },
      'change-template': {
        request: ['templateid','userref'],
        response: ['status', 'data'],
      },
      'get-accounts': {
        request: ['template', 'user_ref'],
        response: ['status', 'data'],
      },
    };

    

    const scafunctionEndpoints = functionOptions.reduce((acc, label) => {
      const key = label.label;
      acc[key] = {
        request: ['param1', 'param2'],
        response: ['status', 'data'],
      };
      return acc;
    }, {});

    const cfunctionEndpoints = functionOptions.reduce((acc, label) => {
      const key = label.label;
      acc[key] = {
        request: ['param1', 'param2'],
        response: ['status', 'data'],
      };
      return acc;
    }, {});

    const TransactionEndpoints = {
      'gettrx': {
        request: ['userref','network','timestart','timeend'],
        response: ['timestamp', 'block','hash','trx details'],
      }
    };
    
    return {
      Account: accountEndpoints,
      "SCA Function": scafunctionEndpoints,
      "Contract Function": cfunctionEndpoints,
      Transaction: TransactionEndpoints,
    };
  };

  const [apiData, setApiData] = useState(getInitialApiData());

  const toggleSection = (section) => {
    if (hideSections.includes(section)) {
      setHideSections(hideSections.filter((item) => item !== section));
    } else {
      setHideSections([...hideSections, section]);
    }
  };

  const handleTemplateSubmit = (templateId) => {
    // Handle the template submission logic here
    console.log('Selected Template:', templateId); 
    var template = templateData.find((template) => template.id === parseInt(templateId));
    console.log(templateData,templateId,template);
    var talk=[];
    template.networks.forEach((newnw)=>{
      var nwname = networks.find((nwname) => nwname.id === newnw);
      talk.push("Generating SCA on "+nwname.label+" ... ");
    })
    talk.push("User Profile "+template.templateName+"_0000001 Generated");
    //get networks from templateId templateData
    talknojutsu(talk);
  };
  const iconMap = {
    Account: <AccountCircleIcon />,
    'SCA Function': <FunctionsIcon />,
    'Contract Function': <ContractIcon />,
    'Transaction': <TransactionIcon />
  };
  
  const backgroundStyles = {
    level1: {  "padding" : "0", }, // Lighter shade
    level2: { backgroundColor: '#f5f5f5' ,  "padding" : "0", "text-align":"center"}, // Medium shade
    level3: { backgroundColor: '#FFF',  "padding" : "0" }, // Darker shade
  };

  const summary = {
    level1: { "text-align":"center", "flex-grow":"1" }, // Lighter shade
    level2: {  "text-align":"center", "flex-grow":"1", background:"#2D0635",color:'#FFF'}, // Medium shade
    level3: { backgroundColor: '#FFF',  "padding" : "0" }, // Darker shade
  };

 const endpointstyle = {
  'Account': {  
    textAlign: "center", 
    flexGrow: 1, 
    background: "#1976D2", // Main blue color from your palette
    color: '#FFF' // White for contrast
  },
  'SCA Function': {  
    textAlign: "center", 
    flexGrow: 1, 
    background: "#1565C0", // A slightly darker shade of blue
    color: '#FFF' 
  },
  'Contract Function': {  
    textAlign: "center", 
    flexGrow: 1, 
    background: "#0D47A1", // An even darker shade for contrast
    color: '#FFF'
  },
  'Transaction': {
    textAlign: "center", 
    flexGrow: 1, 
    background: "#6EC6FF", // A lighter blue for secondary elements
    color: '#20262D' // Dark grey for readability
  }
};


  return (
    <div style={{ margin: '20px' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6"><Power/> API Endpoints</Typography>
        </AccordionSummary>
        <AccordionDetails sx={backgroundStyles.level1}>
          {Object.entries(apiData).map(([section, endpoints]) => (
            <Accordion key={section} defaultExpanded>
              <AccordionSummary sx={summary.level1} expandIcon={<ExpandMoreIcon />}>
              {iconMap[section]}
                <Typography sx={summary.level1} variant="subtitle1" >{section}</Typography>
              </AccordionSummary>
              <AccordionDetails >
                {Object.entries(endpoints).map(([endpoint, { request, response }]) => (
                  <Accordion key={endpoint}>
                    <AccordionSummary sx={endpointstyle[section]} expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle2"  >{endpoint}</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={backgroundStyles.level3}>
                    <div>
                        <Typography variant="body1" gutterBottom>Request Parameters:</Typography>
                        <List>
                          {request.map((param) => (
                            <ListItem key={param}>{param}: &lt;dummy {param}&gt;</ListItem>
                          ))}
                        </List>
                        <Typography variant="body1" gutterBottom>Response Properties:</Typography>
                        <List>
                          {response.map((property) => (
                            <ListItem key={property}>{property}: {'{dummy data}'}</ListItem>
                          ))}
                        </List>
                      </div>
                      {endpoint === 'create-account' && (
                        <div>
                          <FormControl fullWidth>
                            <InputLabel>Select a template</InputLabel>
                            <Select
                              value={selectedTemplate}
                              onChange={(e) => setSelectedTemplate(e.target.value)}
                              label="Select a template"
                            >
                              {templateData.map((template) => (
                                <MenuItem key={template.id} value={template.id}>
                                  {template.templateName}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Button variant="contained" color="primary" onClick={() => handleTemplateSubmit(selectedTemplate)}>POST</Button>
                        </div>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Swagger;