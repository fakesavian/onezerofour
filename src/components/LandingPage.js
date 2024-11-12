import * as React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence } from 'framer-motion';

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100vh);
  }
`;

const glow = keyframes`
  from {
    text-shadow: 0 0 5px #0f0, 0 0 10px #0f0;
  }
  to {
    text-shadow: 0 0 10px #0f0, 0 0 20px #0f0;
  }
`;

const LandingContainer = styled.div`
  position: relative;
  min-height: 100vh;
  background-color: #000;
  color: #0f0;
  font-family: 'Courier New', monospace;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    z-index: 1;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 800px;
`;

const HeaderInfo = styled.div`
  margin-bottom: 30px;
  text-align: left;
`;

const TerminalLine = styled(motion.div)`
  margin: 5px 0;
  opacity: 0.8;
`;

const AsciiTitle = styled.pre`
  font-family: monospace;
  font-size: 1rem;
  white-space: pre;
  text-align: center;
  color: #0f0;
  margin: 40px 0;
  text-shadow: 0 0 5px #0f0;
  animation: ${glow} 1.5s ease-in-out infinite alternate;
  line-height: 1.2;
`;

const StartButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #0f0;
  color: #0f0;
  padding: 15px 40px;
  font-family: 'Courier New', monospace;
  font-size: 20px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 0, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 30px;
  border: 2px solid #0f0;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
`;

const LoadingBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    #0f0,
    transparent
  );
`;

const Scanline = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 255, 0, 0.1),
    transparent
  );
  animation: ${scanline} 4s linear infinite;
  pointer-events: none;
  z-index: 3;
`;

const LandingPage = ({ onEnter }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleEnter = React.useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      onEnter();
    }, 3000);
  }, [onEnter]);

  React.useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && !isLoading) {
        handleEnter();
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [handleEnter, isLoading]);

  const terminalLines = [
    '> SYSTEM INITIALIZATION...',
    '> TERMINAL ACCESS: GRANTED',
    '> SECURITY PROTOCOL: ACTIVE',
    '> AWAITING USER INPUT...'
  ];

  const asciiArt = `
 ██▓    ▄▄▄       █     █░▓█████  ██▓    ▓█████   ██████   ██████ 
▓██▒   ▒████▄    ▓█░ █ ░█░▓█   ▀ ▓██▒    ▓█   ▀ ▒██    ▒ ▒██    ▒ 
▒██░   ▒██  ▀█▄  ▒█░ █ ░█ ▒███   ▒██░    ▒███   ░ ▓██▄   ░ ▓██▄   
▒██░   ░██▄▄▄▄██ ░█░ █ ░█ ▒▓█  ▄ ▒██░    ▒▓█  ▄   ▒   ██▒  ▒   ██▒
░██████▒▓█   ▓██▒░░██▒██▓ ░▒████▒░██████▒░▒████▒▒██████▒▒▒██████▒▒
░ ▒░▓  ░▒▒   ▓▒█░░ ▓░▒ ▒  ░░ ▒░ ░░ ▒░▓  ░░░ ▒░ ░▒ ▒▓▒ ▒ ░▒ ▒▓▒ ▒ ░
░ ░ ▒  ░ ▒   ▒▒ ░  ▒ ░ ░   ░ ░  ░░ ░ ▒  ░ ░ ░  ░░ ░▒  ░ ░░ ░▒  ░ ░
  ░ ░    ░   ▒     ░   ░     ░     ░ ░      ░   ░  ░  ░  ░  ░  ░  
    ░  ░     ░  ░    ░       ░  ░    ░  ░   ░  ░      ░        ░  `;

  return (
    <LandingContainer>
      <Scanline />
      <ContentWrapper>
        <HeaderInfo>
          <AnimatePresence>
            {terminalLines.map((line, index) => (
              <TerminalLine
                key={line}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                {line}
              </TerminalLine>
            ))}
          </AnimatePresence>
        </HeaderInfo>

        <AsciiTitle>{asciiArt}</AsciiTitle>

        {!isLoading ? (
          <StartButton
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px #0f0' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
          >
            START
          </StartButton>
        ) : (
          <LoadingContainer>
            <LoadingBar
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </LoadingContainer>
        )}
      </ContentWrapper>
    </LandingContainer>
  );
};

export default LandingPage;
