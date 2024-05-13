import React, { useState } from 'react';
import { Grid } from '@mui/material';
import ProjectList from '../../components/project/ProjectList'
import Wizard from "../../components/tempwizard/Wizard";
import './Templates.css';


const Templates = ({contacts, setInitialProjects , initialProjects, deployTemplate, functionOptions, updatesecret}) => {

  const [name, setName] = useState('');
  const [chain, setChain] = useState('');
  const [address, setAddress] = useState('');
  const [editingContact, setEditingContact] = useState(null);
  const supportedChains = ['Ethereum', 'Algorand', 'Solana', 'Stellar', 'Avalanche', 'Hedera'];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Wizard deployTemplate={deployTemplate}  functionOptions={functionOptions} />
      </Grid>
      <Grid item xs={12} md={6}>
        <ProjectList projects={initialProjects} updatesecret={updatesecret} setProjects={setInitialProjects} />
      </Grid>
    </Grid>
  );
};


export default Templates;
