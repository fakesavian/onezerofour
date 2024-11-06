import React from 'react';
import styled from 'styled-components';

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const IconImage = styled.img`
  width: 64px;
  height: 64px;
`;

const IconLabel = styled.span`
  color: #00FF41;
  font-family: 'Courier New', monospace;
  margin-top: 5px;
  text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
`;

function DesktopIcon({ onClick, icon, label }) {
  return (
    <IconContainer onClick={onClick}>
      <IconImage src={icon} alt={label} />
      <IconLabel>{label}</IconLabel>
    </IconContainer>
  );
}

export default DesktopIcon;
