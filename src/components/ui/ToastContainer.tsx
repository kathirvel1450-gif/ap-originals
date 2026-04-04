'use client';

import { useToast } from '@/lib/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 min-w-[300px] rounded-lg shadow-lg border text-sm font-medium ${
              toast.type === 'success'
                ? 'bg-primary-50 border-primary-200 text-primary-900'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-primary-600" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
            
            <span className="flex-1">{toast.message}</span>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-4 h-4 opacity-50 hover:opacity-100" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
