import React from 'react';
import { InfoIcon } from '../icons';
import './CompactFooter.css';

/**
 * A compact footer component that stays close to the content
 */
const CompactFooter = ({ learnMoreLink = "#/learn-more" }) => {
  return (
    <div className="compact-footer">
      <div className="compact-notice">
        <InfoIcon className="info-icon" />
        <p>Desktop Application Required: These integrations require the Claude Desktop application.</p>
        <a href={learnMoreLink}>Learn More</a>
      </div>
    </div>
  );
};

export default CompactFooter;