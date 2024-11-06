import React, { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { trackPerformance, logUserInteraction } from '../utils/performanceTracker';
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
  const [performanceMetrics, setPerformanceMetrics] = useState({});

  // Memoize expensive computations
  const availableDistricts = useMemo(() => 
    storyContent.districts || [], 
    [storyContent]
  );
  const textDisplayRef = useRef(null);
  const typeIntervalRef = useRef(null);

  const typewriterEffect = useCallback((text, callback) => {
    const startTime = performance.now();

    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
    }

    let index = 0;
    const typedText = [];

    const updateDisplay = () => {
      if (index < text.length) {
        typedText.push(text.charAt(index));
        setDisplayText(typedText.join(''));
        index++;
        
        if (textDisplayRef.current) {
          textDisplayRef.current.scrollTop = textDisplayRef.current.scrollHeight;
        }
      } else {
        clearInterval(typeIntervalRef.current);
        const endTime = performance.now();
        setPerformanceMetrics(prev => ({
          ...prev,
          typewriterDuration: endTime - startTime
        }));
        if (callback) callback();
      }
    };

    // Use requestAnimationFrame for smoother rendering
    typeIntervalRef.current = setInterval(updateDisplay, 25);

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
    <ErrorBoundary 
      fallback={<div>Something went wrong. Please reload.</div>}
      onError={(error, info) => {
        console.error('Error caught by boundary:', error, info);
        // Optional: Send error to logging service
      }}
    >
      <DraggableTerminalWindow 
        isClosing={isClosing} 
        aria-label="Interactive Terminal Interface"
      >
        <MatrixRainEffect isClosing={isClosing} />
        <HomeButton 
          onClick={handleClose} 
          aria-label="Close Terminal"
          title="Close Terminal"
        >
          ✕
        </HomeButton>
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
            ◄
          </NavigationButton>
          {currentStage === 'districtExploration' && (
            <NavigationButton 
              onClick={advanceNarrative}
            >
              ►
            </NavigationButton>
          )}
        </NavigationContainer>
      </TerminalContentContainer>
    </DraggableTerminalWindow>
  );
}

export default Terminal;
export const trackPerformance = (metricName, startTime) => {
  const endTime = performance.now();
  const duration = endTime - startTime;

  // Log or send to performance monitoring service
  console.log(`Performance: ${metricName} took ${duration}ms`);

  return duration;
};

export const logUserInteraction = (action, metadata = {}) => {
  console.log('User Interaction:', {
    action,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};
