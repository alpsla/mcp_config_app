import React from 'react';
import { PricingInfo } from './usePricing';

interface OrderSummaryProps {
  pricingInfo: PricingInfo;
}

/**
 * Component for rendering the order summary
 * Uses pricing information from SubscriptionFlowContext via usePricing hook
 */
const OrderSummary: React.FC<OrderSummaryProps> = ({ pricingInfo }) => {
  const { displayName, price, lightColor } = pricingInfo;
  
  console.log('OrderSummary rendering with:');
  console.log('- displayName:', displayName);
  console.log('- price:', price);
  
  return (
    <div style={{ 
      maxWidth: '650px', 
      margin: '0 auto 30px', 
      padding: '20px', 
      backgroundColor: lightColor || 'rgb(237, 231, 246)', 
      borderRadius: '10px' 
    }}>
      <div style={{ fontWeight: 'bold', color: 'rgb(51, 51, 51)', marginBottom: '12px', fontSize: '18px' }}>Order Summary</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '10px 0px', borderBottom: '1px solid rgb(225, 217, 240)' }}>
        <div style={{ fontWeight: 500 }}>
          {displayName} (Monthly)
        </div>
        <div style={{ fontWeight: 'bold' }}>
          {price}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0px', color: 'rgb(51, 51, 51)', fontWeight: 'bold', fontSize: '16px' }}>
        <div>Total (billed monthly)</div>
        <div>{price}/month</div>
      </div>
    </div>
  );
};

export default OrderSummary;