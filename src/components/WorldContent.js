import * as React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import storyService from '../services/storyService';

const ContentContainer = styled.div`
  display: flex;
  align-items: stretch;
  height: 100%;
  gap: 20px;
  padding: 20px;
`;

const NavigationArrow = styled(motion.button)`
  background: transparent;
  border: none;
  color: #00ff00;
  font-size: 2rem;
  cursor: pointer;
  padding: 0 10px;
  display: flex;
  align-items: center;
  opacity: ${props => props.disabled ? '0.3' : '1'};
  transition: all 0.3s ease;
  text-shadow: 0 0 10px #00ff00;

  &:hover:not(:disabled) {
    text-shadow: 0 0 20px #00ff00;
    transform: scale(1.1);
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ContentText = styled(motion.div)`
  flex-grow: 1;
  background: rgba(0, 17, 0, 0.3);
  border: 1px solid #00ff00;
  padding: 20px;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #001100;
  }

  &::-webkit-scrollbar-thumb {
    background: #00ff00;
    border-radius: 3px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
  }
`;

const PageIndicator = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 5px #00ff00;
`;

const ContentHeader = styled.div`
  font-size: 1.2em;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #00ff00;
  text-shadow: 0 0 5px #00ff00;
`;

const TextContent = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  line-height: 1.6;
  color: #00ff00;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
`;

const WorldContent = React.memo(() => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const worldContent = React.useMemo(() => storyService.getWorldContent(), []);

  const handleNext = React.useCallback(() => {
    if (currentIndex < worldContent.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, isTransitioning, worldContent.length]);

  const handlePrevious = React.useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, isTransitioning]);

  React.useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const contentVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return (
    <ContentContainer>
      <NavigationArrow
        as={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handlePrevious}
        disabled={currentIndex === 0 || isTransitioning}
      >
        &#9664;
      </NavigationArrow>

      <ContentText>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <ContentHeader>
              ARCHIVE FILE #{currentIndex + 1}
            </ContentHeader>
            <TextContent>
              {worldContent[currentIndex]}
            </TextContent>
          </motion.div>
        </AnimatePresence>
      </ContentText>

      <NavigationArrow
        as={motion.button}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleNext}
        disabled={currentIndex === worldContent.length - 1 || isTransitioning}
      >
        &#9654;
      </NavigationArrow>

      <PageIndicator>
        FILE {currentIndex + 1} / {worldContent.length}
      </PageIndicator>
    </ContentContainer>
  );
});

export default WorldContent;
