import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { IconContext } from 'react-icons';
import SVG from 'react-inlinesvg';
import * as ChainIcons from "@thirdweb-dev/chain-icons";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import QueueIcon from '@mui/icons-material/Queue';
import DoneIcon from '@mui/icons-material/Done';
import PunchClock from '@mui/icons-material/PunchClock';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import networks from '../../init/networks.json';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const TrxQueue = ({ functionOptions, templateData, talknojutsu }) => {


  const [hideSections, setHideSections] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleRefresh = () => {
    setQueueData(getInitialQueueData());
  };

  const IComponent = ({ value }) => {
    const IconComponent = ChainIcons[value] || (() => <img src={`/images/${value}.svg`} height="15" />);

    return (
      <IconContext.Provider>{IconComponent && <IconComponent height={15} />}</IconContext.Provider>
    );
  };
  const getChainIcon = (chainId) => {
    const network = networks.find(element => element.id === chainId);
    return network ? network.icon : null;
  };
  const getInitialQueueData = () => {
    
    return {
      Processing: [
        { id: 'Trx 1', chainid: 'ethereum', timestamp: '2022-09-01 10:00:00', msg: 'Processing payment' },
        { id: 'Trx 2', chainid: 'solana', timestamp: '2022-09-01 10:05:00', msg: 'Transferring assets' }
      ],
      Queuing: [
        { id: 'Trx 3', chainid: 'bsc', timestamp: '2022-09-01 10:10:00', msg: 'Queuing order' },
        { id: 'Trx 4', chainid: 'cosmos', timestamp: '2022-09-01 10:15:00', msg: 'Awaiting confirmation' }
      ],
      Completed: [
        { id: 'Trx 5', chainid: 'ethereum', timestamp: '2022-09-01 09:55:00', msg: 'Payment completed' },
        { id: 'Trx 6', chainid: 'solana', timestamp: '2022-09-01 09:50:00', msg: 'Asset transfer complete' }
      ]
    };
  };

  const [queueData, setQueueData] = useState(getInitialQueueData());

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

   const iconMapping = {
    Processing: <HourglassEmptyIcon />,
    Queuing: <QueueIcon />,
    Completed: <DoneIcon />,
  };
  const backgroundStyles = {
    level1: { backgroundColor: '#f5f5f5' , "padding" : "0"}, // Lighter shade
  };
  return (
    <div style={{ margin: '20px' }}>
      <div>
    
          <Typography variant="h4"><SwapHorizIcon/> Transaction</Typography>

        <AccordionDetails sx={backgroundStyles.level1}>
          {Object.entries(queueData).map(([section, transactions]) => (
            <Accordion key={section} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <ListItemIcon>{iconMapping[section]}</ListItemIcon>
                <Typography variant="subtitle1">{section}</Typography>
              </AccordionSummary>
              <AccordionDetails>
              <List>
                  {transactions.map((transaction, index) => (
                    <ListItem key={index}>
                          <ListItemIcon><IComponent value={getChainIcon(transaction.chainid)} /></ListItemIcon>
                      <ListItemText 
                        primary={`${transaction.id} - Time: ${transaction.timestamp} | Msg: ${transaction.msg}`} 
                      />
                       
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionDetails>
      </div>
    </div>
  );
};

export default TrxQueue;