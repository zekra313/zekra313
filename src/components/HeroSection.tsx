import React from 'react';
import { Sparkles, ArrowLeft, ShieldCheck, Truck, Palette, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface HeroSectionProps {
  onBrowseClick: () => void;
  onSpecialOffersClick: () => void;
  onOpenChat: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onBrowseClick,
  onSpecialOffersClick,
  onOpenChat
}) => {
  const { storeSettings } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 to-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text and Actions (Right side in RTL) */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Quiet kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>الطباعة التذكارية والهدايا المخصصة الأولى في العراق</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-amber-800">الدفع عند الاستلام</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-stone-900 leading-[1.25] tracking-tight">
              نحوّل ذكرياتكم الغالية إلى{' '}
              <span
                className="underline decoration-amber-400 decoration-wavy decoration-2 underline-offset-8"
                style={{ color: 'var(--primary-color, #1e3a2b)' }}
              >
                تحف فنية مخصصة
              </span>
            </h1>

            {/* Subtitle / Description */}
            <p className="text-stone-600 text-base md:text-lg leading-relaxed max-w-2xl">
              أهلاً بكم في <strong>{storeSettings.storeName}</strong>. تشكيلة حصرية من الأكواب الحرارية، إطارات الخشب الطبيعي المحفورة بالليزر، وشاحات التخرج الملكية، والبوكسات التذكارية المصممة خصيصاً بأسمائكم وصوركم.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-stone-700">
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-stone-200/70 shadow-2xs">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>توصيل لكافة المحافظات</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-stone-200/70 shadow-2xs">
                <Palette className="w-4 h-4 text-amber-600 shrink-0" />
                <span>طباعة حرارية ليزرية ثابتة</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2.5 rounded-xl border border-stone-200/70 shadow-2xs col-span-2 sm:col-span-1">
                <Award className="w-4 h-4 text-indigo-700 shrink-0" />
                <span>معاينة الطلب قبل الاعتماد</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={onBrowseClick}
                className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-98"
                style={{ backgroundColor: 'var(--btn-color, #1e3a2b)' }}
              >
                <span>تصفح كافة المنتجات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onSpecialOffersClick}
                className="px-5 py-3 rounded-xl font-bold text-sm bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>عروض وخصومات الأسبوع</span>
              </button>

              <button
                onClick={onOpenChat}
                className="px-4 py-3 rounded-xl font-medium text-sm text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 transition-colors"
              >
                استفسار وتصميم خاص
              </button>
            </div>
          </div>

          {/* Hero Visual Showcase (Left side in RTL) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image with luxury frame and shadow */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-200/80 bg-stone-100 aspect-4/3 lg:aspect-4/3">
                <img
                  src="/src/assets/images/hero_printing_store_1790334111184.jpg"
                  alt="متجر ذكرى للطباعة والهدايا المخصصة"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback container
                    const target = e.currentTarget;
                    target.style.display = 'none';
                  }}
                />

                {/* Scrim overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-5">
                  <div className="text-white space-y-1">
                    <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold block">
                      مشغل ذكرى للطباعة الاحترافية
                    </span>
                    <p className="text-sm font-medium text-stone-200">
                      دقة فوتوغرافية، حفر ليزري متقن، واهتمام بأدق تفاصيل إهداءاتكم
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Trust Badge */}
              <div className="absolute -bottom-4 -right-4 sm:-right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <div className="text-right">
                  <span className="block text-xs text-stone-500 font-medium">ضمان الجودة العراقي</span>
                  <span className="block text-sm font-bold text-stone-900">فحص الطلب عند الاستلام</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
