exports.evm = (templatename, bodyfn)=>{
    
const base=`pragma solidity ^0.8.0;

interface IERC20 {
  function transfer(address recipient, uint256 amount) external returns (bool);
}

contract ${templatename} {

  address public operator;
  address private pendingOperator;

  constructor() {
    operator = msg.sender;
}
modifier onlyOperator() {
  require(msg.sender == operator, "Only the operator can call this function.");
  _;
}


function getOperator() public view returns (address) {
  return operator;
}

function changeOperator(address newOperator) public onlyOperator {
  require(newOperator != address(0), "Invalid address: cannot be zero address.");
  pendingOperator = newOperator;
}

// New function to confirm operator change by the new operator
function confirmOperator() public {
  require(msg.sender == pendingOperator, "Only the proposed new operator can confirm.");
  operator = pendingOperator;
  pendingOperator = address(0);  // Reset the pending operator
}


uint public value;
  function setValue(uint newValue) public onlyOperator {
    value = newValue;
  }

  function addValue(uint newValue) public onlyOperator {
    value = value + newValue;
  }
${bodyfn}


  function getValue() public view returns (uint) {
    return value;
  }
}`;

return base;
}
