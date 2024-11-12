import * as React from 'react';
import storyService from '../services/storyService';

const GameContext = React.createContext();

const GameStates = {
  IDLE: 'IDLE',
  TYPING: 'TYPING',
  SHOWING_CHOICES: 'SHOWING_CHOICES'
};

const initialState = {
  currentScene: storyService.getInitialScene(),
  displayedText: '',
  gameState: GameStates.IDLE,
  showChoices: false
};

function gameReducer(state, action) {
  console.log('Reducer action:', action.type, action.payload);
  switch (action.type) {
    case 'START_TYPING':
      return {
        ...state,
        gameState: GameStates.TYPING,
        displayedText: '',
        showChoices: false
      };
    case 'UPDATE_TEXT':
      return {
        ...state,
        displayedText: action.payload
      };
    case 'FINISH_TYPING':
      return {
        ...state,
        gameState: GameStates.SHOWING_CHOICES,
        showChoices: true
      };
    case 'SET_SCENE':
      return {
        ...state,
        currentScene: action.payload,
        gameState: GameStates.IDLE,
        displayedText: '',
        showChoices: false
      };
    case 'RESET':
      return {
        ...initialState,
        currentScene: storyService.getInitialScene()
      };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = React.useReducer(gameReducer, initialState);
  const typewriterRef = React.useRef(null);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    console.log('GameProvider mounted');
    mountedRef.current = true;
    return () => {
      console.log('GameProvider unmounting');
      mountedRef.current = false;
      if (typewriterRef.current) {
        clearInterval(typewriterRef.current);
      }
    };
  }, []);

  const startTypewriter = React.useCallback((text) => {
    console.log('Starting typewriter with text:', text);
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
    }

    dispatch({ type: 'START_TYPING' });

    let currentChar = 0;
    const textLength = text.length;

    const typeWriter = setInterval(() => {
      if (!mountedRef.current) {
        console.log('Component unmounted, clearing typewriter');
        clearInterval(typeWriter);
        return;
      }

      if (currentChar < textLength) {
        const newText = text.slice(0, currentChar + 1);
        console.log('Typing:', newText);
        dispatch({ type: 'UPDATE_TEXT', payload: newText });
        currentChar++;
      } else {
        console.log('Finished typing');
        clearInterval(typeWriter);
        typewriterRef.current = null;
        if (mountedRef.current) {
          setTimeout(() => {
            if (mountedRef.current) {
              console.log('Showing choices');
              dispatch({ type: 'FINISH_TYPING' });
            }
          }, 300);
        }
      }
    }, 15); // Reduced from 30 to 15 for faster typing

    typewriterRef.current = typeWriter;
  }, []);

  React.useEffect(() => {
    console.log('Current game state:', state.gameState);
    if (state.gameState === GameStates.IDLE && state.currentScene?.text) {
      startTypewriter(state.currentScene.text);
    }
  }, [state.gameState, state.currentScene, startTypewriter]);

  const handleChoice = React.useCallback((choiceIndex) => {
    console.log('Choice selected:', choiceIndex);
    if (!mountedRef.current || state.gameState !== GameStates.SHOWING_CHOICES) return;

    const nextSceneId = state.currentScene.choices[choiceIndex].nextScene;
    console.log('Loading next scene:', nextSceneId);
    
    try {
      const nextSceneData = storyService.getScene(nextSceneId);
      console.log('Next scene data:', nextSceneData);
      dispatch({
        type: 'SET_SCENE',
        payload: nextSceneData
      });
    } catch (error) {
      console.error('Error loading next scene:', error);
    }
  }, [state.currentScene, state.gameState]);

  const resetGame = React.useCallback(() => {
    console.log('Resetting game');
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }
    dispatch({ type: 'RESET' });
  }, []);

  const value = React.useMemo(() => ({
    currentScene: state.currentScene,
    displayedText: state.displayedText,
    isTyping: state.gameState === GameStates.TYPING,
    showChoices: state.showChoices,
    handleChoice,
    resetGame
  }), [state, handleChoice, resetGame]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
