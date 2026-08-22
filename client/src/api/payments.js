import api from './axios';

export const createPaymentOrder = (bookingId) =>
  api.post('/payments/create-order', { bookingId });

export const verifyPayment = (data) =>
  api.post('/payments/verify', data);

export const getBookingPayments = (bookingId) =>
  api.get(`/payments/booking/${bookingId}`);

/**
 * Dynamically load the Razorpay checkout script.
 * Returns a Promise that resolves when the script is ready.
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
