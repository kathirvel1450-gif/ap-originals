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
  const { users, currentUser, registerUser, loginUser } = useStore();
  const { addToast } = useToast();
  
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [expectedOtp, setExpectedOtp] = useState('');

  // Protect route if already logged in (using currentUser instead of user)
  React.useEffect(() => {
    if (currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const sendOtp = () => {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setExpectedOtp(generatedOtp);
    localStorage.setItem(`otp_${mobile}`, generatedOtp);
    
    // Developer convenience log
    console.log(`[DEV MODE] OTP for ${mobile} is: ${generatedOtp}`);
    
    setStep('otp');
    addToast('OTP sent securely to your mobile', 'success');
  };

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      addToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    // Check if user exists before generating OTP
    const userExists = users.some(u => u.mobile === mobile);
    
    if (authMode === 'register' && userExists) {
      addToast('Account already exists. Please login.', 'error');
      return;
    }

    if (authMode === 'login' && !userExists) {
       addToast('Account not found. Please create an account.', 'error');
       return;
    }

    sendOtp();
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 4) {
      addToast('Please enter the full 4-digit OTP', 'error');
      return;
    }
    
    const storedOtp = localStorage.getItem(`otp_${mobile}`);
    
    if (otpValue !== storedOtp && otpValue !== expectedOtp) {
       addToast('Invalid OTP. Please try again.', 'error');
       return;
    }
    
    // Auth success
    if (authMode === 'register') {
      registerUser(mobile);
      addToast('Account created successfully!', 'success');
    } else {
      loginUser(mobile);
      addToast('Logged in successfully', 'success');
    }

    // Cleanup OTP
    localStorage.removeItem(`otp_${mobile}`);
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
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 w-full bg-cover relative overflow-hidden" style={{ backgroundColor: '#111' }}>
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <Link href="/" className="mb-8 flex items-center gap-2 group z-10">
        <Leaf className="w-8 h-8 text-primary-600 group-hover:rotate-12 transition-transform" />
        <span className="font-heading font-bold text-2xl tracking-tight text-white">
          AP originals
        </span>
      </Link>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-3xl p-8 md:p-10 w-full max-w-md shadow-2xl z-10 relative">
        <AnimatePresence mode="wait">
          {step === 'mobile' ? (
            <motion.div
              key="mobile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex gap-4 mb-8">
                 <button 
                   type="button" 
                   onClick={() => setAuthMode('login')} 
                   className={`flex-1 pb-2 font-bold transition-colors border-b-2 ${authMode === 'login' ? 'border-primary-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                 >
                   Login
                 </button>
                 <button 
                   type="button" 
                   onClick={() => setAuthMode('register')} 
                   className={`flex-1 pb-2 font-bold transition-colors border-b-2 ${authMode === 'register' ? 'border-primary-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                 >
                   Register
                 </button>
              </div>

              <h2 className="text-2xl font-heading font-bold text-white mb-2">
                {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-400 mb-8">
                 {authMode === 'login' ? 'Enter your mobile number to sign in.' : 'Enter your mobile number to get started.'}
              </p>

              <form onSubmit={handleMobileSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                  <div className="flex bg-[#222] rounded-xl overflow-hidden border border-[#444] focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
                    <span className="flex items-center px-4 text-gray-400 font-medium border-r border-[#444] bg-[#2a2a2a]">
                      +91
                    </span>
                    <input 
                      type="tel" 
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-transparent p-4 outline-none font-medium text-white"
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
                className="text-primary-500 hover:text-primary-400 text-sm font-medium mb-6 inline-flex"
              >
                &larr; Back to mobile
              </button>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Verify OTP</h2>
              <p className="text-gray-400 mb-6">We've sent a 4-digit verification code to <strong className="text-white">+91 {mobile}</strong></p>
              
              <div className="bg-primary-900/30 text-primary-400 text-sm p-3 rounded-lg flex items-center justify-center gap-2 mb-8 border border-primary-800/50">
                 <ShieldCheck className="w-4 h-4" />
                 Open console to view OTP for this demo!
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
                      className="w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold bg-[#222] border border-[#444] rounded-xl outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 transition-all text-white"
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

              <div className="mt-8 flex items-center justify-center gap-2 text-gray-500 text-sm">
                <span>Didn't receive the code?</span>
                <button onClick={sendOtp} type="button" className="font-semibold text-primary-500 hover:text-primary-400">Resend</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
