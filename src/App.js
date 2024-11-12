import * as React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import MainInterface from './components/MainInterface';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const App = () => {
  const [showLanding, setShowLanding] = React.useState(true);

  const handleEnter = React.useCallback(() => {
    setShowLanding(false);
  }, []);

  const handleExit = React.useCallback(() => {
    setShowLanding(true);
  }, []);

  return (
    <AppContainer>
      <AnimatePresence mode="wait">
        {showLanding ? (
          <ContentWrapper
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onEnter={handleEnter} />
          </ContentWrapper>
        ) : (
          <ContentWrapper
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MainInterface onExit={handleExit} />
          </ContentWrapper>
        )}
      </AnimatePresence>
    </AppContainer>
  );
};

export default App;
