import React, { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { getRecipeSuggestions } from '../services/gemini';
import Markdown from 'react-markdown';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const navigate = useNavigate();

  const handleGetSuggestions = async () => {
    setIsLoadingAI(true);
    const res = await getRecipeSuggestions(cart);
    setSuggestions(res || null);
    setIsLoadingAI(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500">Looks like you haven't added anything yet.</p>
        </div>
        <Link
          to="/"
          className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
        
        {/* AI Suggestions Section */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-700">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">Smart Recipe Assistant</h3>
            </div>
            {!suggestions && !isLoadingAI && (
              <button 
                onClick={handleGetSuggestions}
                className="text-xs font-bold uppercase tracking-wider bg-white text-indigo-600 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all"
              >
                Get Ideas
              </button>
            )}
          </div>
          
          {isLoadingAI ? (
            <div className="flex items-center gap-2 text-indigo-400 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking of delicious recipes...
            </div>
          ) : suggestions ? (
            <div className="prose prose-sm prose-indigo max-w-none text-indigo-900/80">
              <Markdown>{suggestions}</Markdown>
            </div>
          ) : (
            <p className="text-sm text-indigo-600/60 italic">
              Need inspiration? I can suggest recipes based on your cart items.
            </p>
          )}
        </div>

        <div className="space-y-4">
          {cart.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-4 items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover bg-slate-50"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 truncate">{item.name}</h3>
                <p className="text-sm text-slate-500">${item.price.toFixed(2)} / {item.unit}</p>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 rounded-full p-1">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-4 text-center font-bold text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
          <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-medium text-slate-900">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Fee</span>
              <span className="font-medium text-slate-900">$2.50</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Tax</span>
              <span className="font-medium text-slate-900">${(totalPrice * 0.08).toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-end">
              <span className="font-bold text-slate-900 text-lg">Total</span>
              <span className="font-bold text-emerald-600 text-2xl">
                ${(totalPrice + 2.5 + totalPrice * 0.08).toFixed(2)}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all group"
          >
            Checkout
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
