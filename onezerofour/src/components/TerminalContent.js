import React from 'react';
import styled from 'styled-components';

const ContentLayout = styled.div`
  display: flex;
  height: 100%;
  padding: 10px 10px 10px 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 5px;
  }
`;

const FileTree = styled.div`
  width: 300px;
  font-size: 12px;
  opacity: 0.8;
  background-color: rgba(0, 255, 131, 0.05);
  padding: 10px;
  border-radius: 4px;
  margin-right: 10px;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const SystemInfo = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 20px;
  background-color: rgba(0, 255, 131, 0.05);
  padding: 10px;
  border-radius: 4px;
  white-space: pre-line;
`;

const DisplayArea = styled.div`
  min-height: 200px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(0, 255, 131, 0.2);
  padding-bottom: 20px;
  flex: 1;
  overflow-y: auto;
`;

const ChoiceContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
  position: relative;
`;

const DistrictArrow = styled.div`
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  color: #00ff83;
  font-size: 32px;
  opacity: 0.9;
  cursor: pointer;
  user-select: none;
  z-index: 2;
  text-shadow: 0 0 10px rgba(0, 255, 131, 0.5);
  transition: all 0.3s ease;
  padding: 20px;
  
  &:hover {
    opacity: 1;
    text-shadow: 0 0 15px rgba(0, 255, 131, 0.8);
  }
  
  &.left {
    left: 0;
  }
  
  &.right {
    right: 0;
  }
`;

const ChoiceButton = styled.button`
  background-color: transparent;
  border: 1px solid rgba(0, 255, 131, 0.3);
  color: #00ff83;
  padding: 5px 10px;
  font-family: 'Inconsolata', 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(0, 255, 131, 0.1);
    transform: scale(1.05);
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding: 10px;
  background-color: rgba(0, 255, 131, 0.05);
  border-radius: 4px;
`;

const NavButton = styled.button`
  background-color: transparent;
  border: 1px solid rgba(0, 255, 131, 0.5);
  color: #00ff83;
  padding: 5px 15px;
  font-family: 'Inconsolata', 'Courier New', monospace;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: rgba(0, 255, 131, 0.1);
    transform: scale(1.05);
  }
`;

const ArrowIcon = styled.span`
  font-size: 14px;
  margin: 0 5px;
  color: #00ff83;
`;

export function TerminalContent({ 
  displayText = '', 
  currentStage = '', 
  storyContent = { districts: [] }, 
  onDistrictSelect = () => {},
  showChoices = false,
  onAdvanceNarrative = () => {},
  onNavigateBack = () => {},
  narrativeIndex = 0,
  currentDistrict = null,
  history = []
}) {
  return (
    <ContentLayout>
      <FileTree>
        <div>projects/ 2.7 GiB</div>
        <div>android/ 1.8 GiB</div>
        <div>cache/ 1.2 GiB</div>
        <div>neural-interface/ 512 MiB</div>
      </FileTree>
      
      <MainContent>
        <SystemInfo>
          OS: Arch Linux x86_64
          Host: Neural Interface v2.5
          Kernel: 4.14.51-1-lts
          Connection: Quantum Entanglement
        </SystemInfo>

        <DisplayArea>
          {displayText}
        </DisplayArea>
        
        {showChoices && currentStage === 'districtSelection' && (
          <ChoiceContainer>
            <DistrictArrow className="left">←</DistrictArrow>
            {storyContent.districts.map((district) => (
              <ChoiceButton 
                key={district.id}
                onClick={() => onDistrictSelect(district)}
              >
                {district.name}
              </ChoiceButton>
            ))}
            <DistrictArrow className="right">→</DistrictArrow>
          </ChoiceContainer>
        )}

        {currentStage === 'districtExploration' && currentDistrict && (
          <NavigationContainer>
            <NavButton 
              onClick={onNavigateBack} 
              disabled={history.length === 0}
            >
              <ArrowIcon>←</ArrowIcon> Previous
            </NavButton>
            <NavButton 
              onClick={onAdvanceNarrative}
              disabled={
                !currentDistrict || 
                !currentDistrict.narratives || 
                narrativeIndex >= (currentDistrict.narratives.length - 1)
              }
            >
              Next <ArrowIcon>→</ArrowIcon>
            </NavButton>
          </NavigationContainer>
        )}
      </MainContent>
    </ContentLayout>
  );
}
