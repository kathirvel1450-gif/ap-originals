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
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <Leaf className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#111] font-heading">Admin Login</h1>
          <p className="text-gray-500 mt-2 text-sm text-center">Enter your credentials to manage products and store settings.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-semibold mb-6 flex items-center justify-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#111] mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow bg-gray-50 focus:bg-white text-[#111] font-medium"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#111] mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow bg-gray-50 focus:bg-white text-[#111] font-medium"
              placeholder="Enter password"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-lg hover:bg-primary-700 transition-colors shadow-md"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
