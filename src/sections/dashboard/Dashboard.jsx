import React, { useState, useEffect  } from 'react';
import { IconContext } from 'react-icons';
import { Card, CardProps ,CardContent, Typography, Grid } from '@mui/material';

import * as ChainIcons from "@thirdweb-dev/chain-icons";
import * as Icons from 'react-icons/fa';
import './dashboard.css';
import {  FaUser, FaExchangeAlt, FaDollarSign } from 'react-icons/fa';




const Dashboard = () => {
  // Fetch component data from an API or set it manually
  const data = [
    { id: 1, name: 'SCA Deployed', count: 100, icon: FaUser },
    { id: 2, name: 'Transaction', count: 500, icon: FaExchangeAlt },
    { id: 3, name: 'Fee Usage', value: 900.00, currency: "USD", icon: FaDollarSign },
  ];



  return (
    <div className="dashboard">

<h1>asdasdasdasdasdasdsaasdsd</h1>




    </div>
  );
};

export default Dashboard;
