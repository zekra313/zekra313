import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { StoreLogo } from './StoreLogo';
import { getSupabase, getStoredSupabaseConfig, saveSupabaseConfig } from '../lib/supabase';
import {
  X,
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Database,
  ExternalLink,
  ChevronRight,
  Settings,
  Sparkles
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
  const {
    loginAdminWithGoogle,
    verifyAndLoginAdminEmail,
    authError,
    clearAuthError,
    adminUsers,
    storeSettings
  } = useStore();

  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  // Supabase Config states
  const savedConfig = getStoredSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(savedConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(savedConfig.key);
  const [configSavedNotice, setConfigSavedNotice] = useState(false);

  if (!isOpen) return null;

  const currentSupabase = getSupabase();
  const isSupabaseConfigured = Boolean(currentSupabase);

  // 1. Direct Google OAuth flow via Supabase
  const handleGoogleLogin = async () => {
    setLocalError('');
    setSuccessMsg('');
    clearAuthError();

    if (!isSupabaseConfigured) {
      setShowConfig(true);
      setLocalError('يرجى ربط مشروع Supabase أولاً لتفعيل تسجيل الدخول بواسطة Google OAuth.');
      return;
    }

    setLoading(true);
    try {
      await loginAdminWithGoogle();
      // Supabase will redirect to Google login URL
    } catch (err: any) {
      setLoading(false);
      setLocalError(err?.message || 'تعذر بدء تسجيل الدخول بواسطة Google');
    }
  };

  // 2. Direct Verification of Google Email against admin_users table
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');
    clearAuthError();

    if (!testEmail.trim()) {
      setLocalError('يرجى كتابة البريد الإلكتروني للتحقق من صلاحية الأدمن');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyAndLoginAdminEmail(testEmail.trim());
      setLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onLoginSuccess();
          onClose();
        }, 600);
      } else {
        setLocalError(res.message);
      }
    } catch (err: any) {
      setLoading(false);
      setLocalError(err?.message || 'فشل التحقق من صلاحيات البريد الإلكتروني');
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
    setConfigSavedNotice(true);
    setTimeout(() => {
      setConfigSavedNotice(false);
      setShowConfig(false);
    }, 1200);
  };

  const displayError = localError || authError;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-xs">
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
            className="absolute top-4 left-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-lg">
              <StoreLogo customUrl={storeSettings.logoUrl} className="w-full h-full" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <h2 className="text-xl font-black">{storeSettings.storeName}</h2>
          <p className="text-xs text-amber-200 mt-1">
            تسجيل دخول الأدمن حصرياً عبر Google مع Supabase Auth
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-5">
          {/* Security Notice */}
          <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-stone-800">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>نظام أمني محمي بالكامل:</span>
            </div>
            <p className="text-stone-600 leading-relaxed">
              تسجيل الدخول مقتصر حصرياً على حسابات <strong>Google</strong> المدرجة مسبقاً في جدول المشرفين <strong>(admin_users)</strong>. تسجيل الدخول بـ Google وحده لا يكفي إذا لم يكن البريد مسجلاً كمسؤول.
            </p>
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block mb-0.5">تنبيه الصلاحيات:</span>
                <span>{displayError}</span>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Primary Action: Google Login via Supabase */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm bg-white hover:bg-stone-50 text-stone-800 border-2 border-stone-200 hover:border-stone-300 shadow-sm transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{loading ? 'جاري الاتصال بـ Supabase Google Auth...' : 'تسجيل الدخول بواسطة Google'}</span>
            </button>
          </div>

          {/* Whitelist Email Verification Tester */}
          <div className="pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-700">
                فحص الصلاحية في جدول المشرفين (admin_users):
              </span>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {adminUsers.length} أدمن معتمد
              </span>
            </div>

            <form onSubmit={handleVerifyEmail} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  dir="ltr"
                  placeholder="aaa0750907766@gmail.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:border-stone-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Quick shortcut button for owner's email */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setTestEmail('aaa0750907766@gmail.com')}
                  className="text-[11px] text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>تعبئة بريد المالك (aaa0750907766@gmail.com)</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1.5 rounded-xl font-bold text-xs text-white shadow-xs hover:opacity-90 transition-all cursor-pointer"
                  style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
                >
                  تحقق والدخول
                </button>
              </div>
            </form>
          </div>

          {/* Supabase Connection Status / Toggle */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              />
              <span>
                {isSupabaseConfigured
                  ? 'Supabase متصل'
                  : 'Supabase بحاجة لتهيئة الرابط'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-stone-600 hover:text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>إعدادات الاتصال</span>
            </button>
          </div>

          {/* Collapsible Supabase Project Setup Drawer */}
          {showConfig && (
            <form
              onSubmit={handleSaveConfig}
              className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 text-xs animate-fadeIn"
            >
              <div className="font-bold text-stone-800 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>بيانات مشروع Supabase Auth:</span>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-stone-600">
                  Supabase Project URL:
                </label>
                <input
                  type="url"
                  dir="ltr"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-semibold text-stone-600">
                  Supabase Anon Key:
                </label>
                <input
                  type="password"
                  dir="ltr"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 cursor-pointer"
                >
                  حفظ الإعدادات
                </button>
                {configSavedNotice && (
                  <span className="text-emerald-700 font-bold text-[11px]">
                    ✓ تم حفظ الإعداد بنجاح
                  </span>
                )}
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
