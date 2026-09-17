import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaCreditCard, FaWallet, FaMobileAlt, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import events from '../../mockData/events';

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id) || events.find(e => e.id === "7") || events[0];
  
  const [ticketType, setTicketType] = useState('Premium');
  const [quantity, setQuantity] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');

  const ticketPrice = ticketType === 'Premium' ? event.price + 500 : event.price;
  const subtotal = ticketPrice * quantity;
  const bookingFee = 100;
  const totalAmount = subtotal + bookingFee;
  const orderId = `MH-2026-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

  const handlePayment = () => {
    navigate(`/events/${event.id}/confirmation`);
  };

  return (
    <div className="min-h-screen bg-matte-black pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Breadcrumb / Header could go here, omitting for simplicity as per mockup */}
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Booking Summary */}
          <div className="lg:w-[45%]">
            <h2 className="text-2xl font-display text-off-white mb-6">Booking Summary</h2>
            <div className="bg-charcoal border border-white/10 rounded-2xl p-6 shadow-xl">
              
              <div className="flex gap-4 pb-6 border-b border-white/10 mb-6">
                <img src={event.images[0]} alt={event.title} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="text-lg font-display text-off-white mb-1">{event.title}</h3>
                  <p className="text-xs text-soft-gray mb-1">{event.location}</p>
                  <p className="text-xs text-soft-gray">Fri, 20 Sep 2026 • 6:00 PM</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-soft-gray">Ticket Type</span>
                  <select 
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="bg-matte-black border border-white/10 text-off-white text-sm rounded px-3 py-1.5 focus:outline-none focus:border-champagne-gold"
                  >
                    <option value="Premium">Premium</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-soft-gray">Quantity</span>
                  <div className="flex items-center gap-4 bg-matte-black border border-white/10 rounded px-2 py-1">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-soft-gray hover:text-champagne-gold px-2"
                    >-</button>
                    <span className="text-off-white text-sm font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-soft-gray hover:text-champagne-gold px-2"
                    >+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-soft-gray">Price (per ticket)</span>
                  <span className="text-sm text-off-white font-medium">₹{ticketPrice.toLocaleString()}</span>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-soft-gray">Subtotal</span>
                    <span className="text-sm text-off-white">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-soft-gray">Booking Fee</span>
                    <span className="text-sm text-off-white">₹{bookingFee}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                  <span className="text-base font-bold text-off-white">Total Amount</span>
                  <span className="text-xl font-display font-bold text-champagne-gold">₹{totalAmount.toLocaleString()}</span>
                </div>

                <button 
                  onClick={handlePayment}
                  className="w-full mt-8 py-3 rounded bg-champagne-gold text-matte-black font-semibold hover:bg-soft-gold transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Page */}
          <div className="lg:w-[55%]">
            <h2 className="text-2xl font-display text-off-white mb-6">Payment</h2>
            <div className="bg-charcoal border border-white/10 rounded-2xl p-6 shadow-xl">
              
              <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-6">
                <div>
                  <p className="text-xs text-soft-gray mb-1">Order ID: {orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-soft-gray mb-1">Total Amount</p>
                  <p className="text-2xl font-display font-bold text-champagne-gold">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <h3 className="text-base font-medium text-off-white mb-4">Payment Methods</h3>
              
              <div className="space-y-3 mb-8">
                {[
                  { id: 'UPI', icon: FaMobileAlt, label: 'UPI' },
                  { id: 'Card', icon: FaCreditCard, label: 'Credit / Debit Card' },
                  { id: 'NetBanking', icon: FaBuilding, label: 'Net Banking' },
                  { id: 'Wallets', icon: FaWallet, label: 'Wallets' },
                  { id: 'Razorpay', icon: FaCheckCircle, label: 'Razorpay' }
                ].map(method => (
                  <div 
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-colors ${
                      paymentMethod === method.id 
                        ? 'border-champagne-gold bg-champagne-gold/5' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <method.icon className={`text-xl ${paymentMethod === method.id ? 'text-champagne-gold' : 'text-soft-gray'}`} />
                      <span className={`text-sm font-medium ${paymentMethod === method.id ? 'text-champagne-gold' : 'text-off-white'}`}>
                        {method.label}
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      paymentMethod === method.id ? 'border-champagne-gold' : 'border-white/20'
                    }`}>
                      {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-champagne-gold" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs text-soft-gray justify-center bg-matte-black/50 py-3 rounded-lg">
                <FaLock className="text-green-500" />
                Your payment is secured and encrypted
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
