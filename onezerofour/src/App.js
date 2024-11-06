import React, { useState } from 'react';
import Terminal from './components/Terminal';
import DesktopIcon from './components/DesktopIcon';
import './App.css';

function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const handleOpenTerminal = () => {
    setIsTerminalOpen(true);
  };

  const handleCloseTerminal = () => {
    setIsTerminalOpen(false);
  };

  return (
    <div className="App">
      <div className="crt-overlay"></div>
      <div className="scanline"></div>
      
      {!isTerminalOpen && (
        <div className="desktop">
          <DesktopIcon 
            onClick={handleOpenTerminal}
            icon="/terminal-icon.svg"
            label="OneZeroFour Terminal"
          />
        </div>
      )}
      
      {isTerminalOpen && (
        <Terminal onClose={handleCloseTerminal} />
      )}
    </div>
  );
}

export default App;
