import { useState, useEffect, Fragment } from 'react';

interface FlexiblePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  isProcessing: boolean;
  subscriptionDetails?: {
    minPayment?: number;
    goldRate?: number;
  };
}

const FlexiblePaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  subscriptionDetails = { minPayment: 1000, goldRate: 8000 }
}: FlexiblePaymentModalProps) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(subscriptionDetails.minPayment || 1000);
  const [estimatedGold, setEstimatedGold] = useState<number>(0);
  
  // Calculate estimated gold whenever amount changes
  useEffect(() => {
    const goldRate = subscriptionDetails.goldRate || 8000;
    setEstimatedGold(parseFloat((paymentAmount / goldRate).toFixed(2)));
  }, [paymentAmount, subscriptionDetails.goldRate]);
  
  // Reset payment amount when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentAmount(subscriptionDetails.minPayment || 1000);
    }
  }, [isOpen, subscriptionDetails.minPayment]);
  
  const handleConfirm = () => {
    onConfirm(paymentAmount);
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Make a Flexible Payment</h3>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          <label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700">
            Payment Amount
          </label>
          <input
            id="paymentAmount"
            type="number"
            min={subscriptionDetails.minPayment || 1000}
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
            disabled={isProcessing}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed px-3 py-2 border"
          />
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Estimated Gold: {estimatedGold} grams</p>
            <p className="mt-1">Note: The actual gold credited may vary based on current gold rates.</p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || paymentAmount < (subscriptionDetails.minPayment || 1000)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlexiblePaymentModal;