import React from 'react';
import { Drawer, Button, Tab, useTheme, useMediaQuery } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import './RightPanel.css';

const RightPanel = ({ handleCloseDeploy, panelIsVisible, setPanelIsVisible, functionOptions, handleLogout, templateData, talknojutsu }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const toggleVisibility = () => {
    setPanelIsVisible(!panelIsVisible);
  };

  const drawerWidth = isMobile ? 320 : 540; // Smaller drawer width for mobile
  const toggleTabPosition = panelIsVisible ? (drawerWidth - 35) : (-35);

  return (
    <div class="right-panel">
      <Drawer
        anchor="right"
        open={panelIsVisible}
        onClose={toggleVisibility}
        variant="temporary"// Drawer can be dismissed on mobile
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <div className='main'>
          ACTIVE 
          -- a bunch of jobs here ---
          <button onClick={handleCloseDeploy}>Close Deployment</button>
        </div>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            width: '100%',
            marginTop: 'auto',
            backgroundColor: 'transparent',
            color: '#000',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
          startIcon={<ExitToAppIcon />}
        >
          Logout
        </Button>
      </Drawer>

      { ( // Hide the toggle button on mobile
       <Tab
       sx={{
         display: 'flex', // Use flexbox for layout
         justifyContent: 'center', // Center the content
         alignItems: 'center', // Align items vertically
         position: 'fixed',
         top: '50%',
         right: toggleTabPosition,
         width: 'auto', // Set a fixed width if necessary
         minWidth: '120px', // Ensure it's wide enough for the largest content
         transform: 'translateY(-50%) rotate(90deg)',
         zIndex: 1300,
         height:'48px',
         backgroundColor: '#f7c41e',
         color: "#FFF",
         borderRadius: '0px 0px 5px 5px',
         minHeight: '48px',
         transition: 'all 0.3s ease', // Smooth transition for background and color change
         '&:hover': {
           backgroundColor: '#FFF',
           color: '#115293',
         },
       }}
       icon={<span style={{ display: 'flex', alignItems: 'center' }}>{panelIsVisible ? '▲' : '▼'} </span>} // Wrap the icon and text in a span with flex
       onClick={toggleVisibility}
     />
      )}
    </div>
  );
};

export default RightPanel;
