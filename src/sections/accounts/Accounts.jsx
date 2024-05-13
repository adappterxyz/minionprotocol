import React from 'react';
import { 
  Container, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography, 
  IconButton, 
  Collapse, 
  Box 
} from '@mui/material';
import { IconContext } from 'react-icons';
import PersonIcon from '@mui/icons-material/Person'; // Example icon for "Name"
import CardMembershipIcon from '@mui/icons-material/CardMembership'; // Example icon for "User ID Ref"
import DescriptionIcon from '@mui/icons-material/Description'; // Example icon for "Template"
import AccessTime from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import * as ChainIcons from "@thirdweb-dev/chain-icons";
import networkdata from '../../init/networks.json';
import accountsi from '../../init/accounts.json';
import './Accounts.css';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      searchQuery: '',
      showAddresses: {},
    };
  }

  componentDidMount() {
    let transformed = {};

    accountsi.forEach(account => {
      var id = account.userIdRef;
      if (!transformed[id]) {
        transformed[id] = {
          name: account.name,
          address: [{ chain: account.chain, address: account.contractAddress }],
          userIdRef: account.userIdRef,
          template: account.template
        };
      } else {
        transformed[id]['address'].push({ chain: account.chain, address: account.contractAddress });
      }
    });

    const accountsArray = Object.values(transformed);
    this.setState({ accounts: accountsArray });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  toggleAddressesVisibility = (userIdRef) => {
    this.setState(prevState => ({
      showAddresses: {
        ...prevState.showAddresses,
        [userIdRef]: !prevState.showAddresses[userIdRef]
      }
    }));
  }

  render() {
    const getIconByName = (name) => {
      const item = networkdata.find((item) => item.label.toLowerCase() === name.toLowerCase());
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

    const { accounts, searchQuery, showAddresses } = this.state;
    const filteredAccounts = accounts.filter(account => {
      const query = searchQuery.toLowerCase();
      return (
        account.name.toLowerCase().includes(query) ||
        account.address.some(a => a.address.toLowerCase().includes(query)) ||
        account.userIdRef.toLowerCase().includes(query) ||
        account.template.toLowerCase().includes(query)
      );
    });

    return (
      <div class="account-component">
      <Container>
       
        <TextField
          fullWidth
          label="Search..."
          value={searchQuery}
          onChange={this.handleSearchChange}
          margin="normal"
        />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
            <TableRow>
              <TableCell><PersonIcon /> User ID</TableCell> {/* Icon for "Name" */}
              <TableCell><CardMembershipIcon /> User ID Ref</TableCell> {/* Icon for "User ID Ref" */}
              <TableCell><DescriptionIcon /> Template</TableCell> {/* Icon for "Template" */}
              <TableCell><AccessTime /> Created on</TableCell> {/* Icon for "Created on" */}
              {/* Add more TableCell with icons if needed */}
            </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.map((account, index) => (
                <React.Fragment key={index}>
                  <TableRow onClick={() => this.toggleAddressesVisibility(account.userIdRef)}>

                    <TableCell>{account.name} <IconButton >
                        {showAddresses[account.userIdRef] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton></TableCell>
                    <TableCell>{account.userIdRef}</TableCell>
                    <TableCell>{account.template}</TableCell>
                    <TableCell>{account.createdon}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={showAddresses[account.userIdRef]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                          {account.address.map((address, addressIndex) => (
                            <Box key={addressIndex} display="flex" alignItems="center">
                              <Box sx={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                                <IComponent value={getIconByName(address.chain)} />
                              </Box>
                              <Typography variant="body2" sx={{ marginLeft: 2, flexGrow: 1 }}>
                                [{address.chain}] {address.address}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container></div>
    );
  }
}

export default Account;
