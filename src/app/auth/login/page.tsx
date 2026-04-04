'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/StoreContext';
import { useToast } from '@/lib/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { login } = useStore();
  const { addToast } = useToast();
  
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      addToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setStep('otp');
    addToast('OTP sent securely to your mobile', 'success');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      addToast('Please enter the full 4-digit OTP', 'error');
      return;
    }
    
    // Simulate login
    login(mobile);
    addToast('Logged in successfully', 'success');
    router.push('/');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 w-full bg-earth-50 dark:bg-black/20 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <Link href="/" className="mb-8 flex items-center gap-2 group z-10">
        <Leaf className="w-8 h-8 text-primary-600 group-hover:rotate-12 transition-transform" />
        <span className="font-heading font-bold text-2xl tracking-tight text-earth-900 dark:text-white">
          AP originals
        </span>
      </Link>

      <div className="bg-white dark:bg-earth-900 border border-earth-200 dark:border-earth-800 rounded-3xl p-8 md:p-10 w-full max-w-md shadow-xl z-10 relative">
        <AnimatePresence mode="wait">
          {step === 'mobile' ? (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-heading font-bold text-earth-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-earth-500 mb-8">Enter your mobile number to sign in or create an account.</p>

              <form onSubmit={handleMobileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-earth-700 dark:text-earth-300 mb-2">Mobile Number</label>
                  <div className="flex bg-earth-50 dark:bg-earth-800 rounded-xl overflow-hidden border border-earth-200 dark:border-earth-700 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
                    <span className="flex items-center px-4 text-earth-500 font-medium border-r border-earth-200 dark:border-earth-700 bg-earth-100 dark:bg-earth-900/50">
                      +91
                    </span>
                    <input 
                      type="tel" 
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-transparent p-4 outline-none font-medium dark:text-white"
                      placeholder="98765 43210"
                      autoFocus
                    />
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={mobile.length < 10}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full transition-colors"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <div className="mt-8 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-earth-200 dark:border-earth-800"></div>
                </div>
                <div className="relative px-4 text-sm bg-white dark:bg-earth-900 text-earth-400">Or continue with</div>
              </div>

              <button className="mt-6 w-full flex items-center justify-center gap-3 border border-earth-200 dark:border-earth-800 hover:bg-earth-50 dark:hover:bg-earth-800 text-earth-900 dark:text-white font-medium py-3.5 rounded-full transition-colors">
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                 Sign in with Google
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                onClick={() => setStep('mobile')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium mb-6 inline-flex"
              >
                &larr; Back to mobile
              </button>
              <h2 className="text-2xl font-heading font-bold text-earth-900 dark:text-white mb-2">Verify OTP</h2>
              <p className="text-earth-500 mb-6">We've sent a 4-digit verification code to <strong className="text-earth-900 dark:text-earth-200">+91 {mobile}</strong></p>
              
              <div className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm p-3 rounded-lg flex items-center justify-center gap-2 mb-8 border border-primary-200 dark:border-primary-800">
                 <ShieldCheck className="w-4 h-4" />
                 Demo Mode: Any 4-digit OTP works (e.g. <strong className="font-mono bg-white dark:bg-black px-1.5 py-0.5 rounded">1234</strong>)
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-between gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                      className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold bg-earth-50 dark:bg-earth-800 border border-earth-200 dark:border-earth-700 rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all dark:text-white"
                    />
                  ))}
                </div>
                
                <button 
                  type="submit" 
                  disabled={otp.join('').length < 4}
                  className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-full transition-colors"
                >
                  Verify & Proceed
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-2 text-earth-500 text-sm">
                <span>Didn't receive the code?</span>
                <button className="font-semibold text-primary-600 hover:text-primary-700">Resend</button>
              </div>

              <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 dark:text-green-400">
                  Your number is secured with 256-bit encryption. We never share your details without your consent.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
