import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ serviceWorkers }) => {
  const [selectedWorker, setSelectedWorker] = useState(null);

  const handleWorkerClick = (workerId) => {
    setSelectedWorker(workerId === selectedWorker ? null : workerId);
  };

  return (
    <div className="auth-container">
      <div className="auth configcom">
        <div className="header">Auth Configurations</div>
        <div className="worker-container"
         onWheel={(event) => {
          event.preventDefault();
          const container = event.currentTarget;
          container.scrollTo({
            left: container.scrollLeft + 2*event.deltaY,
            behavior: 'smooth',
          });
        }}
        >
          <div
            className="service-worker-list"
           
          >
            {serviceWorkers.map((worker) => (
              <div
                key={worker.id}
                className={`service-worker-card ${selectedWorker === worker.id ? 'active' : ''}`}
                onClick={() => handleWorkerClick(worker.id)}
              >
                <h3>{worker.templateName}</h3>
                {selectedWorker === worker.id && (
                  <ul className="auth-methods">
                    {worker.authMethods.map((method) => (
                      <span key={method}>{method}</span>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
