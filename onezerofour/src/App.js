import React from 'react';
import { motion } from 'framer-motion';
import Terminal from './components/Terminal';
import { GameStateProvider } from './contexts/GameStateContext';
import './App.css';

function App() {
  return (
    <GameStateProvider>
      <motion.div 
        className="App"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="cyberpunk-background">
          <Terminal />
        </div>
      </motion.div>
    </GameStateProvider>
  );
}

export default App;
