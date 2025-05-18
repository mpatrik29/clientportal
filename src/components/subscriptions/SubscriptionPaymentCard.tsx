'use client';

import React, { useEffect, useState } from 'react';
import { account } from '@/app/appwrite';
import { useParams } from 'next/navigation';
import { Calendar, Loader2, CheckCircle, XCircle, ArrowDown, CreditCard, Plus } from 'lucide-react';
import { useToast } from '@/components/toast/toast';
import FlexiblePaymentModal  from './FlexiblePaymentModal';

type Plan = {
  planName: string;
  planType: string;
  investmentMode: 'by_amount' | 'by_weight' | string;
  minimumInvestment: number;
  lockinPeriod: number;
  investmentCycle: string;
  investmentPeriod: string;
  bonusPercentage: number;
  planDescription: string | null;
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
};

type Subscription = {
  $id: string;
  monthlyInvestment: number;
  isActive: boolean;
  startDate: string;
  plan: Plan;
  ledgerEntries?: LedgerEntry[];
  userId?: string;
  $createdAt?: string;
  $updatedAt?: string;
};

type LedgerEntry = {
  $id: string;
  date: string;
  creditedGold: number;
  status: boolean;
  transaction?: {
    id?: string;
    date?: string;
    amount?: number;
  };
  $createdAt?: string;
  $updatedAt?: string;
};

type SubscriptionSummary = {
  totalInvestmentValue: number;
  totalPaid: number;
  remainingAmount: number;
  completionPercentage: number;
  totalCreditedGold: number;
  upcomingPayment?: LedgerEntry;
};

type SubscriptionPaymentCardProps = {
  subscriptionId?: string;
};

export default function SubscriptionPaymentCard({ subscriptionId }: SubscriptionPaymentCardProps) {
  const params = useParams();
  const effectiveSubscriptionId = subscriptionId || (params.id as string);

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [summary, setSummary] = useState<SubscriptionSummary | null>(null);
  const [addingFlexiblePayment, setAddingFlexiblePayment] = useState(false);


  const { showToast } = useToast();


  // Format monthly investment based on investment mode
  const formatMonthlyInvestment = (investment: number, mode?: string) => {
    switch (mode) {
      case 'by_amount':
        return `AED ${investment.toLocaleString()}`;
      case 'by_weight':
        return `${investment} g`;
      default:
        return investment.toString();
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Calculate summary statistics
  const calculateSummary = (subscription: Subscription): SubscriptionSummary => {
    if (!subscription || !subscription.ledgerEntries) {
      return {
        totalInvestmentValue: 0,
        totalPaid: 0,
        remainingAmount: 0,
        completionPercentage: 0,
        totalCreditedGold: 0
      };
    }

    const totalInvestmentValue = 
      subscription.monthlyInvestment * parseInt(subscription.plan.investmentPeriod || '12');
    
    const paidEntries = subscription.ledgerEntries.filter(entry => entry.status);
    const totalPaid = paidEntries.length * subscription.monthlyInvestment;
    
    const totalCreditedGold = paidEntries.reduce((sum, entry) => sum + (entry.creditedGold || 0), 0);
    
    // Find next unpaid entry
    const now = new Date();
    const upcomingPayment = subscription.ledgerEntries
      .filter(entry => !entry.status && new Date(entry.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    return {
      totalInvestmentValue,
      totalPaid,
      remainingAmount: totalInvestmentValue - totalPaid,
      completionPercentage: (totalPaid / totalInvestmentValue) * 100,
      totalCreditedGold,
      upcomingPayment
    };
  };

// Process a payment
const makePayment = async (entryId: string) => {
  setProcessingPayment(true);
  setActiveEntryId(entryId);

  try {
    if (!subscription) return;
    
    // Prepare the payment payload
    const paymentPayload = {
      subscriptionId: subscription.$id,
      ledgerEntryId: entryId,
      paymentDetails: {
        amount: subscription.monthlyInvestment,
        paymentMethod: "card", // Or use a payment method selector in your UI
        reference: `REF_${Date.now()}`, // Generate a reference or get from payment gateway
        notes: "Regular payment"
      }
    };

    const jwt = await account.createJWT();
    // Make the API call to process payment
    const response = await fetch(`http://6828d8457d8a35bc7801.aw-functions.ip-ddns.com/payment/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-appwrite-jwt': jwt.jwt
      },
      body: JSON.stringify(paymentPayload)
    });

    // Parse the response
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Payment processing failed');
    }
    
    // After successful payment request, fetch the updated subscription details
    await fetchSubscriptionDetails(subscription.$id);
    
    // Show success message
    showToast('Payment processed successfully!', 'success');
    
    
  } catch (err: any) {
    console.error('Error processing payment:', err);
    showToast('SPayment failed. Please try again!', 'error');
  } finally {
    setProcessingPayment(false);
    setActiveEntryId(null);
  }
};

// Fetch updated subscription details after payment
const fetchSubscriptionDetails = async (subscriptionId: string) => {
  try {
    const jwt = await account.createJWT();
    const response = await fetch(`http://6828d8457d8a35bc7801.aw-functions.ip-ddns.com/subscription/details`, {
      method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-jwt': jwt.jwt
          },
      body: JSON.stringify({ subscriptionId })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch subscription details');
    }
    
    // Update the subscription state with fresh data
    setSubscription(result);
    setSummary(calculateSummary(result));
    
  } catch (err: any) {
    console.error('Error fetching subscription details:', err);
    
 
    showToast('Failed to update subscription information', 'error');
  }
};


// Add these state variables near the other state declarations
const [showFlexibleModal, setShowFlexibleModal] = useState(false);
const [processingFlexiblePayment, setProcessingFlexiblePayment] = useState(false);

const addFlexiblePayment = () => {
  setShowFlexibleModal(true);
};

const processFlexiblePayment = async (amount: number) => {
  setProcessingFlexiblePayment(true);
  
  try {
    if (!subscription) return;

    const paymentPayload = {
      subscriptionId: subscription.$id,
      paymentDetails: {
        amountPaid: amount,
        paymentMethod: "CARD",
        paymentReference: `FLEX_REF_${Date.now()}`,
      }
    };

    const jwt = await account.createJWT();
    const response = await fetch(`http://6828d8457d8a35bc7801.aw-functions.ip-ddns.com/payment/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-appwrite-jwt': jwt.jwt
      },
      body: JSON.stringify(paymentPayload)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Payment processing failed');
    }
    
    await fetchSubscriptionDetails(subscription.$id);
    showToast('Flexible payment processed successfully!', 'success');
    
  } catch (err: any) {
    console.error('Error processing flexible payment:', err);
    showToast('Flexible payment failed. Please try again!', 'error');
  } finally {
    setProcessingFlexiblePayment(false);
    setShowFlexibleModal(false);
  }
};





  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!effectiveSubscriptionId) {
        setError('No subscription ID provided');
        setLoading(false);
        return;
      }
  
      try {
        const jwt = await account.createJWT();
        const response = await fetch('http://6828d8457d8a35bc7801.aw-functions.ip-ddns.com/subscription/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-appwrite-jwt': jwt.jwt
          },
          body: JSON.stringify({ subscriptionId: effectiveSubscriptionId }),
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription details: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        if (!data) {
          throw new Error('No subscription found');
        }
  
        // Process payment documents into ledger entries
        const ledgerEntries = data.ledgerEntries ? 
          data.ledgerEntries.map((payment:any) => ({
            $id: payment.$id || `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            date: payment.date,
            creditedGold: payment.creditedGold || 0,
            status: payment.status || false,
            transaction: payment.transaction || null,
            $createdAt: payment.$createdAt || null,
            $updatedAt: payment.$updatedAt || null
          })) : [];
  
        // Create subscription object
        const subscriptionDetails = {
          $id: data.$id,
          monthlyInvestment: data.monthlyInvestment,
          isActive: data.isActive,
          startDate: data.$createdAt,
          userId: data.userId,
          $createdAt: data.$createdAt,
          $updatedAt: data.$updatedAt,
          plan: {
            $id: data.plan.$id,
            planName: data.plan.planName,
            planType: data.plan.planType,
            investmentMode: data.plan.investmentMode,
            minimumInvestment: data.plan.minimumInvestment,
            lockinPeriod: data.plan.lockinPeriod,
            investmentCycle: data.plan.investmentCycle,
            investmentPeriod: data.plan.investmentPeriod,
            bonusPercentage: data.plan.bonusPercentage,
            planDescription: data.plan.planDescription,
            $createdAt: data.plan.$createdAt,
            $updatedAt: data.plan.$updatedAt
          },
          ledgerEntries: ledgerEntries
        };
  
        // Calculate summary right here
        const summaryData = calculateSummary(subscriptionDetails);
  
        // Set both states
        setSubscription(subscriptionDetails);
        setSummary(summaryData);
        
        // Log the data we just received, not the state variables
        console.log('Subscription details loaded successfully');
        console.log('Subscription:', subscriptionDetails);
        console.log('Summary:', summaryData);
        console.log('Ledger Entries:', ledgerEntries);
        
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching subscription details:', err);
        setError(error.message || 'Failed to load subscription details.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubscriptionDetails();
  }, [effectiveSubscriptionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading subscription details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md text-red-700">
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return <p className="text-center py-4">No subscription found.</p>;
  }

  const isFlexiblePlan = subscription.plan.planType.toLowerCase() === 'flexible';

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Subscription Details Card */}
      <div className="card shadow-sm bg-white rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Subscription Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="mb-2"><strong>Plan Name:</strong> {subscription.plan.planName}</p>
            <p className="mb-2"><strong>Plan Type:</strong> {subscription.plan.planType}</p>
            <p className="mb-2"><strong>Investment Cycle:</strong> {subscription.plan.investmentCycle}</p>
          </div>
          <div>
            <p className="mb-2"><strong>Investment Period:</strong> {subscription.plan.investmentPeriod} months</p>
            <p className="mb-2">
              <strong>Monthly Investment:</strong> {formatMonthlyInvestment(
                subscription.monthlyInvestment,
                subscription.plan.investmentMode
              )}
            </p>
            <p className="mb-2"><strong>Lock-in Period:</strong> {subscription.plan.lockinPeriod} months</p>
          </div>
          <div>
            <p className="mb-2">
              <strong>Minimum Investment:</strong> {formatMonthlyInvestment(
                subscription.plan.minimumInvestment,
                subscription.plan.investmentMode
              )}
            </p>
            <p className="mb-2"><strong>Bonus Percentage:</strong> {subscription.plan.bonusPercentage}%</p>
            <p className="mb-2">
              <strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${subscription.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {subscription.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Investment Summary Card */}
      {summary && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100">Total Investment Plan</p>
              <p className="text-3xl font-bold">
                {formatMonthlyInvestment(summary.totalInvestmentValue, subscription.plan.investmentMode)}
              </p>
            </div>
            <div>
              <p className="text-blue-100">Paid Amount</p>
              <p className="text-3xl font-bold">
                {formatMonthlyInvestment(summary.totalPaid, subscription.plan.investmentMode)}
              </p>
              <p className="text-sm text-blue-100 mt-1">
                {summary.completionPercentage.toFixed(1)}% complete
              </p>
            </div>
            <div>
              <p className="text-blue-100">Gold Credited</p>
              <p className="text-3xl font-bold">{summary.totalCreditedGold.toFixed(2)}g</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-blue-400">
            <div className="flex justify-between items-center">
              <div>
                {summary.upcomingPayment ? (
                  <>
                    <p className="text-blue-100">Next Payment Due</p>
                    <p className="font-medium">{formatDate(summary.upcomingPayment.date)}</p>
                  </>
                ) : (
                  <p className="text-blue-100">
                    {isFlexiblePlan 
                      ? "" 
                      : "No upcoming payments scheduled"}
                  </p>
                )}
              </div>
              
              {summary.upcomingPayment && (
                <button 
                  className="px-4 py-2 bg-white text-blue-700 rounded-md hover:bg-blue-50 transition-colors flex items-center"
                  onClick={() => makePayment(summary.upcomingPayment?.$id || '')}
                  disabled={processingPayment || !summary.upcomingPayment}
                >
                  {processingPayment && activeEntryId === summary.upcomingPayment?.$id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay Now
                      <CreditCard className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              )}
              
              {/* Add flexible payment button - only shows for flexible plans */}
             
            </div>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="card bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
          
          {/* Alternative location for Add Payment button for flexible plans */}
          {isFlexiblePlan && (
            <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
                onClick={addFlexiblePayment}
                disabled={processingFlexiblePayment}
              >
                {processingFlexiblePayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding payment...
                  </>
                ) : (
                  <>
                    Add Your First Payment
                    <Plus className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
          )}
        </div>
       
        {subscription.ledgerEntries && subscription.ledgerEntries.length > 0 ? (
          <div className="space-y-4">
            {subscription.ledgerEntries.map((entry) => {
              const isPast = new Date(entry.date) < new Date();
              const isProcessing = processingPayment && activeEntryId === entry.$id;
              
              return (
                <div 
                  key={entry.$id}
                  id={entry.$id}
                  className={`border rounded-lg p-4 transition-all ${
                    isPast && !entry.status ? 'bg-red-50 border-red-200' : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center mb-2 md:mb-0">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="font-medium">{formatDate(entry.date)}</span>
                      {isPast && !entry.status && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Overdue</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Amount:</span> {formatMonthlyInvestment(
                          subscription.monthlyInvestment,
                          subscription.plan.investmentMode
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Status:</span>
                        {entry.status ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Paid</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-500">
                            <XCircle className="h-5 w-5 mr-1" />
                            <span>Pending</span>
                          </div>
                        )}
                      </div>
                      
                      {!entry.status && (
                        <button 
                          className={`px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm flex items-center ${
                            isProcessing ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                          onClick={() => {
                            if (!isProcessing) {
                              makePayment(entry.$id);
                            }
                          }}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            'Pay Now'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {entry.creditedGold > 0 && (
                    <div className="mt-2 flex items-center text-yellow-600">
                      <ArrowDown className="h-4 w-4 mr-1" />
                      <span>{entry.creditedGold}g Gold credited</span>
                    </div>
                  )}
                  
                  {entry.transaction && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Transaction ID:</span> {entry.transaction.id}
                      </p>
                      {entry.transaction.date && (
                        <p className="text-gray-600">
                          <span className="font-medium">Transaction Date:</span> {formatDate(entry.transaction.date)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No payment history available.</p>
            {isFlexiblePlan && (
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center mx-auto"
                onClick={addFlexiblePayment}
                disabled={processingFlexiblePayment}
              >
                {processingFlexiblePayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding payment...
                  </>
                ) : (
                  <>
                    Add Your First Payment
                    <Plus className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      <FlexiblePaymentModal
      isOpen={showFlexibleModal}
      onClose={() => setShowFlexibleModal(false)}
      onConfirm={processFlexiblePayment}
      isProcessing={processingFlexiblePayment}
      subscriptionDetails={{
        minPayment: subscription?.plan.minimumInvestment,
        goldRate: 8000 // You can get this from your API or config
      }}
    />
      
      {/* CSS for highlighting newly added payment entry */}
      <style jsx>{`
        @keyframes highlight {
          0% { background-color: #dbeafe; }
          50% { background-color: #eff6ff; }
          100% { background-color: white; }
        }
        
        .highlight-new-entry {
          animation: highlight 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}