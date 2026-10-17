import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Home, Menu } from 'lucide-react';
import { useCart } from '../CartContext';
import { motion } from 'motion/react';

export const Layout: React.FC = () => {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">FreshCart</span>
          </Link>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search fresh groceries..."
                className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link to="/profile" className="p-2 text-slate-600 hover:text-emerald-600 transition-colors">
              <User className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        <Link to="/" className={`flex flex-col items-center gap-1 ${location.pathname === '/' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center gap-1 text-slate-400">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-medium">Search</span>
        </Link>
        <Link to="/cart" className={`relative flex flex-col items-center gap-1 ${location.pathname === '/cart' ? 'text-emerald-600' : 'text-slate-400'}`}>
          <ShoppingCart className="w-6 h-6" />
          <span className="text-[10px] font-medium">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[8px] font-bold flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </Link>
        <Link to="/profile" className="flex flex-col items-center gap-1 text-slate-400">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
};
