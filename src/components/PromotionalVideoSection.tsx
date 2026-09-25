import React from 'react';
import { useStore } from '../context/StoreContext';
import { Play, Sparkles } from 'lucide-react';

export const PromotionalVideoSection: React.FC = () => {
  const { promotionalVideos, storeSettings } = useStore();
  const activeVideos = promotionalVideos
    .filter(v => v.isActive)
    .sort((a, b) => a.order - b.order);

  if (activeVideos.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-stone-900 text-white overflow-hidden relative border-y border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>كواليس العمل والطباعة الاحترافية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            شاهد كيف نصنع هداياكم بدقة وإتقان
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm">
            جولة سريعة داخل ورشة {storeSettings.storeName} وتقنيات الحفر الليزري والطباعة الحرارية المتقدمة
          </p>
        </div>

        {/* Video Grid */}
        <div className={`grid gap-8 ${activeVideos.length > 1 ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          {activeVideos.map((video) => (
            <div
              key={video.id}
              className="bg-stone-800/80 rounded-3xl overflow-hidden border border-stone-700/80 shadow-2xl flex flex-col"
            >
              {/* Responsive Video Container */}
              <div className="relative aspect-16/9 bg-black overflow-hidden group">
                {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={video.videoUrl}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                ) : (
                  <video
                    controls
                    poster={video.posterUrl || '/src/assets/images/hero_printing_store_1790334111184.jpg'}
                    className="w-full h-full object-cover"
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                    متصفحك لا يدعم تشغيل الفيديو.
                  </video>
                )}
              </div>

              {/* Title & Description */}
              <div className="p-5 text-right space-y-1.5 flex-1">
                <h3 className="font-bold text-base text-stone-100">
                  {video.title}
                </h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
