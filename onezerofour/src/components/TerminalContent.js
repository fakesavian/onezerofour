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

export function TerminalContent({ 
  displayText, 
  currentStage, 
  storyContent, 
  onDistrictSelect,
  showChoices
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
            {storyContent.districts.map((district) => (
              <ChoiceButton 
                key={district.id}
                onClick={() => onDistrictSelect(district)}
              >
                {district.name}
              </ChoiceButton>
            ))}
          </ChoiceContainer>
        )}
      </MainContent>
    </ContentLayout>
  );
}
