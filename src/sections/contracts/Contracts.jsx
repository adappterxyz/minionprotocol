import React, { useState, useRef } from 'react';
import { Typography, Button, TextField, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import HorizontalNestedMenu from '../../components/nestedmenu/HorizontalNestedMenu';
import LEditor from '../../components/leditor/LEditor';
import contractsf from '../../init/contracts.json';
import networks from '../../init/networks.json';
import ContractExplorer from '../../components/contracts/contractexplorer/ContractExplorer';
import FnPlayGround from '../../components/contracts/contractexplorer/fnplayground/FnPlayGround';

import './Contracts.css';

const Contracts = () => {
  const [showAddFnGroup, setShowAddFnGroup] = useState(false);
  const [showAddExisting, setShowAddExisting] = useState(false);
  const [showDeployNew, setShowDeployNew] = useState(false);
  const [showFn, setShowFn] = useState(false);
  const [newContractAddress, setNewContractAddress] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [chain, setChain] = useState("");
  const [address, setAddress] = useState('');
  const [language, setLanguage] = useState("js");
  const [displayState, setDisplayState] = useState(0);
  const iconMap = networks.reduce((acc, chain) => {
    acc[chain.id] = chain.icon;
    return acc;
  }, {});

  const handleAddExistingClick = () => {
    setShowAddExisting(true);
    setShowDeployNew(false);
  };

  const handleGetCode = (ret) => {
    console.log(ret);
    setDisplayState(3);
    if (ret[0] === "fn") {
      setShowFn(true);
    } else {
      // Other logic here
    }
  };

  const handleChainChange = (chainid) => {
    console.log(chainid);
    setChain(chainid);
    var el = networks.find(element => element.id === chainid);
    console.log(el);
    setLanguage(el.language);
  };

  const handleAddFunctionGroup = () => {
    setShowAddFnGroup(true);
  };

  const handleDeployNewClick = () => {
    setShowDeployNew(true);
    setShowAddExisting(false);
  };

  const handleNewContractAddressChange = (event) => {
    setNewContractAddress(event.target.value);
  };
  const scrollContainerRef = useRef(null);
  const handleWheel = (e) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  };
  const handleCompile= (event)=>{
//test compile solidity / rust / or wadeva...
//https://github.com/ethereum/solc-js
//https://applied-math-coding.medium.com/compiling-rust-to-webassembly-and-consuming-within-a-browser-1ec8326aeed1

console.log();

  }
  return (
    <div class="contracts">
    <Grid container spacing={2} sx={{ maxWidth: 1200, margin: 'auto', padding: 2, overflow: 'hidden' }}>
      <Grid item xs={12}>
        <Card>
        <CardContent onWheel={handleWheel}  sx={{ overflow: 'visible' }}>

            <HorizontalNestedMenu data={contractsf} icon={iconMap} getcode={handleGetCode} setState={setDisplayState} setChain={handleChainChange} style={{"width":"500px"}}/>
          </CardContent>
          <CardActions>
            {/* Button logic */}
            {displayState === 1 && (
              <Button onClick={handleAddFunctionGroup}>Add Function Group</Button>
            )}
            {displayState === 2 && (
              <>
                <Button onClick={handleAddExistingClick}>Add Existing Contract</Button>
                <Button onClick={handleDeployNewClick}>Deploy New Contract</Button>
                
                <Box sx={{ textAlign: 'right', flexGrow: 1 }}>
                  <Button variant="outlined" color="error">
                    Delete Function Group
                  </Button>
                </Box>
              </>
            )}
            {displayState === 3 && (
              <Box sx={{ textAlign: 'right', flexGrow: 1 }}>
                <Button variant="outlined" color="error">
                  Remove Contract
                </Button>
              </Box>
            )}
          </CardActions>
          {displayState === 3 && (
            <ContractExplorer chainid={chain} chainAddress={address} language={language} />
          )}
          {(showFn && displayState === 3) && (
            <FnPlayGround chainid={chain} chainAddress={address} language={language} />
          )}
        </Card>
      </Grid>

      {displayState === 1 && showAddFnGroup && (
        <Grid item xs={12}>
          <Card>
            <CardContent xs={6}>
              <Typography variant="h6">Function Group Name</Typography>
              <TextField 
               sx={{ 
                '& .MuiInputBase-input': { // Targeting the input element inside TextField
                  textAlign: 'center',
                },}}
                 label="Function group name" value={newContractAddress} onChange={handleNewContractAddressChange} fullWidth margin="normal" />
            </CardContent>
            <CardActions>
              <Button variant="outlined">Add Existing Contract</Button>
              <Button variant="outlined">Deploy New Contract</Button>
              
            </CardActions>
          </Card>
        </Grid>
      )}

      {displayState === 2 && showAddExisting && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Add Existing Contract</Typography>
              <TextField  sx={{ 
                '& .MuiInputBase-input': { // Targeting the input element inside TextField
                  textAlign: 'center',
                },}}
                label="Contract Address" value={newContractAddress} onChange={handleNewContractAddressChange} fullWidth margin="normal" />
            </CardContent>
            <CardActions>
              <Button variant="outlined">Analyze</Button>
              <Button variant="contained">Add</Button>
            </CardActions>
          </Card>
        </Grid>
      )}

      {displayState === 2 && showDeployNew && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Deploy New Contract</Typography>
              <LEditor codeSnippet={codeSnippet} setCodeSnippet={setCodeSnippet} chain={chain} state="0" language={language} />
            </CardContent>
            <CardActions>
              <Button variant="outlined" onClick={handleCompile}>Compile</Button>
              <Button variant="outlined">Deploy</Button>
              <Button variant="contained">Add</Button>
            </CardActions>
          </Card>
        </Grid>
      )}
    </Grid></div>
  ); 

};

export default Contracts;