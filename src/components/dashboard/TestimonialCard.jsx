import React from 'react';
import './TestimonialCard.css';

const TestimonialCard = ({ testimonial }) => {
  // Generate initials for avatar placeholder
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        {testimonial.avatar ? (
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="avatar" 
          />
        ) : (
          <div className="avatar-placeholder">
            {getInitials(testimonial.name)}
          </div>
        )}
        
        <div className="user-info">
          <h4 className="user-name">{testimonial.name}</h4>
          <p className="user-role">{testimonial.role}, {testimonial.company}</p>
        </div>
        
        <div className="model-badge">
          {testimonial.model}
        </div>
      </div>
      
      <blockquote className="testimonial-quote">
        "{testimonial.testimonial}"
      </blockquote>
    </div>
  );
};

export default TestimonialCard;