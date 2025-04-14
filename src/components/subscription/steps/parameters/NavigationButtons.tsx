import React from 'react';
import './NavigationButtons.css';

interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  nextColor?: string;
  nextLabel?: string;
  backLabel?: string;
  disabled?: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  nextColor = '#1976d2',
  nextLabel = 'Next',
  backLabel = 'Back',
  disabled = false
}) => {
  return (
    <div className="navigation-buttons">
      <button
        type="button"
        className="back-button"
        onClick={onBack}
        disabled={disabled}
      >
        {backLabel}
      </button>
      
      <button
        type="button"
        className="next-button"
        style={{ backgroundColor: nextColor, borderColor: nextColor }}
        onClick={onNext}
        disabled={disabled}
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default NavigationButtons;