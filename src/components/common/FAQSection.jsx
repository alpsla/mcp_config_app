import React from 'react';
import FAQItem from './FAQItem';
import '../../styles/components/FAQ.css';

const FAQSection = ({ title, faqs }) => {
  return (
    <section className="faq">
      <div className="container">
        <h2 className="section-title">{title || "Frequently Asked Questions"}</h2>
        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
              question={faq.question}
              answer={faq.answer}
              isInitiallyOpen={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;