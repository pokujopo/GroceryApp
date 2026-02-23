import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Checkout: React.FC = () => {
  const { totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Order Confirmed!</h1>
          <p className="text-slate-500">Thank you for shopping with FreshCart. Your groceries will arrive in 30-45 minutes.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-12 items-start">
      {/* Payment Details Section */}
      <div className="lg:col-span-2 space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Payment Details</h1>
        
        <form onSubmit={handlePayment} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Cardholder Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Card Number</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiry Date</label>
                <input
                  required
                  type="text"
                  placeholder="MM / YY"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CVV</label>
                <input
                  required
                  type="text"
                  placeholder="123"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl flex items-start gap-3 border border-emerald-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-800 leading-relaxed">
              Your payment is secured with 256-bit SSL encryption. We do not store your full card details on our servers.
            </p>
          </div>

          <button
            disabled={isProcessing}
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              `Complete Purchase`
            )}
          </button>
        </form>
      </div>

      {/* Order Summary Section */}
      <div className="space-y-6 lg:sticky lg:top-24">
        <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-xl space-y-6">
          <h2 className="text-xl font-bold">Order Summary</h2>
          
          <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar pr-2">
            {/* Minimal item list for summary */}
            <div className="space-y-3">
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Subtotal</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Delivery</span>
                <span className="text-white">$2.50</span>
              </div>
              <div className="flex justify-between text-slate-400 text-sm">
                <span>Tax (8%)</span>
                <span className="text-white">${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-emerald-400 text-2xl">
                  ${(totalPrice + 2.5 + totalPrice * 0.08).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-medium">Arriving in 30-45 mins</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Secure</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center space-y-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Fresh</p>
          </div>
        </div>
      </div>
    </div>
  );
};
