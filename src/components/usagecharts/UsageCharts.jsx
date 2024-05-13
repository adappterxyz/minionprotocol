import React, { useState, useEffect } from 'react';
import { Container, Typography, Switch, FormGroup, FormControlLabel, Select, MenuItem, InputLabel, FormControl, Box, TextField } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link'; // For "Chain"
import PersonIcon from '@mui/icons-material/Person'; // For "User"
import EventNoteIcon from '@mui/icons-material/AccessTime'; // For "Time"
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // For "Transaction"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // For "Amount"


const UsageCharts = () => {
  const [showChart, setShowChart] = useState(false);
  const [chartType, setChartType] = useState('user'); // 'user' or 'chain'
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedChain, setSelectedChain] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredActivities, setFilteredActivities] = useState([]);

  // Dummy data - replace with your actual data
  const activities = [
    { id: 1, chain: 'Ethereum', user: 'User1', time: '2022-01-01', transaction: 'TX123', amount: 10 },
    { id: 2, chain: 'Binance', user: 'User2', time: '2022-01-02', transaction: 'TX456', amount: 15 },
    // ... more data
  ];

  useEffect(() => {
    // Filter activities based on selections
    const filtered = activities.filter(activity => {
      return (selectedChain ? activity.chain === selectedChain : true) &&
             (selectedUser ? activity.user === selectedUser : true) &&
             (startDate ? new Date(activity.time) >= new Date(startDate) : true) &&
             (endDate ? new Date(activity.time) <= new Date(endDate) : true);
    });
    setFilteredActivities(filtered);
  }, [selectedUser, selectedChain, startDate, endDate, activities]);

  // Prepare chart data based on the selected chart type (user/chain)
  const chartData = filteredActivities.reduce((acc, activity) => {
    const key = chartType === 'user' ? activity.user : activity.chain;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({ date: activity.time, amount: activity.amount });
    return acc;
  }, {});

  const handleToggleChange = () => {
    setShowChart(!showChart);
  };

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  // Unique users and chains for the dropdowns
  const uniqueUsers = Array.from(new Set(activities.map(a => a.user)));
  const uniqueChains = Array.from(new Set(activities.map(a => a.chain)));

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ my: 4 }}>
        Activities Overview
      </Typography>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginBottom: 2 }}>
        {/* Chart Type Selector */}
        <FormControl>
          <InputLabel>Chart Type</InputLabel>
          <Select value={chartType} onChange={handleChartTypeChange}>
            <MenuItem value="user">Top Users</MenuItem>
            <MenuItem value="chain">Top Chains</MenuItem>
          </Select>
        </FormControl>

        {/* Date Pickers */}
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Toggle Chart/Table View */}
      <FormGroup>
        <FormControlLabel 
          control={<Switch checked={showChart} onChange={handleToggleChange} />} 
          label="Toggle Chart View" 
        />
      </FormGroup>

      {/* Chart or Table */}
      {showChart ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {Object.keys(chartData).map((key, idx) => (
              <Area key={idx} type="monotone" dataKey="amount" data={chartData[key]} stackId="1" stroke="#8884d8" fill="#8884d8" />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <TableContainer component={Paper}>
        <Table aria-label="activities table">
          <TableHead>
            <TableRow>
            <TableCell><LinkIcon /> Chain</TableCell>
                <TableCell><PersonIcon /> User</TableCell>
                <TableCell><EventNoteIcon /> Time Posted</TableCell>
                <TableCell><SwapHorizIcon /> Transaction</TableCell>
                <TableCell><AttachMoneyIcon /> Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.chain}</TableCell>
                <TableCell>{activity.user}</TableCell>
                <TableCell>{activity.time}</TableCell>
                <TableCell>{activity.transaction}</TableCell>
                <TableCell>{activity.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </Container>
  );
};

export default UsageCharts;
