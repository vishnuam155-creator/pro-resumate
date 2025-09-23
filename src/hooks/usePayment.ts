import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PaymentData {
  planName: string;
  amount: number;
  currency: string;
}

interface PaymentResponse {
  success: boolean;
  payment_url?: string;
  session_id?: string;
  error?: string;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processPayment = async (
    paymentData: PaymentData,
    authToken: string
  ): Promise<PaymentResponse> => {
    setIsProcessing(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/payments/create-payment-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          plan_name: paymentData.planName.toLowerCase(),
          amount: paymentData.amount,
          currency: paymentData.currency,
          success_url: `${window.location.origin}/?payment=success&plan=${paymentData.planName}`,
          cancel_url: `${window.location.origin}/?payment=cancelled`
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          payment_url: data.payment_url,
          session_id: data.session_id
        };
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive",
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Payment failed"
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (
    sessionId: string,
    authToken: string
  ): Promise<{ success: boolean; plan?: string; error?: string }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/payments/verify-payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          plan: data.plan
        };
      } else {
        throw new Error(data.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Verification failed"
      };
    }
  };

  return {
    processPayment,
    verifyPayment,
    isProcessing
  };
};