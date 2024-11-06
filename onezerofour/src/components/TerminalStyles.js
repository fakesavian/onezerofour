import styled, { keyframes } from 'styled-components';

export {
  TerminalActivator,
  MatrixRainEffect,
  DraggableTerminalWindow,
  TerminalContentContainer,
  NavigationContainer,
  NavigationButton,
  HomeButton,
  TextDisplay
};

const scanLineAnimation = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 -300px;
  }
`;

const matrixRain = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const glitchAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1) skew(0deg);
    opacity: 1;
  }
  20% {
    transform: translate(-52%, -48%) scale(1.02) skew(2deg);
    opacity: 0.9;
  }
  40% {
    transform: translate(-48%, -52%) scale(0.98) skew(-2deg);
    opacity: 0.8;
  }
  60% {
    transform: translate(-51%, -49%) scale(1.01) skew(1deg);
    opacity: 0.6;
  }
  80% {
    transform: translate(-49%, -51%) scale(0.99) skew(-1deg);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(0) skew(0deg);
    opacity: 0;
  }
`;

const crtDistortion = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  25% {
    transform: translate(-50%, -50%) scale(1.001);
  }
  75% {
    transform: translate(-50%, -50%) scale(0.999);
  }
`;

export const TerminalActivator = styled.button`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: rgba(0, 255, 131, 0.2);
  border: 2px solid #00ff83;
  color: #00ff83;
  padding: 15px 30px;
  font-family: 'Inconsolata', 'Courier New', monospace;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    background-color: rgba(0, 255, 131, 0.4);
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 0 15px rgba(0, 255, 131, 0.5);
  }
`;

export const MatrixRainEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  opacity: ${props => props.isClosing ? 1 : 0};
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    rgba(0, 255, 131, 0.05) 1px,
    rgba(0, 255, 131, 0.05) 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 3px
  );
  animation: ${matrixRain} 1s linear infinite;
  transition: opacity 0.3s ease;
`;

export const DraggableTerminalWindow = styled.div`
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
  width: min(900px, 90vw);
  height: min(700px, 90vh);
  margin: 0;
  background-color: #001a1a;
  color: #00ff83;
  font-family: 'Inconsolata', 'Courier New', monospace;
  padding: 40px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 1100;
  box-shadow: 0 0 20px rgba(0, 255, 131, 0.3);
  border: 1px solid rgba(0, 255, 131, 0.5);
  animation: ${props => props.isClosing ? glitchAnimation : crtDistortion} ${props => props.isClosing ? '1s' : '0.5s'} ${props => props.isClosing ? 'ease-in forwards' : 'infinite alternate'};
  
  // CRT and VHS effects
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
    animation: ${scanLineAnimation} 7.5s linear infinite;
    opacity: 0.1;
    z-index: 2;
  }
`;

export const TerminalContentContainer = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

export const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding: 20px 0 10px;
  gap: 20px;
`;

export const NavigationButton = styled.button`
  background-color: transparent;
  border: none;
  color: #00ff83;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
  padding: 5px 15px;
  min-width: 40px;
  text-align: center;

  &:hover {
    color: rgba(0, 255, 131, 0.7);
  }

  &:disabled {
    color: rgba(0, 255, 131, 0.3);
    cursor: not-allowed;
  }
`;

export const HomeButton = styled(NavigationButton)`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  color: #00ff83;
  font-size: 18px;
  padding: 10px;
  min-width: 30px;
  background-color: rgba(0, 255, 131, 0.1);
  border-radius: 0;
  border-left: 1px solid rgba(0, 255, 131, 0.3);
  border-bottom: 1px solid rgba(0, 255, 131, 0.3);

  &:hover {
    background-color: rgba(0, 255, 131, 0.2);
  }
`;

export const TextDisplay = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 10px;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;
