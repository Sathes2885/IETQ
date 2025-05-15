import { CashfreePaymentRequest, CashfreePaymentResponse } from '../../shared/types';
import crypto from 'crypto';

// Check if required credentials are available
const hasCashfreeCredentials = () => {
  return process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY;
};

// Validate the returned signature from Cashfree
export const verifyPaymentSignature = (orderId: string, orderAmount: string, referenceId: string, paymentStatus: string, txTime: string, signature: string): boolean => {
  try {
    if (!hasCashfreeCredentials()) {
      console.error('Cashfree credentials not available');
      return false;
    }

    const data = orderId + orderAmount + referenceId + paymentStatus + txTime;
    const signatureData = data + process.env.CASHFREE_SECRET_KEY;
    
    const computedSignature = crypto
      .createHmac('sha256', process.env.CASHFREE_SECRET_KEY!)
      .update(signatureData)
      .digest('hex');
      
    return computedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
};

// Create a payment link using Cashfree
export const createPaymentLink = async (
  paymentData: CashfreePaymentRequest
): Promise<CashfreePaymentResponse> => {
  try {
    if (!hasCashfreeCredentials()) {
      return {
        status: 'ERROR',
        error: 'Cashfree credentials not configured'
      };
    }

    const { orderId, orderAmount, orderCurrency, customerName, customerEmail, returnUrl } = paymentData;

    // Validate required fields
    if (!orderId || !orderAmount || !customerName || !customerEmail || !returnUrl) {
      return {
        status: 'ERROR',
        error: 'Missing required payment parameters'
      };
    }

    // Production URL: 'https://api.cashfree.com/pg/links'
    // Test URL: 'https://sandbox.cashfree.com/pg/links'
    const apiUrl = 'https://sandbox.cashfree.com/pg/links';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID!,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY!,
        'x-api-version': '2022-01-01'
      },
      body: JSON.stringify({
        link_id: orderId,
        link_amount: orderAmount,
        link_currency: orderCurrency || 'INR',
        link_purpose: 'Educational Content Purchase',
        customer_details: {
          customer_name: customerName,
          customer_email: customerEmail
        },
        link_notify: {
          send_email: true
        },
        link_meta: {
          return_url: returnUrl
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree payment creation error:', errorData);
      return {
        status: 'ERROR',
        error: `Payment gateway error: ${errorData.message || 'Unknown error'}`
      };
    }

    const responseData = await response.json();
    
    return {
      status: 'SUCCESS',
      paymentLink: responseData.link_url,
      txStatus: 'PENDING'
    };
  } catch (error) {
    console.error('Error creating payment link:', error);
    return {
      status: 'ERROR',
      error: `Payment system error: ${(error as Error).message}`
    };
  }
};

// Update payment status after receiving the callback
export const updatePaymentStatus = async (orderId: string, status: string, referenceId: string): Promise<boolean> => {
  try {
    // Here we would typically update the payment record in the database
    // For now, we'll just log the update and return success
    console.log(`Payment ${orderId} updated to ${status}, reference: ${referenceId}`);
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    return false;
  }
};