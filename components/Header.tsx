
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <i className="fas fa-utensils text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
            DineWise AI
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">How it works</span>
          <span className="hover:text-emerald-600 cursor-pointer transition-colors">Favorites</span>
          <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors">
            Get Pro
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
