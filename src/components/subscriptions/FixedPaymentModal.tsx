import { useState, useEffect } from 'react';

interface FixedPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
  subscriptionDetails?: {
    monthlyInvestment?: number;
    goldRate?: number;
    investmentMode?: string;
    minPayment?: number;
    ledgerEntryId?:string;
  };
}

const FixedPaymentModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  subscriptionDetails = { 
    monthlyInvestment: 1000, 
    goldRate: 8000,
    investmentMode: 'byAmount',
    minPayment: 1000,
    ledgerEntryId: ''
  }
}: FixedPaymentModalProps) => {
  const [paymentAmount, setPaymentAmount] = useState<number>(subscriptionDetails.monthlyInvestment || 1000);
  const [goldVolume, setGoldVolume] = useState<number>(0);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const isByVolume = subscriptionDetails.investmentMode === 'byVolume';
  const [entryId, setEntryId] = useState<string | undefined>(undefined);
  // Calculate values based on investment mode
  useEffect(() => {
    const goldRate = subscriptionDetails.goldRate || 8000;
    setEntryId(subscriptionDetails.ledgerEntryId);
    if (isByVolume) {
      // If by volume, goldVolume is the input and we calculate payment
      setPaymentAmount(parseFloat((goldVolume * goldRate).toFixed(2)));
    } else {
      // If by amount, payment is the input and we calculate gold
      setGoldVolume(parseFloat((paymentAmount / goldRate).toFixed(3)));
    }
  }, [paymentAmount, goldVolume, subscriptionDetails.goldRate, isByVolume]);
  
  // Reset values when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isByVolume) {
        // Default gold volume (e.g., 0.5 grams)
        const defaultVolume = subscriptionDetails.monthlyInvestment 
          ? (subscriptionDetails.monthlyInvestment / (subscriptionDetails.goldRate || 8000)) 
          : 0.5;
        setGoldVolume(parseFloat(defaultVolume.toFixed(3)));
      } else {
        setPaymentAmount(subscriptionDetails.monthlyInvestment || 1000);
      }
      setConsentGiven(false);
    }
  }, [isOpen, subscriptionDetails, isByVolume]);
  
  const handleConfirm = () => {
    if (!entryId) {
      console.error("Entry ID is undefined");
      return;
    }
    onConfirm();
  };
  
  const handleInputChange = (value: number) => {
    if (isByVolume) {
      setGoldVolume(value);
    } else {
      setPaymentAmount(value);
    }
  };

  const getMinValue = () => {
    if (isByVolume) {
      // Convert minimum payment to minimum gold volume
      const minPayment = subscriptionDetails.minPayment || 1000;
      return parseFloat((minPayment / (subscriptionDetails.goldRate || 8000)).toFixed(3));
    }
    return subscriptionDetails.minPayment || 1000;
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
          <p>Ledger Entry ID: {entryId}</p>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          <label htmlFor="paymentInput" className="block text-sm font-medium text-gray-700">
            {isByVolume ? 'Gold Volume (grams)' : 'Payment Amount'}
          </label>
          <input
            id="paymentInput"
            type="number"
            min={getMinValue()}
            step={isByVolume ? 0.001 : 1}
            value={isByVolume ? goldVolume : paymentAmount}
            onChange={(e) => handleInputChange(parseFloat(e.target.value))}
            disabled={isProcessing}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed px-3 py-2 border"
          />
          
          <div className="mt-4 text-sm text-gray-500">
            {isByVolume ? (
              <p>Effective Payment: ₹{paymentAmount.toLocaleString()}</p>
            ) : (
              <p>Equivalent Gold: {goldVolume.toFixed(3)} grams</p>
            )}
            <p className="mt-1">Gold Rate: ₹{subscriptionDetails.goldRate?.toLocaleString()} per gram</p>
          </div>
          
          {/* Consent Checkbox */}
          <div className="mt-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                disabled={isProcessing}
                className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                I understand that the actual gold credited may vary based on the gold rate at the time of transaction. 
                By proceeding, I agree to the terms and conditions of this purchase.
              </span>
            </label>
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
            disabled={
              isProcessing || 
              !consentGiven || 
              (isByVolume ? goldVolume < getMinValue() : paymentAmount < (subscriptionDetails.minPayment || 1000))
            }
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Confirm Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FixedPaymentModal;