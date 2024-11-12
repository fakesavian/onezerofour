import * as React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
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
    z-index: 1;
  }
`;

const DialogueBox = styled(motion.div)`
  background: rgba(0, 17, 0, 0.3);
  border: 1px solid #00ff00;
  padding: 20px;
  flex-grow: 1;
  position: relative;
  overflow-y: auto;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
  z-index: 2;

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
    box-shadow: 0 0 15px #00ff00;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.5), transparent);
  }
`;

const TextContainer = styled.div`
  flex-grow: 1;
  margin-bottom: ${props => props.showChoices ? '20px' : '0'};
  position: relative;
`;

const ChoicesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  position: relative;
  padding-top: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
  }
`;

const ChoiceButton = styled(motion.button)`
  background: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 15px;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: left;
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);

  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
    border-color: #00ff00;
    text-shadow: 0 0 8px rgba(0, 255, 0, 0.8);
  }

  &::before {
    content: '>';
    margin-right: 10px;
    opacity: 0;
    transition: all 0.3s ease;
    text-shadow: 0 0 5px #00ff00;
  }

  &:hover::before {
    opacity: 1;
    transform: translateX(5px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: transparent;
      box-shadow: none;
    }
    &::before {
      opacity: 0;
    }
  }
`;

const TypewriterText = styled(motion.pre)`
  white-space: pre-wrap;
  font-family: 'Share Tech Mono', 'Courier New', monospace;
  line-height: 1.6;
  margin: 0;
  color: #00ff00;
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
  position: relative;
  z-index: 2;
`;

const Cursor = styled.span`
  display: inline-block;
  width: 8px;
  height: 1.2em;
  background-color: #00ff00;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  vertical-align: text-top;
  box-shadow: 0 0 5px #00ff00;

  @keyframes blink {
    from, to {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }
`;

const GameContent = React.memo(() => {
  const { currentScene, displayedText, isTyping, showChoices, handleChoice } = useGame();

  const contentVariants = React.useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }), []);

  const choiceVariants = React.useMemo(() => ({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { x: 10, transition: { duration: 0.2 } }
  }), []);

  if (!currentScene) {
    return null;
  }

  return (
    <GameContainer>
      <DialogueBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
      >
        <TextContainer showChoices={showChoices}>
          <TypewriterText>
            {displayedText}
            {isTyping && <Cursor />}
          </TypewriterText>
        </TextContainer>

        <AnimatePresence mode="wait">
          {showChoices && currentScene.choices && (
            <ChoicesContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              {currentScene.choices.map((choice, index) => (
                <ChoiceButton
                  key={`${currentScene.id}-${index}`}
                  onClick={() => handleChoice(index)}
                  disabled={isTyping}
                  variants={choiceVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  {choice.text}
                </ChoiceButton>
              ))}
            </ChoicesContainer>
          )}
        </AnimatePresence>
      </DialogueBox>
    </GameContainer>
  );
});

export default GameContent;
