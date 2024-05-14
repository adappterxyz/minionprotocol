import React, { useState, useEffect, useRef } from 'react';
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const { ethers } = require('ethers');



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
  const [balance, setBalance] = useState(0);


const example = `import { test, expect } from '@playwright/test';
console.log(process.env.DIR);
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
`;
const [showChat, toggleShowChat] = useState(true);
      const [messages, setMessages] = useState([]); // Store messages
      const [newMessage, setNewMessage] = useState(''); // Input for new message
      const messagesEndRef = useRef(null);
  //https://imigresen-online.imi.gov.my/mdac/main?registerMain
  async function Gemini(prompt){
    fetch(
      "https://proxy.kwang-5a2.workers.dev",
      {
        body: JSON.stringify(prompt),
        headers: {
          apiKey: "AIzaSyAWsblnruBZuSzN__qUqh8oK02qgVfj_ew",
          "Content-Type": "application/json"
        },
        method: "POST",
      }
    )
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      // Process your data here
    })
    .catch(error => {
      console.error('There was a problem with your fetch operation:', error);
    });
  }
  const AkashRequest = async(bodyObject) =>{
    const url ='https://akashchat.kwang-5a2.workers.dev/'
//        const url = "https://chat.akash.network/api/chat";
    const headers = {
    };
    
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bodyObject)  // Ensure the body is stringified
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }else{
  return await response.text();
}
     
  }
  const genmsg =(msg) =>{
    return msg.map(message => ({
      role: message.role,
      content: message.text
  }));
  }
      // Function to handle sending a message
      const sendMessage = async(event) => {
          event.preventDefault(); // Prevent form from submitting traditionally
          if (newMessage.trim() !== '') {
              const message = {
                  id: messages.length + 1, // Simple incrementing ID
                  text: newMessage,
                  role: "user",
                  timestamp: new Date().toLocaleTimeString() // Store the time when the message was sent
              };


              setMessages([...messages, message, {
                id: messages.length + 1, // Simple incrementing ID
                text: "Please wait...",
                role: "",
                timestamp: '' // Store the time when the message was sent
            }]); // Add new message to messages array
              setNewMessage('');
              scrollToBottom();
              console.log(messages);
              // Example body object
              const bodyObject = {
                model: {
                  id: "mistral",
                  name: "Mistral-7B",
                  maxLength: 12000,
                  tokenLimit: 4000
                },
                messages: genmsg([...messages, message]),
                key: "",
                prompt: "You are an RPA engineer specialized in nodejs playwright library. A typical output should look like "+example
              };
              
              // Using the generic fetch function
//              Gemini(bodyObject)
              const response = await AkashRequest(bodyObject);
              setMessages([...messages, message, {
                id: messages.length + 1, // Simple incrementing ID
                text: response,
                role: "assistant",
                timestamp: new Date().toLocaleTimeString() // Store the time when the message was sent
            }]);
            
            scrollToBottom();
               console.log(response);
              // Clear input after sending
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

const [currentStep, setCurrentStep] = useState(null);
const [steps,setSteps] = useState([
  { id: 1, title: "Login", description: "Log into the application.", type: "Start" },
  { id: 2, title: "Fetch Data", description: "Retrieve data from the database.", type: "Process" },
  { id: 3, title: "Log Activity", description: "Log user activity.", type: "Process" },
  { id: 4, title: "Logout", description: "Log out from the application.", type: "End" },
  { id: 3, title: "Log Activity", description: "Log user activity.", type: "Process" },
  { id: 3, title: "Log Activity", description: "Log user activity.", type: "Process" },
  { id: 3, title: "Log Activity", description: "Log user activity.", type: "Process" },
  { id: 4, title: "Logout", description: "Log out from the application.", type: "End" },
]);

const addStep = () => {
  const newId = steps.length + 1; // Simple ID generation
  const newStep = {
      id: newId,
      title: `New Step ${newId}`,
      description: "Description of new step.",
      type: "Process"
  };
  setSteps([...steps, newStep]);
};

const deleteCurrentStep = () => {
  if (currentStep) {
      setSteps(steps.filter(step => step.id !== currentStep.id));
  }
};


const [jobs,setJobs] = useState([   { id: 1, status: "Starting up...", description: "crawl data from ...", link: "Process" },
{ id: 2,status: "Job in progress", description: "submit application", type: "End" },
{ id: 2,status: "Job completed", description: "escrow account information", type: "End" }]);

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
        if (localStorage.getItem('login')) {
          localStorage.removeItem('login'); // Correctly use localStorage.removeItem
        }
        setIsLoading(false);
        setCurract("...");
  };

  

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
  const handleUpdateOrAddJob = (jobs, newJob) => {
    // Check if the job already exists in the array
    const jobIndex = jobs.findIndex(job => job.id === newJob.id);

    let updatedJobs;
    if (jobIndex !== -1) {
        // Job exists, update it
        updatedJobs = jobs.map((job, index) => 
            index === jobIndex ? { ...job, ...newJob } : job
        );
    } else {
        // Job doesn't exist, add it
        updatedJobs = [...jobs, newJob];
    }

    return updatedJobs;
};  
const handleDeploy=async (bot)=>{
 //
 console.log(bot);
 bot.id=123;
 const newjob = {id: 10,status: "Job in progress", description: "submit application", type: "End" };
 const updatedJobs = handleUpdateOrAddJob(jobs, newjob);
 setJobs(updatedJobs);
 
 console.log(updatedJobs);



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

const handleCloseDeploy=async(id)=>{
  console.log(id); return false;
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
 
const scrollToBottom = () => {
  const messagesContainer = document.querySelector('.messages');
  if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
};


  useEffect(() => {
    scrollToBottom();
    return () => {
      if (intervalId) {
        console.log("Cleanup interval: " + intervalId);
        clearInterval(intervalId);
      }
    };
  }, [intervalId, messages]);

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
              <div class="outer-container">
    <div class="rotated-div" onClick={()=>toggleShowChat(!showChat)} ><sup>Powered by Akash Chat</sup></div>
    </div>
    {showChat ? ( <div className="chat-container">
   
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className="message">
              <div className="message-info">
                <span>{msg.timestamp}</span>
              </div>
              <div className={`message-text ${msg.role}`}>
                <ReactMarkdown children={msg.text} remarkPlugins={[remarkGfm]} />
              </div>
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
        </div>  ) : null}
        <div className="option">  <div className="option-panel">
            <button onClick={addStep}>Add Step</button>
            <button onClick={deleteCurrentStep}>Delete Current Step</button>
            {/* Button to set current step for demonstration */}
            {currentStep && <div>{currentStep.title}</div>}
            <button onClick={() => setCurrentStep({ id: currentStep.id, title: "Updated:)", description: "Data is being processed.", type: "Process" })}>
                Update current step
                
            </button>
            <div>Current step options will be dynamically updated based on the selected step.</div>
            <button style={{"background":"#333"}}onClick={() => setCurrentStep({ id: 2, title: "Process Data", description: "Data is being processed.", type: "Process" })}>
                <sup>Deploy to Marketplace via Jackal Storage</sup>
            </button>
          
        </div>
              </div>
 
    
    <div className="code-container">
      <Leditor/>
    </div>
  </div>
  <div className='flowchart-container'>
  <div >
            <div className="flowchart-container">
            {steps.map(step => (
                <div key={step.id} className={`step-block ${step.type.toLowerCase()}`}   onClick={() => setCurrentStep(step)}>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                </div>
            ))}
        </div>
        </div>

  </div>

              </div>}




            </div>
            <RightPanel jobs={jobs} setJobs={setJobs} handleCloseDeploy={handleCloseDeploy} panelIsVisible={panelIsVisible} setPanelIsVisible={setPanelIsVisible} handleLogout={handleLogout} />
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
