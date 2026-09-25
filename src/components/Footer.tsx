import React from 'react';
import { useStore } from '../context/StoreContext';
import { StoreLogo } from './StoreLogo';
import { Sparkles, MapPin, Phone, Clock, Mail, ShieldCheck, Truck } from 'lucide-react';

interface FooterProps {
  onOpenTracker: () => void;
  onOpenChat: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracker,
  onOpenChat,
  onOpenAdmin
}) => {
  const { storeSettings, categories } = useStore();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Info (Right in RTL) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md">
                <StoreLogo customUrl={storeSettings.logoUrl} className="w-full h-full" />
              </div>
              <div>
                <span className="text-xl font-black text-white">{storeSettings.storeName}</span>
                <span className="block text-xs text-stone-400">{storeSettings.storeTagline}</span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {storeSettings.storeDescription}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-stone-400">
              <span className="bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700">
                🇮🇶 متجر عراقي 100%
              </span>
              <span className="bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700">
                💵 الدفع عند الاستلام
              </span>
              <span className="bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-700">
                🚚 شحن سريع لكافة المحافظات
              </span>
            </div>
          </div>

          {/* Quick Categories Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              أبرز أقسام الطباعة
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <span className="hover:text-amber-300 transition-colors cursor-pointer">
                    {cat.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Hours */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              معلومات الاتصال والورشة
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{storeSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span dir="ltr">{storeSettings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{storeSettings.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{storeSettings.email}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={onOpenTracker}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              >
                تتبع حالة الطلب
              </button>
              <button
                onClick={onOpenChat}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
              >
                محادثة المتجر
              </button>
              <button
                onClick={onOpenAdmin}
                className="px-3 py-1.5 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-400 text-xs transition-colors"
              >
                بوابة الإدارة
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div>
            جميع الحقوق محفوظة لـ <strong>{storeSettings.storeName}</strong> © 2026
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>الأسعار معروضة بالدينار العراقي (IQD)</span>
            <span>·</span>
            <span>نظام دفع نقدي عند المعاينة والاستلام</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
