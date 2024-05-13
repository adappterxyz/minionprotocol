import React, { useState, useEffect, useRef } from 'react';
import * as ChainIcons from "@thirdweb-dev/chain-icons";
import * as Icons from 'react-icons/fa';
import { Box, Typography, Button, Card, IconButton, Tooltip  } from '@mui/material';
import networkdata from '../../init/networks.json';
import { IconContext } from 'react-icons';
import data from '../../init/project.json';
import './ProjectList.css';

import { FaFacebookF, FaInstagram, FaLinkedinIn, FaGoogle, FaTelegram , FaArrowRight } from 'react-icons/fa';
import { FiKey } from 'react-icons/fi'; // Example for API Secret
import { MdOutlineSms, MdSecurity } from 'react-icons/md'; // Examples for SMS OTP and Google Authenticator OTP

const getAuthIcon = (method) => {
  const icons = {
    facebook: <FaFacebookF />,
    userpass: <FiKey />,
    instagram: <FaInstagram />,
    linkedin: <FaLinkedinIn />,
    google: <FaGoogle />,
    apiSecret: <FiKey />,
    telegramchat:<FaTelegram/>,
    googleAuth: <MdSecurity />,
    smsOTP: <MdOutlineSms />,
  };

  return icons[method] || <FiKey />; // Default icon if none matched
};

const ProjectList = ({ projects, setProjects, setActiveItem, updatesecret}) => {
  const iconData = networkdata;
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const containerRef = useRef(null);
  const itemHeight = 200; // Assuming each project item has a height of 200px
  const itemsPerPage = 4; // Number of visible projects per page
  const [direction, setDirection] = useState(null);
  const touchStartRef = useRef(null);
  const [totalHeight, setTotalHeight] = useState(0);
  const [apiSecret, setApiSecret] = useState("");
  const [secretVisible, setSecretVisible] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
 
  
//  

const generateSecret = async (name) => { 
  setSecretVisible(true);
  setApiSecret("Generating secret.... Please wait");
  const secret= await updatesecret(name); 
  console.log(secret); 
  setApiSecret(secret);
 }
  const getModifiedArray = (initialPosition) => {
    var arr = [];
    for (var i = 0; i < projects.length; i++) {
      arr.push(i);
    }
    const modifiedArr = [...arr];
    const position = (initialPosition - 1) % modifiedArr.length;
    return [...modifiedArr.slice(position), ...modifiedArr.slice(0, position)];
  };

  const scrollUp = () => {
    // Scrolling up
    setDirection("up");
    var vpos = [];
    var currentScrollPos = prevScrollPos - 1;
    if (currentScrollPos < 0 || prevScrollPos > 3) {
      var sorted = getModifiedArray(currentScrollPos);
      currentScrollPos = sorted[0];

      vpos = [sorted[0], sorted[1], sorted[2]];
    } else {
      vpos = [currentScrollPos, currentScrollPos + 1, currentScrollPos + 2];
    }
    setPrevScrollPos(currentScrollPos);
    setVisibleProjects([
      projects[vpos[0]],
      projects[vpos[1]],
      projects[vpos[2]],
    ]);
  };

  const scrollDown = () => {
    var currentScrollPos = prevScrollPos + 1;
    // Scrolling down

    var vpos = [];
    setDirection("down");
    if (currentScrollPos > projects.length - 3) {
      var sorted = getModifiedArray(currentScrollPos + 1);
      currentScrollPos = sorted[0];

      vpos = [sorted[0], sorted[1], sorted[2]];
    } else {
      vpos = [currentScrollPos, currentScrollPos + 1, currentScrollPos + 2];
    }
    setPrevScrollPos(currentScrollPos);
    setVisibleProjects([
      projects[vpos[0]],
      projects[vpos[1]],
      projects[vpos[2]],
    ]);
  };

  useEffect(() => {
    const container = containerRef.current;
    setTotalHeight(itemHeight * projects.length);
    const handleWheel = (event) => {
      var currentScrollPos = event.deltaY;
      var delta = currentScrollPos - prevScrollPos;
      var vpos = [];
      if (delta < 0) {
        scrollUp();
      } else if (delta > 0) {
        scrollDown();
      }
    };

    container.addEventListener('wheel', handleWheel);

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [prevScrollPos, projects]);

  useEffect(() => {
    const container = containerRef.current;

    const handleVisibleProjectsTransition = () => {
      const visibleProjectElements = container.getElementsByClassName('project');

      if (direction === "up") {
        for (var i = 0; i < visibleProjectElements.length; i++) {
          visibleProjectElements[i].classList.remove('fade-down');
          visibleProjectElements[i].classList.add('fade-up');
        }
      } else {
        for (var i = 0; i < visibleProjectElements.length; i++) {
          visibleProjectElements[i].classList.remove('fade-up');
          visibleProjectElements[i].classList.add('fade-down');
        }
      }
    };

    handleVisibleProjectsTransition();
  }, [visibleProjects, direction]);

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    setPrevScrollPos(0);
    if (projects.length > 2) {
      setVisibleProjects([
        projects[0],
        projects[1],
        projects[2],
      ]);
    } else {
      setVisibleProjects(projects);
    }

  };

  const handleSelectProject = (project) => {
    // ...
  };

  const getIconByName = (name) => {
    const item = iconData.find((item) => item.id.toLowerCase() === name.toLowerCase());
    return item ? item.icon : null;
  };

  const IComponent = ({ value }) => {
    const IconComponent = ChainIcons[value] || (() => <img src={`/images/${value}.svg`} height="25" />);

    return (
      <div>
        <IconContext.Provider >{IconComponent && <IconComponent height={25} />}</IconContext.Provider>
      </div>
    );
  };

  const handleTouchStart = (event) => {
    touchStartRef.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event) => {
    const touchEnd = event.touches[0].clientY;
    const touchStart = touchStartRef.current;
    const delta = touchEnd - touchStart;

    if (delta < -50) {
      scrollDown();
    } else if (delta > 50) {
      scrollUp();
    }
  };

  const scroll = (direction) => {
    let newScrollPos = scrollPos + (direction === 'up' ? -1 : 1) * itemHeight;
    if (newScrollPos < 0) {
      newScrollPos = totalHeight - itemHeight;
    } else if (newScrollPos >= totalHeight) {
      newScrollPos = 0;
    }
    setScrollPos(newScrollPos);
  };

  useEffect(() => {
    const container = containerRef.current;

    const handleWheel = (event) => {
      const delta = event.deltaY;
      if (delta < 0) {
        scroll('up');
      } else if (delta > 0) {
        scroll('down');
      }
    };

    container.addEventListener('wheel', handleWheel);
    return () => container.removeEventListener('wheel', handleWheel);
  }, [scrollPos, projects]);
  const parseMethods = (jsonString) => {
    try {
      return JSON.parse(jsonString.replace(/'/g, '"'));
    } catch (error) {
      console.error("Error parsing methods:", error);
      return [];
    }
  };
  
  const parseNetworks = (jsonString) => {
    try {
      return JSON.parse(jsonString.replace(/'/g, '"'));
    } catch (error) {
      console.error("Error parsing networks:", error);
      return [];
    }
  };

  const copySecret = async () => {
    if (apiSecret) {
        try {
            await navigator.clipboard.writeText(apiSecret);
            alert('API secret copied to clipboard!');
            setSecretVisible(false);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
};

  
  return (
    <Box
      ref={containerRef}
      sx={{
        overflow: 'hidden',
        position: 'relative',
        height: `${itemHeight * itemsPerPage}px`,
        width: '100%'
      }}
    >
      <Box className="projectlist"
        sx={{
          position: 'absolute',
          top: -scrollPos,
          left: 0,
          right: 0,
          transition: 'top 0.3s ease-out'
        }}
      >
{projects.map((project, index) => (
  <Card className="project" key={index} sx={{ mb: 2, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
  <Box>
    <Typography variant="h6" sx={{ mb: 1 }}>{project.TemplateName}</Typography>
    <Typography variant="body2" color="textSecondary">
      {parseMethods(project.Login).map((method, idx) => (
        <span key={idx}>{React.cloneElement(getAuthIcon(method), { fontSize: 'large' })}</span>
      ))}
    </Typography>
    <Typography variant="body2" color="textSecondary">
      <b>
        <a href={project.Worker} class="proceed" style={{ color: 'inherit' }} target="_blank">
          {project.Worker} <FaArrowRight className="link-icon"/>
        </a>
      </b>
    </Typography>
  </Box>
  <Box sx={{ pt: 2, borderTop: '1px solid #eee' }}>

    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>Supported Networks</Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', padding: '0'}}>
      {parseNetworks(project.ChainID).map((network, idx) => (
        <IComponent key={idx} value={getIconByName(network)} />
      ))}
    </Box>
    
  </Box>
  <div className="api" onMouseEnter={()=>setSecretVisible(false)}  >
            <Button onClick={()=>generateSecret(project.TemplateName)}   size="small"  sx={{ display: 'block', mb: 1 ,   padding: '2px 0px',  fontSize: '0.7rem'}}>
                Reset API secret?
            </Button>
            {secretVisible && (
                <Tooltip title="Click to copy">
                    <Typography onClick={copySecret} variant="caption" sx={{ display: 'block', mb: 1 ,   padding: '2px 0px',  fontSize: '0.7rem'}}>
                        {apiSecret}
                    </Typography>
                </Tooltip>
            )}
        </div>
</Card>

))}
      </Box>
      <IconButton onClick={() => scroll('up')} sx={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)' }}>
        <Icons.FaCaretUp />
      </IconButton>
      <IconButton onClick={() => scroll('down')} sx={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}>
        <Icons.FaCaretDown />
      </IconButton>
    </Box>
  );
};

export default ProjectList;