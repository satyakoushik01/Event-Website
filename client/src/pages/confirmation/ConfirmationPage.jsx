import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaEnvelope, FaCommentAlt, FaQrcode } from 'react-icons/fa';
import events from '../../mockData/events';

export default function ConfirmationPage() {
  const { id } = useParams();
  const event = events.find(e => e.id === id) || events.find(e => e.id === "7") || events[0];
  
  const orderId = `MH-2026-001234`; // Mock static ID for demo

  return (
    <div className="min-h-screen bg-matte-black pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Column - Ticket Generated */}
          <div className="lg:w-[60%] flex flex-col gap-6">
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-start gap-4">
              <FaCheckCircle className="text-green-500 text-xl mt-1 shrink-0" />
              <div>
                <h3 className="text-green-500 font-medium mb-1">Booking Confirmed!</h3>
                <p className="text-sm text-green-500/80">Your ticket has been successfully booked.</p>
              </div>
            </div>

            <div className="bg-charcoal border border-white/10 rounded-2xl shadow-xl overflow-hidden relative">
              {/* Ticket Header Pattern */}
              <div className="h-4 bg-champagne-gold/20 flex space-x-2 px-4 items-center">
                <div className="w-2 h-2 rounded-full bg-champagne-gold/50" />
                <div className="w-2 h-2 rounded-full bg-champagne-gold/50" />
                <div className="w-2 h-2 rounded-full bg-champagne-gold/50" />
              </div>
              
              <div className="p-8">
                <div className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-white/10 border-dashed">
                  <img src={event.images[0]} alt={event.title} className="w-32 h-32 rounded-xl object-cover" />
                  <div>
                    {event.badge && (
                      <span className="px-2 py-1 text-[10px] font-bold tracking-wider rounded bg-champagne-gold text-matte-black uppercase mb-3 inline-block">
                        {event.badge}
                      </span>
                    )}
                    <h3 className="text-xl font-display text-off-white mb-2">{event.title}</h3>
                    <p className="text-sm text-soft-gray mb-1">Fri, 20 Sep 2026 • 6:00 PM</p>
                    <p className="text-sm text-soft-gray">{event.location}</p>
                  </div>
                </div>

                <div className="py-8 grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-xs text-soft-gray mb-1">Ticket ID</p>
                    <p className="text-sm text-off-white font-medium">{orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-soft-gray mb-1">Payment Method</p>
                    <p className="text-sm text-off-white font-medium">Razorpay</p>
                  </div>

                  <div>
                    <p className="text-xs text-soft-gray mb-1">Subtotal</p>
                    <p className="text-sm text-off-white">₹2,998</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-soft-gray mb-1">Booking Fee</p>
                    <p className="text-sm text-off-white">₹100</p>
                  </div>

                  <div>
                    <p className="text-xs text-soft-gray mb-1">Total Paid</p>
                    <p className="text-lg font-bold text-champagne-gold">₹3,098</p>
                  </div>
                  <div className="text-right flex justify-end items-center">
                    <div className="w-20 h-20 bg-white rounded flex items-center justify-center p-2">
                      <FaQrcode className="text-black w-full h-full" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 py-3 rounded bg-champagne-gold text-matte-black font-semibold hover:bg-soft-gold transition-colors">
                    Download Ticket
                  </button>
                  <Link to="/events" className="flex-1 py-3 rounded border border-white/20 text-off-white font-medium text-center hover:bg-white/5 transition-colors">
                    Back to Events
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Email & SMS Mocks */}
          <div className="lg:w-[40%] flex flex-col gap-6">
            
            {/* Email Mock */}
            <div className="bg-charcoal border border-white/10 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full" />
              <div className="flex gap-3 items-center mb-4 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FaEnvelope className="text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-off-white">Ticket Confirmation - MomentsHub</h4>
                  <p className="text-xs text-soft-gray">noreply@momentshub.com</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-matte-black rounded-lg p-4 text-center">
                  <img src="/logo.png" alt="Logo" className="h-6 mx-auto mb-3 opacity-80" />
                  <p className="text-sm font-medium text-off-white">Your Event Booking is Confirmed!</p>
                </div>
                <div className="text-xs text-soft-gray leading-relaxed">
                  <p className="mb-2 text-off-white">Hi Rahul Sharma,</p>
                  <p className="mb-4">Your booking for <strong>{event.title}</strong> is confirmed.</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-white/5 p-3 rounded">
                    <span className="text-soft-gray">Date:</span><span className="text-off-white">20 Sep 2026</span>
                    <span className="text-soft-gray">Time:</span><span className="text-off-white">6:00 PM</span>
                    <span className="text-soft-gray">Venue:</span><span className="text-off-white">{event.location}</span>
                    <span className="text-soft-gray">Ticket ID:</span><span className="text-off-white">{orderId}</span>
                    <span className="text-soft-gray">Tickets:</span><span className="text-off-white">2 (Premium)</span>
                    <span className="text-soft-gray">Amount Paid:</span><span className="text-off-white">₹ 3,098</span>
                  </div>

                  <div className="w-24 h-24 bg-white rounded mx-auto mb-4 flex items-center justify-center p-2">
                    <FaQrcode className="text-black w-full h-full" />
                  </div>

                  <button className="w-full py-2 bg-[#1a1a1a] border border-white/20 text-off-white rounded hover:bg-white/10 transition">
                    Download Your Ticket
                  </button>
                </div>
              </div>
            </div>

            {/* SMS Mock */}
            <div className="bg-charcoal border border-white/10 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 bg-green-500 h-full" />
              <div className="flex gap-3 items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FaCommentAlt className="text-green-500 text-xs" />
                </div>
                <h4 className="text-sm font-medium text-off-white">SMS</h4>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-4 rounded-tl-none ml-2">
                <p className="text-xs text-soft-gray leading-relaxed">
                  MomentsHub: Your booking for {event.title} on 20 Sep 2026 at 6:00 PM is confirmed. Ticket ID: {orderId}. Check your email for your ticket.
                </p>
                <p className="text-[10px] text-soft-gray/50 text-right mt-2">10:24 AM</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
