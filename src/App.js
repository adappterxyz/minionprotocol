import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login/Login';
import LeftNavBar from "./components/nav/LeftNavBar";
import RightPanel from "./components/rightpanel/RightPanel";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme.jsx'; // The theme you created
import initialProjectsdata from './init/project.json';
import Leditor from "./components/leditor/LEditor";




function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(0);
  const [activeItem, setActiveItem] = useState('Bots');
  const [curract, setCurract] = useState('...');
  const [initialProjects, setInitialProjects] = useState(initialProjectsdata);

  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(true);
  const [panelIsVisible, setPanelIsVisible] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [intervalId, setIntervalId] = useState(null);


  const handleNavItemClick = (item) => {
    setActiveItem(item);

  };
  const handleLogout = (status) => {
    // Begin the logout process
    setIsLoading(true);
    setIsLoggedIn(false);
    setCurract("Logging out...");
    console.log('1logout');
    // Perform the logout using fetch
    fetch(`${apiUrl}/session/logout`, {
      method: 'GET', // Specify the request method
      headers: {
        'Content-Type': 'application/json', // Specify JSON content type
        'Authorization': `Bearer ${localStorage.getItem('login')}` // Use localStorage.getItem for safer access
      }
    })
      .then(response => {

        if (!response.ok) {
          // If the response is not ok, you might want to handle this differently
          throw new Error('Network response was not ok');
        }
        // Logout was successful
        if (localStorage.getItem('login')) {
          localStorage.removeItem('login'); // Correctly use localStorage.removeItem
        }
        setIsLoading(false);
        setCurract("...");
      })
      .catch(error => {

        console.log('elogout');
        // Handle any errors during logout
        console.error('Error:', error);
        // Optionally, set loading to false and update status even in case of error
        setIsLoading(false);
        setCurract("...");
      });
  };

  const getfn = async () => {

  }
  const gettemplates = async () => {

    fetch(`https://api.adappter.xyz/platform/template/retrieve`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.login}`
      }
    }).then(response => {

      return response.json();
    })

      .then(data => {
        console.log(data);
        console.log(initialProjects);
        localStorage.projects = JSON.stringify(data.info)
        setInitialProjects(data.info);
       
      })


  }
  const verifySession = async () => {

    if (localStorage.login) {
      // Check session expiry
      fetch(`${apiUrl}/session/init`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.login}`
        }
      })
        .then(response => {
          console.log('verifysess');
          if (!response.ok) {
            throw new Error('Session validation failed');
          }
          return response.json(); // Assuming the server responds with JSON
        })
        .then(data => {
          console.log(data); setIsLoggedIn(true);
          return true;
          // If success, load profile data




        })
        .catch(error => {
          console.error('Error:', error);
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  }
  const handleLogin = (auth, status) => {
    // Begin loading process
    setIsLoading(true);
    console.log(apiUrl, auth);

        // Handle the successful response here
   if(auth.id=="banana" && auth.password=="banana"){
          setCurract("Logging in...");
          localStorage.setItem('login',123); // Store the login token
          setTimeout(() => {
            setIsLoading(false);
            setCurract("...");
            setIsLoggedIn(true); // Update the login status
          }, 1500);
        }else{
          setCurract("Credential not recognized");
          setTimeout(() => {
            setIsLoading(false);
            setCurract("...");
          }, 1500);
        }
        
    
  };





  const apiUrl = 'https://api.adappter.xyz/platform';


  const talknojutsu = async (cstatus, templateData) => {
    setIsLoading(true);
    
      handleStatusUpdates(cstatus);
      setIsLoading(false);
  
  };

  function handleStatusUpdates(cstatus) {
    let count = 0;
    const updateMessage = () => {
      setTimeout(() => {
        setCurract(cstatus[count]);
        if (count >= cstatus.length - 1) {
          setIsLoading(false);
          setLoadComplete(true);
          return;
        }
        count++;
        updateMessage();
      }, 2000);
    };

    updateMessage();
  }
const handleDeploy=async ()=>{
 // const akash = await import("../server/dep.js");
}
  useEffect(() => {
   

    return () => {
      if (intervalId) {
        console.log("Cleanup interval: " + intervalId);
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <ThemeProvider theme={theme}>
      <GoogleOAuthProvider clientId="664954214187-tv7ieppgf2r3trq3nq64dnoni98qaiah.apps.googleusercontent.com">
        <div className="App">
          {isLoading &&
            <div class="load-bg">
              <div className={`loading-container ${loadComplete ? '' : 'complete'}`}>
                <div class="loading-circle"></div>
                <div class="loading-circle"></div>
                <div class="loading-circle"></div>
                <div class="loading-circle"></div>
                <div class="loading-text">
                  <h3>Please wait... </h3>
                </div>
              </div>
              <h3><sub>{curract}</sub></h3>
            </div>

          }



          {isLoggedIn ? (<div><LeftNavBar activeItem={activeItem} const isNavVisible={isNavVisible} setIsNavVisible={setIsNavVisible} handleNavItemClick={handleNavItemClick} />
            <div className={`${panelIsVisible ? 'reduced' : 'fullview'} ${isNavVisible ? 'shownav' : 'hidenav'}`} >


              {activeItem === 'Bots' && <div>
               <div> A BUNCH OF BOTS to be tested</div><button onClick={()=>handleDeploy()}>Deploy</button>
              </div>}

              {activeItem === 'Jobs' && <div>
             jobs
              </div>}
              {activeItem === 'Assets' && <div>
                key value pair 
              </div>}
              {activeItem === 'Develop' && <div>
                <Leditor />
              </div>}




            </div>
            <RightPanel panelIsVisible={panelIsVisible} setPanelIsVisible={setPanelIsVisible} handleLogout={handleLogout} />
          </div>
          ) : ("")
          }
          <Router>
            <Routes>
              <Route path="/explainer" element={<div><h1>Explainer...</h1></div>} />
              {isLoggedIn ? (""
              ) : (
                <Route path="/" element={<Login onLogin={handleLogin} />} />
              )}
            </Routes>
          </Router>
        </div></GoogleOAuthProvider>
    </ThemeProvider>
  );
}

export default App;
