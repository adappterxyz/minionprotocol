import React, { useState } from 'react';
import * as ReactIcons from 'react-icons/fa'; // Import all icons from the 'react-icons/fa' library
import './LeftNavBar.css';

const LeftNavBar = ({ handleNavItemClick, activeItem, setActiveItem, isNavVisible, setIsNavVisible }) => {
  
  const [hoveredItem, setHoveredItem] = useState('');

  const toggleNavVisibility = () => {
    setIsNavVisible((prevState) => !prevState);
  };

  const handleItemClick = (item) => {
    handleNavItemClick(item);
    
  };

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem('');
  };

  const navItems = [
    { label: 'Bots', value: 'Bots', icon: ReactIcons.FaDesktop },
    { label: 'Jobs', value: 'Jobs', icon: ReactIcons.FaCog },
    { label: 'Assets', value: 'Assets', icon: ReactIcons.FaFileContract },
    { label: 'Develop', value: 'Develop', icon: ReactIcons.FaUser },
    
    
  ];

  return (
    <div>
      <div className={`left-nav-bar ${isNavVisible ? '' : 'hidden'}`}>
        <div className="bar"></div>
        <ul className={`nav-list ${isNavVisible ? 'visible' : 'hidden'}`}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li
                key={item.value}
                className={`nav-item ${activeItem === item.value ? 'active' : ''}`}
                onClick={() => handleItemClick(item.value)}
                onMouseEnter={() => handleMouseEnter(item.value)}
                onMouseLeave={handleMouseLeave}
              >
                <IconComponent /><br></br> <sub style={{ 'font-size': '70%' }}>{item.label}</sub>
              </li>
            );
          })}
        </ul>
        <div className={`placeholder-text ${hoveredItem ? 'visible' : ''}`} style={{"text-shadow":"0 0 3px #000", "pointer-events":"none"}}>
          <h2 >{hoveredItem ? hoveredItem : ''}</h2>
        </div>
      </div>

      <button className="toggle-button" onClick={toggleNavVisibility}>
        {isNavVisible ? <ReactIcons.FaCaretLeft /> : <ReactIcons.FaCaretRight />}
      </button>
    </div>
  );
};

export default LeftNavBar;
