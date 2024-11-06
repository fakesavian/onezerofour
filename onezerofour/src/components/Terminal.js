import React, { useState, useEffect, useCallback, useRef } from 'react';
import storyContent from '../data/storyContent.json';
import { 
  TerminalActivator, 
  DraggableTerminalWindow, 
  NavigationContainer,
  NavigationButton,
  HomeButton,
  TerminalContentContainer,
  TextDisplay,
  MatrixRainEffect
} from './TerminalStyles';
import { TerminalContent } from './TerminalContent';

function Terminal() {
  const [currentStage, setCurrentStage] = useState('initialConnection');
  const [displayText, setDisplayText] = useState('');
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [showChoices, setShowChoices] = useState(false);
  const [narrativeIndex, setNarrativeIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [history, setHistory] = useState([]);
  const textDisplayRef = useRef(null);
  const typeIntervalRef = useRef(null);

  const typewriterEffect = useCallback((text, callback) => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
    }

    let index = 0;
    // Ensure the first character is immediately visible
    setDisplayText(text.charAt(0));
    index = 1;

    typeIntervalRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text.charAt(index));
        index++;
        
        if (textDisplayRef.current) {
          textDisplayRef.current.scrollTop = textDisplayRef.current.scrollHeight;
        }
      } else {
        clearInterval(typeIntervalRef.current);
        if (callback) callback();
      }
    }, 30);

    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
      }
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);
      setCurrentStage('initialConnection');
      setCurrentDistrict(null);
      setNarrativeIndex(0);
      setHistory([]);
    }, 1000); // Match the animation duration
  };

  const navigateBack = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setCurrentStage(lastState.stage);
      setCurrentDistrict(lastState.district);
      setNarrativeIndex(lastState.narrativeIndex);
      setHistory(prev => prev.slice(0, -1));
      
      if (lastState.stage === 'initialConnection') {
        setDisplayText(storyContent.initialConnection.text);
      } else if (lastState.stage === 'districtExploration' && lastState.district) {
        setDisplayText(lastState.district.narratives[lastState.narrativeIndex]);
      }
    }
  };

  const advanceNarrative = () => {
    if (currentDistrict && currentDistrict.narratives) {
      const nextIndex = (narrativeIndex + 1) % currentDistrict.narratives.length;
      setNarrativeIndex(nextIndex);
      
      typewriterEffect(currentDistrict.narratives[nextIndex], () => {
        setShowChoices(true);
      });
    }
  };

  const handleDistrictSelect = (district) => {
    setHistory(prev => [...prev, {
      stage: currentStage,
      district: currentDistrict,
      narrativeIndex: narrativeIndex
    }]);

    setCurrentDistrict(district);
    setCurrentStage('districtExploration');
    setNarrativeIndex(0);
    
    typewriterEffect(district.narratives[0], () => {
      setShowChoices(true);
    });
  };

  useEffect(() => {
    return () => {
      if (typeIntervalRef.current) {
        clearInterval(typeIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setShowChoices(false);
    switch(currentStage) {
      case 'initialConnection':
        typewriterEffect(storyContent.initialConnection.text, () => {
          setTimeout(() => {
            setCurrentStage('districtSelection');
            setShowChoices(true);
          }, 1000);
        });
        break;
      case 'districtSelection':
        typewriterEffect("Select target system:", () => {
          setShowChoices(true);
        });
        break;
      case 'districtExploration':
        if (currentDistrict?.narratives) {
          typewriterEffect(currentDistrict.narratives[narrativeIndex], () => {
            setShowChoices(true);
          });
        }
        break;
      default:
        typewriterEffect("System recalibrating...");
    }
  }, [currentStage, currentDistrict, narrativeIndex, typewriterEffect]);

  if (!isOpen) {
    return (
      <TerminalActivator onClick={() => setIsOpen(true)}>
        Activate Terminal
      </TerminalActivator>
    );
  }

  return (
    <DraggableTerminalWindow isClosing={isClosing}>
      <MatrixRainEffect isClosing={isClosing} />
      <HomeButton onClick={handleClose}>✕</HomeButton>
      <TerminalContentContainer>
        <TextDisplay ref={textDisplayRef}>
          <TerminalContent 
            displayText={displayText}
            currentStage={currentStage}
            storyContent={storyContent}
            onDistrictSelect={handleDistrictSelect}
            showChoices={showChoices}
          />
        </TextDisplay>
        
        <NavigationContainer>
          <NavigationButton 
            onClick={navigateBack} 
            disabled={history.length === 0}
          >
            &#10094;
          </NavigationButton>
          {currentStage === 'districtExploration' && (
            <NavigationButton 
              onClick={advanceNarrative}
            >
              &#10095;
            </NavigationButton>
          )}
        </NavigationContainer>
      </TerminalContentContainer>
    </DraggableTerminalWindow>
  );
}

export default Terminal;
