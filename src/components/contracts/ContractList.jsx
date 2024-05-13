import React from 'react';
import './ContractList.css';

const ContractList = ({ contracts }) => {
  return (
    <div className="contract-list-container">
   

      <table>
        <thead>
          <tr>
            <th>Milestone</th>
            <th>Contract Address</th>
            <th>Amount (USDC)</th>
            <th>Blockchain</th>
            <th>Contract Status</th>
            <th>Milestone Completion</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => (
            <tr key={contract.contractAddress}>
              <td>{contract.name}</td>
              <td>{contract.contractAddress}</td>
              <td>{parseFloat(contract.releaseAmount.toFixed(2))}</td>
              <td>{contract.blockchain}</td> {/* Add this line */}
              <td>{contract.status}</td>
              <td>
                <div className="completion-bar">
                  <div
                    className="completion-level"
                    style={{ width: `${contract.completionLevel}%` }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractList;
