import React, { useState } from 'react';
import { StoreSettings } from '../types';
import { Lock, ArrowLeft, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface SitePasswordGateProps {
  onUnlock: (password: string) => boolean;
  storeSettings: StoreSettings;
  onOpenAdmin: () => void;
}

export const SitePasswordGate: React.FC<SitePasswordGateProps> = ({
  onUnlock,
  storeSettings,
  onOpenAdmin
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(password);
    if (!success) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4 selection:bg-amber-100 selection:text-amber-900">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-8 text-center space-y-6">
        {/* Brand Badge */}
        <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>متجر خاص بالزبائن والعملاء</span>
          </span>
          <h1 className="text-2xl font-black text-stone-900">
            {storeSettings.storeName || 'ذكرى للطباعة'}
          </h1>
          <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
            مرحباً بك! هذا المتجر متاح حصرياً عبر الرابط المباشر. يرجى إدخال رمز المرور لتصفح المنتجات وإتمام طلبك.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-right">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">
              رمز المرور للدخول:
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              required
              className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-300 rounded-2xl focus:bg-white focus:border-stone-500 focus:outline-none text-center font-mono tracking-widest"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>رمز المرور غير صحيح، يرجى المحاولة مرة أخرى أو مراسلة المتجر.</span>
            </div>
          )}

          {storeSettings.siteProtection?.hint && (
            <p className="text-[11px] text-stone-500 text-center">
              تلميح: {storeSettings.siteProtection.hint}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
          >
            <span>دخول إلى المتجر</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        {/* Admin Login Link */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-center">
          <button
            onClick={onOpenAdmin}
            className="text-xs text-stone-500 hover:text-stone-900 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>تسجيل دخول مشرف المتجر (Admin)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
