import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Instagram,
  Facebook,
  Send,
  MessageCircle,
  Youtube,
  ExternalLink,
  Share2
} from 'lucide-react';

export const SocialMediaSection: React.FC = () => {
  const { socialLinks, storeSettings } = useStore();
  const activeLinks = socialLinks
    .filter(s => s.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeLinks.length === 0) return null;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-white" />;
      case 'facebook':
        return <Facebook className="w-5 h-5 text-white" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-white" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-white" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-white" />;
      default:
        return <Share2 className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section className="py-12 bg-white border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs font-semibold text-amber-700 tracking-wider">
            تواصل وتفاعل معنا مباشرة
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            تابع حسابات {storeSettings.storeName} الرسمية
          </h2>
          <p className="text-stone-500 text-xs">
            ابقَ على اطلاع بأحدث النماذج المطبوعة، كواليس الإنتاج، والخصومات الحصرية لمتابعينا
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {activeLinks.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-4 bg-stone-50 hover:bg-white rounded-2xl border border-stone-200 hover:border-stone-400 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center space-y-2.5"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-110"
                style={{ backgroundColor: item.iconBgColor || '#1e3a2b' }}
              >
                {getPlatformIcon(item.platform)}
              </div>

              <div>
                <span className="block font-bold text-stone-900 text-xs sm:text-sm">
                  {item.name}
                </span>
                <span className="block text-[11px] text-stone-500 font-mono mt-0.5" dir="ltr">
                  {item.handle}
                </span>
              </div>

              <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-stone-600 group-hover:text-stone-950">
                <span>زيارة الحساب</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
