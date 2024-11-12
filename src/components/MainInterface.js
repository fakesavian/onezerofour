import * as React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import WorldContent from './WorldContent';
import GameContent from './GameContent';
import { useGame } from '../contexts/GameContext';

const TerminalContainer = styled(motion.div)`
  width: 90vw;
  max-width: 1200px;
  height: 80vh;
  background-color: rgba(0, 0, 0, 0.95);
  border: 2px solid #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    animation: scanline 6s linear infinite;
  }

  @keyframes scanline {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(80vh);
    }
  }
`;

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #001100;
  border-bottom: 1px solid #00ff00;
  font-family: 'Courier New', monospace;
`;

const HeaderTitle = styled.div`
  color: #00ff00;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.1rem;
  text-shadow: 0 0 5px #00ff00;
`;

const ExitButton = styled(motion.button)`
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00ff00;
    color: #000;
    box-shadow: 0 0 10px #00ff00;
  }
`;

const TerminalContent = styled(motion.div)`
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
  background-color: rgba(0, 0, 0, 0.95);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #001100;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 4px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 255, 0, 0.03) 0px,
      rgba(0, 255, 0, 0.03) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  background-color: #001100;
  border-top: 1px solid #00ff00;
`;

const NavButton = styled(motion.button)`
  background-color: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 10px 25px;
  font-family: 'Courier New', monospace;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background-color: #00ff00;
    transition: all 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const bootSequence = [
  "INITIALIZING ONEZEROFOUR NEURAL NETWORK v2.7.3...",
  "LOADING CORE SYSTEMS...",
  "ESTABLISHING QUANTUM LINK...",
  "CONNECTING TO ARCHITECT NETWORK...",
  "BYPASSING SECURITY PROTOCOLS...",
  "ACCESS GRANTED...",
  "",
  "Welcome to OneZeroFour, Traveler.",
  "The Architects await your presence.",
  "",
  "SYSTEM READY."
];

const MainInterface = React.memo(({ onExit }) => {
  const [activeSection, setActiveSection] = React.useState('boot');
  const [bootStep, setBootStep] = React.useState(0);
  const [bootText, setBootText] = React.useState([]);
  const { resetGame } = useGame();

  React.useEffect(() => {
    if (activeSection === 'boot' && bootStep < bootSequence.length) {
      const timer = setTimeout(() => {
        setBootText(prev => [...prev, bootSequence[bootStep]]);
        setBootStep(prev => prev + 1);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [bootStep, activeSection]);

  const handleSectionChange = React.useCallback((section) => {
    if (section === 'boot') {
      setBootStep(0);
      setBootText([]);
    }
    if (section === 'game') {
      resetGame();
    }
    setActiveSection(section);
  }, [resetGame]);

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <TerminalContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TerminalHeader>
        <HeaderTitle>OneZeroFour Terminal v2.7.3</HeaderTitle>
        <ExitButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onExit}
        >
          ×
        </ExitButton>
      </TerminalHeader>

      <TerminalContent>
        <AnimatePresence mode="wait">
          {activeSection === 'boot' && (
            <motion.pre
              key="boot"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ margin: 0, padding: '20px', color: '#00ff00', fontFamily: 'Share Tech Mono, monospace' }}
            >
              {bootText.join('\n')}
            </motion.pre>
          )}
          {activeSection === 'world' && (
            <motion.div
              key="world"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WorldContent />
            </motion.div>
          )}
          {activeSection === 'game' && (
            <motion.div
              key="game"
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ height: '100%' }}
            >
              <GameContent />
            </motion.div>
          )}
        </AnimatePresence>
      </TerminalContent>

      <NavigationButtons>
        <NavButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSectionChange('world')}
        >
          WORLD
        </NavButton>
        <NavButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSectionChange('game')}
        >
          GAME
        </NavButton>
        <NavButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSectionChange('boot')}
        >
          RESET
        </NavButton>
      </NavigationButtons>
    </TerminalContainer>
  );
});

export default MainInterface;
