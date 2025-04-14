import React from 'react';

interface ParameterSectionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A container component for parameter sections
 * Uses proper React components instead of direct DOM manipulation
 */
const ParameterSection: React.FC<ParameterSectionProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`parameter-section ${className}`}>
      {children}
    </div>
  );
};

export default ParameterSection;