import React, { useState } from 'react';
import { PRODUCTS } from '../data';
import { useCart } from '../CartContext';
import { Plus, ShoppingBasket } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat'];

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  const filteredProducts = selectedCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-emerald-900 text-white flex items-center px-8 md:px-12">
        <div className="relative z-10 max-w-lg space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Freshness delivered to your doorstep.
          </h1>
          <p className="text-emerald-100/80 text-sm md:text-base">
            Get 20% off on your first order with code <span className="font-bold text-white">FRESH20</span>
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-800 to-transparent opacity-50" />
        <img
          src="https://picsum.photos/seed/grocery/800/400?blur=2"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
      </section>

      {/* Categories */}
      <section className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-white rounded-2xl border border-slate-200 p-3 md:p-4 hover:shadow-xl hover:border-emerald-200 transition-all"
          >
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => addToCart(product)}
                className="absolute bottom-2 right-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {product.category}
              </span>
              <h3 className="font-semibold text-slate-800 truncate">{product.name}</h3>
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400">per {product.unit}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBasket className="w-8 h-8" />
          </div>
          <p className="text-slate-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};
