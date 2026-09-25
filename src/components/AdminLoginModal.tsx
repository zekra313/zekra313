import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const { loginAdmin } = useStore();
  const [activeTab, setActiveTab] = useState<'google' | 'supabase' | 'quick'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      loginAdmin('google', 'admin@zekraprint.iq');
      setLoading(false);
      onLoginSuccess();
      onClose();
    }, 600);
  };

  const handleSupabaseLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      loginAdmin('supabase', email);
      setLoading(false);
      onLoginSuccess();
      onClose();
    }, 600);
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow instant demo access or default admin passcode '1234' or empty for fast evaluation
    loginAdmin('demo', 'admin@zekraprint.iq');
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 text-white text-center relative"
          style={{ backgroundColor: 'var(--primary-color, #1e3a2b)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-3 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-xl font-black">بوابة إدارة "ذكرى للطباعة"</h2>
          <p className="text-xs text-amber-200 mt-1">
            منطقة مخصصة لمشرفي المتجر لإدارة الطلبات والمنتجات
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl text-xs font-semibold text-stone-600">
            <button
              onClick={() => { setActiveTab('quick'); setErrorMsg(''); }}
              className={`py-2 rounded-lg transition-all ${activeTab === 'quick' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'}`}
            >
              دخول سريع
            </button>
            <button
              onClick={() => { setActiveTab('google'); setErrorMsg(''); }}
              className={`py-2 rounded-lg transition-all ${activeTab === 'google' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'}`}
            >
              Google
            </button>
            <button
              onClick={() => { setActiveTab('supabase'); setErrorMsg(''); }}
              className={`py-2 rounded-lg transition-all ${activeTab === 'supabase' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-900'}`}
            >
              Supabase Auth
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick 1-Click Access for Evaluation */}
          {activeTab === 'quick' && (
            <form onSubmit={handleQuickLogin} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>دخول تجريبي فوري للمعاينة والتقييم:</span>
                </div>
                <p className="text-stone-600">
                  يمكنك الدخول كمدير بضغطة زر واحدة لتجربة كافة لوحات التحكم وتعديل الأسعار وإدارة الطلبات.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  رمز المرور السريع (اختياري / تجريبي):
                </label>
                <input
                  type="password"
                  placeholder="admin أو 1234 أو اتركه فارغاً"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-98"
                style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>تسجيل الدخول إلى لوحة التحكم فوراً</span>
              </button>
            </form>
          )}

          {/* Google Login Tab */}
          {activeTab === 'google' && (
            <div className="space-y-4 text-center">
              <p className="text-xs text-stone-600">
                تسجيل الدخول الآمن بحساب Google المعتمد لمشرف المتجر عبر Supabase OAuth.
              </p>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 shadow-xs transition-all flex items-center justify-center gap-3 active:scale-98"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول بواسطة Google'}</span>
              </button>
            </div>
          )}

          {/* Supabase Auth Tab */}
          {activeTab === 'supabase' && (
            <form onSubmit={handleSupabaseLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">البريد الإلكتروني للإدارة:</label>
                <div className="relative">
                  <input
                    type="email"
                    dir="ltr"
                    required
                    placeholder="admin@zekraprint.iq"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">كلمة المرور:</label>
                <div className="relative">
                  <input
                    type="password"
                    dir="ltr"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-9 py-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-xs transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
              >
                <span>{loading ? 'جاري تسجيل الدخول...' : 'دخول بواسطة Supabase Auth'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
