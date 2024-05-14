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
import { Container, Paper, Typography, TextField, Button, Grid, Box , Card, CardContent} from '@mui/material';

const { ethers } = require('ethers');



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(0);
  const [activeItem, setActiveItem] = useState('Bots');
  const [curract, setCurract] = useState('...');
  const [initialProjects, setInitialProjects] = useState(initialProjectsdata);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(true);
  const [panelIsVisible, setPanelIsVisible] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const [balance, setBalance] = useState(0);



      const [messages, setMessages] = useState([]); // Store messages
      const [newMessage, setNewMessage] = useState(''); // Input for new message
  
      // Function to handle sending a message
      const sendMessage = (event) => {
          event.preventDefault(); // Prevent form from submitting traditionally
          if (newMessage.trim() !== '') {
              const message = {
                  id: messages.length + 1, // Simple incrementing ID
                  text: newMessage,
                  timestamp: new Date().toLocaleTimeString() // Store the time when the message was sent
              };
              setMessages([...messages, message]); // Add new message to messages array
              setNewMessage(''); // Clear input after sending
          }
        }
  var kvp = []; 
if(typeof localStorage['kvp'] !=='undefined'){  kvp = JSON.parse(localStorage['kvp']) }
  const [keyValuePairs, setKeyValuePairs] = useState(kvp); // Stores all key-value pairs
  const [key, setKey] = useState(''); // Current key input
  const [value, setValue] = useState(''); // Current value input
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents page refresh
    if (key && value) { // Check if key and value are not empty
        // Check if the key already exists
        const exists = keyValuePairs.some(pair => pair.key === key);
        
        const newKeyValuePairs = exists
            ? keyValuePairs.map(pair => pair.key === key ? { ...pair, value: value } : pair) // Update existing key
            : [...keyValuePairs, { key, value }]; // Add new key-value pair

        // Update state and localStorage
        setKeyValuePairs(newKeyValuePairs);
        setKey('');
        setValue('');
        localStorage.setItem('kvp', JSON.stringify(newKeyValuePairs)); // Use setItem for better practice
    }
};



  const apiUrl = '//localhost:3000';


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

  

  const deploy = async () => {

  }
  const handleLogin = (auth, status) => {
    // Begin loading process
    setIsLoading(true);
    console.log(apiUrl, auth);

        // Handle the successful response here
   if(auth.id=="banana" && auth.password=="banana"){
          setCurract("Logging in...");
          localStorage.setItem('login',123); // Store the login token
          const b = getBalance(useradd);
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
 setIsLoading(true);
 setCurract("Generating deployment message");
 fetch(`${apiUrl}/deploy`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.login}`
  }
}).then(response => {
  setCurract("Deploying image...");
  return response.json();
}).then(data => {
  setCurract("Lease ID obtained");
    console.log("leaseid:",data);
    fetch(`${apiUrl}/deploymanifest?=${encodeURIComponent(data)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.login}`
      }
    }).then(response => {
    
      return response.json();
    }).then(data => {
      setCurract("Manifests successfully returned.");
      setIsLoading(false);
        console.log("manifest:",data);
   
  })


})
};
const provider = new ethers.JsonRpcProvider("https://api.zan.top/node/v1/bsc/testnet/667a3df7293e4879bb69e5e3227409df");
const tokenAddress = '0x136294cDaaaCA1dF814af2605E8845FA52b8208A';
const tokenABI = ["function balanceOf(address owner) view returns (uint256)"];
const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
const useradd= '0xA94403f1eE915E1abC0B7A02B706A5826249198c';
const scan = 'https://testnet.bscscan.com/address/'+useradd;
const getBalance = async(address) =>{
  // Query the balance
  const balance = await tokenContract.balanceOf(address);
  setBalance(parseFloat(ethers.formatUnits(balance, 18)).toFixed(2));
}

const handleCloseDeploy=async()=>{
  setIsLoading(true);
  setCurract("Closing Deployment...");
 fetch(`${apiUrl}/close`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.login}`
  }
}).then(response => {
  return response.json();
}).then(data => {
  setIsLoading(false);
}).catch(error => {
console.log(error)
  setIsLoading(false);
})

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
                <img src="/banana-dance.gif" style={{"width":"50px;"}} />
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
              <div className="balance-display">
  <img src="chicken.png" alt="Chicken Icon"/>
  <a href={scan} target="_blank" >Balance: {balance} CKN </a>
</div>
              <div className="bot-container">
      {initialProjects.map((bot, index) => (
        <div className="bot-card" key={index}>
          <div>
            <h5>{bot.icon} {bot.name}</h5>
            <p>{bot.description}</p>
          </div>
          <button className="deploy-button" onClick={() => handleDeploy(bot)}>
            Deploy
          </button>
        </div>
      ))}
    </div>
              </div>}
              {activeItem === 'Assets' && <div>
              <div className="assets">
            <div className="container">
                <form onSubmit={handleSubmit} className="form-container">
                    <input
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        className="input-field"
                        placeholder="Key"
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="input-field"
                        placeholder="Value"
                    />
                    <button type="submit" className="submit-button">Add ENV</button>
                </form>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {keyValuePairs.map((pair, index) => (
                            <tr key={index}>
                                <td>{pair.key}</td>
                                <td>{pair.value}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
              </div>}
              {activeItem === 'Develop' && <div>
           
              <div className="middle-row">
              <div className="option">Option Panel</div>
  <div className="chat-container">
            <div className="messages">
                {messages.map((msg) => (
                    <div key={msg.id} className="message">
                        <div className="message-info">
                            <span>{msg.timestamp}</span>
                        </div>
                        <div className="message-text">{msg.text}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="send-message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>

 
    
    <div className="code-container">
      <Leditor/>
    </div>
  </div>
  <div className='flowchart-container'>Flowchart</div>

              </div>}




            </div>
            <RightPanel handleCloseDeploy={handleCloseDeploy} panelIsVisible={panelIsVisible} setPanelIsVisible={setPanelIsVisible} handleLogout={handleLogout} />
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
