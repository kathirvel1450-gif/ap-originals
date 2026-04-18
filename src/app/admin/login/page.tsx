'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/StoreContext';
import { Leaf } from 'lucide-react';

export default function AdminLogin() {
  const { adminLogin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'kathir3003' && password === '098765') {
      adminLogin();
      // Layout handles router.replace automatically
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#111]">
      <div className="bg-[#1a1a1a] rounded-2xl shadow-xl w-full max-w-md p-8 border border-[#333]">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-white font-heading">Admin Login</h1>
          <p className="text-gray-400 mt-2 text-sm text-center">Enter your credentials to manage products and store settings.</p>
        </div>

        {error && (
          <div className="bg-red-900/30 text-red-400 p-3 rounded-lg text-sm font-semibold mb-6 flex items-center justify-center border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow bg-[#222] text-white font-medium"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow bg-[#222] text-white font-medium"
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-lg hover:bg-primary-500 transition-colors shadow-md"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
