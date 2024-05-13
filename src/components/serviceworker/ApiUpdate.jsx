import React, { useState } from 'react';
import './ApiUpdate.css';
import { IconContext } from 'react-icons';
import * as ChainIcons from "@thirdweb-dev/chain-icons";
import * as Icons from 'react-icons/fa';


const ApiUpdate = () => {
  const [activePlatform, setActivePlatform] = useState('aws');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [updated, setUpdated] = useState(false);

  const IComponent = ({ value }) => {

    const IconComponent = Icons[value] || ChainIcons[value];

    return (
      <div>
        <IconContext.Provider value={{ size: '1.5em' }}>
          {IconComponent && <IconComponent />}
        </IconContext.Provider>
      </div>
    );
  };

  const handlePlatformChange = (platform) => {
    setActivePlatform(platform);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleApiSecretChange = (event) => {
    setApiSecret(event.target.value);
  };

  const handlePrivateKeyChange = (event) => {
    setApiSecret(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Perform API update logic here based on the activePlatform and the entered API credentials

    // Set the updated state to true to show a success message
    setUpdated(true);

    // Reset the form fields
    setApiKey('');
    setApiSecret('');
  };

  return (
    <div className="configcom api-update-container">
      <div class="header">External Services</div>
      <div className="tab-menu">
      <button
          className={`tab-item ${activePlatform === 'github' ? 'active' : ''}`}
          onClick={() => handlePlatformChange('github')}
        >
         <IComponent value="FaGithub" />  Github
        </button>
        <button
          className={`tab-item ${activePlatform === 'aws' ? 'active' : ''}`}
          onClick={() => handlePlatformChange('aws')}
        >
         <IComponent value="FaAws" />  AWS
        </button>
        <button
          className={`tab-item ${activePlatform === 'cloudflare' ? 'active' : ''}`}
          onClick={() => handlePlatformChange('cloudflare')}
        >
         <IComponent value="FaCloudflare" />  Cloudflare 
        </button>
        
        <button
          className={`tab-item ${activePlatform === 'akash' ? 'active' : ''}`}
          onClick={() => handlePlatformChange('akash')}
        >
          
          <IComponent value="AkashNetwork" /> Akash
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {activePlatform!='akash'?(<div>
        <div className="form-group">
          <label htmlFor="apiKey">API Key:</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={handleApiKeyChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="apiSecret">API Secret:</label>
          <input
            type="text"
            id="apiSecret"
            value={apiSecret}
            onChange={handleApiSecretChange}
          />
        </div></div>):(
        <div className="form-group">
          <label htmlFor="apiSecret">Private Key</label>
          <input
            type="text"
            id="privateKey"
            value={privateKey}
            onChange={handlePrivateKeyChange}
          />
        </div>)}
        <button>Update</button>
      </form>
      {updated && <p className="success-message">API configuration updated successfully!</p>}
    </div>
  );
};

export default ApiUpdate;
