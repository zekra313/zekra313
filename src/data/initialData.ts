import {
  Category,
  Product,
  DeliverySetting,
  Advertisement,
  PromotionalVideo,
  SocialLink,
  StoreSettings,
  ThemeSettings,
  Order,
  Conversation
} from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-frames', name: 'إطارات', displayOrder: 1, isActive: true, description: 'إطارات خشبية ومعدنية مخصصة مع طباعة عالية الدقة' },
  { id: 'cat-mugs', name: 'أكواب', displayOrder: 2, isActive: true, description: 'أكواب حرارية، سحرية وسيراميك بطباعة ثابتة تدوم' },
  { id: 'cat-flasks', name: 'مطارات', displayOrder: 3, isActive: true, description: 'مطارات ستانلس ستيل عازلة للحرارة مع حفر ليزري أو طباعة' },
  { id: 'cat-clothes', name: 'تيشيرتات وملابس', displayOrder: 4, isActive: true, description: 'طباعة قطنية فاخرة للتيشيرتات والهوديز والزي الموحد' },
  { id: 'cat-bags', name: 'حقائب', displayOrder: 5, isActive: true, description: 'حقائب قماشية وتوت باج صديقة للبيئة بتصاميم حسب الطلب' },
  { id: 'cat-medals', name: 'ميداليات', displayOrder: 6, isActive: true, description: 'ميداليات مفاتيح أكريليك، خشبية ومعدنية مخصصة' },
  { id: 'cat-pins', name: 'بروشات', displayOrder: 7, isActive: true, description: 'بروشات وشارات معدنية للمؤتمرات، التخرج، والماركات' },
  { id: 'cat-notebooks', name: 'دفاتر', displayOrder: 8, isActive: true, description: 'نوت بوك ودفاتر يوميات بأغلفة جلدية محفورة بالاسم' },
  { id: 'cat-photo-print', name: 'طباعة صور', displayOrder: 9, isActive: true, description: 'طباعة صور أستوديو فاخرة، ألبومات، وبوسترات لامعة' },
  { id: 'cat-grad', name: 'وشاحات تخرج', displayOrder: 10, isActive: true, description: 'أوشحة تخرج ملكية مع تطريز الاسم والشعار بالخيوط الذهبية' },
  { id: 'cat-gifts', name: 'هدايا', displayOrder: 11, isActive: true, description: 'بوكسات هدايا متكاملة للمناسبات والأعياد وذكرى الزواج' },
  { id: 'cat-wood-board', name: 'بورد خشب', displayOrder: 12, isActive: true, description: 'لوحات خشبية طبيعية محفورة ومطبوعة بتقنية UV' },
  { id: 'cat-phone-cases', name: 'حافظات هواتف', displayOrder: 13, isActive: true, description: 'كفرات هواتف مضادة للصدمات بطباعة حرارية ثلاثية الأبعاد' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'كوب سيراميك فاخر مع خط عربي واسم مخصص',
    categoryId: 'cat-mugs',
    price: 12000,
    originalPrice: 15000,
    isDiscount: true,
    discountLabel: 'خصم 20%',
    description: 'كوب سيراميك مطفي عالي الجودة مع طباعة ثابتة تقاوم الغسيل. يتم كتابة اسمك أو عبارتك المفضلة بخط الثلث أو الديواني الذهبي الأنيق.',
    images: [
      '/src/assets/images/product_custom_mug_1790334124503.jpg',
      '/src/assets/images/hero_printing_store_1790334111184.jpg'
    ],
    isFeatured: true,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-01T10:00:00Z',
    specifications: [
      { label: 'السعة', value: '330 مل' },
      { label: 'المادة', value: 'سيراميك حراري عالي الجودة' },
      { label: 'نوع الطباعة', value: 'حرارية متينة آمنة للمايكروويف' }
    ]
  },
  {
    id: 'prod-2',
    name: 'إطار خشب السنديان الطبيعي مع حفر الاسم والصورة',
    categoryId: 'cat-frames',
    price: 25000,
    originalPrice: 30000,
    isDiscount: true,
    discountLabel: 'عرض خاص',
    description: 'إطار مصنوع يدوياً من خشب السنديان الفاخر مع حفر ليزري فائق الدقة. يتضمن طباعة فوتوغرافية مخملية مقاومة للبهتان مع مسند مكتبي وتعليقة جدارية.',
    images: [
      '/src/assets/images/product_wooden_frame_1790334136533.jpg',
      '/src/assets/images/hero_printing_store_1790334111184.jpg'
    ],
    isFeatured: true,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-02T11:00:00Z',
    specifications: [
      { label: 'المقاس', value: '20 × 25 سم (أو حسب الرغبة)' },
      { label: 'نوع الخشب', value: 'بلوط وسنديان طبيعي 100%' },
      { label: 'الملحقات', value: 'مسند مكتبي وعلاقة معدنية' }
    ]
  },
  {
    id: 'prod-3',
    name: 'وشاح تخرج ملكي ساتان بتطريز ذهبي وشارة الكلية',
    categoryId: 'cat-grad',
    price: 28000,
    originalPrice: 35000,
    isDiscount: true,
    discountLabel: 'موسم التخرج',
    description: 'وشاح تخرج استثنائي من قماش الساتان الملكي الفاخر بلون زمردي أو أسود، مطرز بخيوط القصب الذهبية باسم الخريج وسنة التخرج وشعار الجامعة بدقة بالغة.',
    images: [
      '/src/assets/images/product_graduation_sash_1790334150200.jpg',
      '/src/assets/images/hero_printing_store_1790334111184.jpg'
    ],
    isFeatured: true,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-03T12:00:00Z',
    specifications: [
      { label: 'القماش', value: 'ساتان ملكي كوري أصلي ثقيل' },
      { label: 'التطريز', value: 'خيوط ميتاليك ذهبية وفضية غير قابلة للقطع' },
      { label: 'الطول', value: '180 سم مناسب لجميع المقاسات' }
    ]
  },
  {
    id: 'prod-4',
    name: 'مباردة حرارية ذكية ستانلس ستيل مع شاشة ليد وحفر ليزري',
    categoryId: 'cat-flasks',
    price: 18000,
    description: 'مطارة ذكية تحفظ حرارة المشروبات حتى 12 ساعة، مزودة بشاشة لمسية لعرض درجة الحرارة، مع إمكانية حفر اسمك أو شعار شركتك بالليزر الدقيق.',
    images: [
      '/src/assets/images/hero_printing_store_1790334111184.jpg',
      '/src/assets/images/product_custom_mug_1790334124503.jpg'
    ],
    isFeatured: true,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-04T09:30:00Z',
    specifications: [
      { label: 'السعة', value: '500 مل' },
      { label: 'العزل', value: 'جدار مزدوج ستانلس ستيل 304' },
      { label: 'البطارية', value: 'تدوم حتى سنتين دون شحن' }
    ]
  },
  {
    id: 'prod-5',
    name: 'بورد خشب طبيعي مع طباعة UV فوتوغرافية ومسند',
    categoryId: 'cat-wood-board',
    price: 22000,
    originalPrice: 26000,
    isDiscount: true,
    discountLabel: 'خصم 15%',
    description: 'لوحة خشبية بيضاء أو بيج طبيعي تطبع عليها صورتك المفضلة مباشرة بألوان UV النابضة بالحياة التي لا تتأثر بالضوء أو الرطوبة إطلاقاً.',
    images: [
      '/src/assets/images/product_wooden_frame_1790334136533.jpg',
      '/src/assets/images/hero_printing_store_1790334111184.jpg'
    ],
    isFeatured: false,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-05T14:15:00Z',
    specifications: [
      { label: 'السُمك', value: '12 ملم خشب سويدي معالج' },
      { label: 'الأبعاد', value: '20 × 30 سم (A4)' }
    ]
  },
  {
    id: 'prod-6',
    name: 'تيشيرت قطن 100% بتطريز أو طباعة DTF عالية الدقة',
    categoryId: 'cat-clothes',
    price: 19000,
    description: 'تيشيرت قطن فاخر ناعم الملمس متوفر بجميع المقاسات (S حتى 3XL)، بطباعة رقمية مباشرة ثابتة بألوان مشبعة تدوم مع الغسيل المتكرر.',
    images: [
      '/src/assets/images/hero_printing_store_1790334111184.jpg'
    ],
    isFeatured: false,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-06T15:00:00Z',
    specifications: [
      { label: 'الخامة', value: '100% قطن مصري نقي' },
      { label: 'المقاسات', value: 'S, M, L, XL, XXL, 3XL' }
    ]
  },
  {
    id: 'prod-7',
    name: 'دفتر مفكرة جلدية فاخرة محفورة بالاسم مع قلم مخصص',
    categoryId: 'cat-notebooks',
    price: 16000,
    description: 'نوت بوك أنيق بغلاف جلد نباتي فاخر مع قفل مغناطيسي، يحفر عليه الاسم أو العبارة التذكارية، مع قلم معدني فاخر محفور بنفس الأسلوب.',
    images: [
      '/src/assets/images/hero_printing_store_1790334111184.jpg',
      '/src/assets/images/product_wooden_frame_1790334136533.jpg'
    ],
    isFeatured: true,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-07T16:20:00Z',
    specifications: [
      { label: 'عدد الصفحات', value: '120 ورقة مسطرة عاجية' },
      { label: 'الحجم', value: 'A5 مقاس مثالي للحقيبة' }
    ]
  },
  {
    id: 'prod-8',
    name: 'طقم ميداليات أكريليك شفافة ثلاثية الأبعاد مخصصة',
    categoryId: 'cat-medals',
    price: 7000,
    description: 'ميدالية مفاتيح مصنوعة من الأكريليك النقي الشفاف المقاوم للكسر، مع طباعة ملونة من الوجهين أو حفر الاسم مع حلقة فضية فاخرة.',
    images: [
      '/src/assets/images/hero_printing_store_1790334111184.jpg'
    ],
    isFeatured: false,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-08T18:00:00Z',
    specifications: [
      { label: 'المادة', value: 'أكريليك فائق النقاء 4 ملم' },
      { label: 'التشطيب', value: 'قص ليزري ناعم الحواف' }
    ]
  },
  {
    id: 'prod-9',
    name: 'باكيج هدية ذكرى متكامل (كوب + نوت بوك + ميدالية + بوكس)',
    categoryId: 'cat-gifts',
    price: 39000,
    originalPrice: 48000,
    isDiscount: true,
    discountLabel: 'أفضل قيمة',
    description: 'الصندوق الأكثر طلباً للهدايا! يحتوي على كوب مخصص + دفتر محفور + ميدالية بالاسم + بطاقة إهداء مخصصة موضوعة داخل بوكس كرتوني أسود وذهبي أنيق.',
    images: [
      '/src/assets/images/hero_printing_store_1790334111184.jpg',
      '/src/assets/images/product_custom_mug_1790334124503.jpg'
    ],
    isFeatured: true,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-09T10:00:00Z',
    specifications: [
      { label: 'التغليف', value: 'بوكس كرتوني فاخر مع شرائط ستان' },
      { label: 'التخصيص', value: 'تخصيص كامل لكافة عناصر الباكيج' }
    ]
  },
  {
    id: 'prod-10',
    name: 'كفر هاتف آيفون / سامسونج مضاد للصدمات مع صورتك',
    categoryId: 'cat-phone-cases',
    price: 14000,
    description: 'حافظة هاتف متينة بحواف سيليكون ماصة للصدمات مع ظهر زجاجي أو ألمنيوم مطبوع بصورتك بدقة فائقة ووضوح عالي.',
    images: [
      '/src/assets/images/hero_printing_store_1790334111184.jpg'
    ],
    isFeatured: false,
    isActive: true,
    inStock: true,
    createdAt: '2026-09-10T12:00:00Z',
    specifications: [
      { label: 'التوافق', value: 'جميع موديلات iPhone و Samsung Galaxy' },
      { label: 'الحماية', value: 'حواف معززة لحماية الكاميرا والشاشة' }
    ]
  }
];

export const INITIAL_DELIVERY_SETTINGS: DeliverySetting[] = [
  {
    id: 'del-baghdad',
    title: 'توصيل داخل محافظة بغداد',
    price: 5000,
    estimatedDays: 'خلال 24 إلى 48 ساعة',
    description: 'توصيل مباشر إلى باب المنزل لكافة مناطق بغداد (الرصافة والكرخ)',
    isActive: true
  },
  {
    id: 'del-provinces',
    title: 'توصيل كافة المحافظات العراقية',
    price: 8000,
    estimatedDays: 'خلال 2 إلى 4 أيام عمل',
    description: 'شحن سريع ومضمون لكافة محافظات العراق (الشمال، الفرات الأوسط والجنوب)',
    isActive: true
  }
];

export const INITIAL_ADVERTISEMENTS: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'عروض موسم التخرج السنوية من "ذكرى للطباعة"',
    subtitle: 'خصومات تصل إلى 25% على وشاحات التخرج، الدروع التذكارية، وبوسترات التخرج الفاخرة',
    image: '/src/assets/images/hero_printing_store_1790334111184.jpg',
    buttonText: 'تصفح أوشحة التخرج',
    badgeText: 'موسم 2026',
    isActive: true,
    order: 1
  },
  {
    id: 'ad-2',
    title: 'اصنع هديتك بلمسة خاصة لا تُنسى',
    subtitle: 'حفر ليزري وطباعة ألوان دائمة على الأكواب، الإطارات، وحافظات الهواتف بالدينار العراقي',
    image: '/src/assets/images/product_wooden_frame_1790334136533.jpg',
    buttonText: 'اكتشف الهدايا المخصصة',
    badgeText: 'هدايا حصرية',
    isActive: true,
    order: 2
  },
  {
    id: 'ad-3',
    title: 'توصيل سريع إلى باب منزلك مع الدفع عند الاستلام',
    subtitle: 'شحن موثوق داخل بغداد وكافة محافظات العراق مع ضمان جودة المنتج ورضاكم التام',
    image: '/src/assets/images/product_custom_mug_1790334124503.jpg',
    buttonText: 'تسوق الآن',
    badgeText: 'دفع عند الاستلام',
    isActive: true,
    order: 3
  }
];

export const INITIAL_PROMOTIONAL_VIDEOS: PromotionalVideo[] = [
  {
    id: 'vid-1',
    title: 'كواليس الطباعة الحرارية والحفر الليزري في متجر ذكرى',
    description: 'شاهد كيف نحول أفكاركم وذكرياتكم الجميلة إلى قطع فنية ملموسة بجودة طباعة فوتوغرافية ومكائن ليزر متطورة.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0',
    posterUrl: '/src/assets/images/hero_printing_store_1790334111184.jpg',
    isActive: true,
    order: 1
  }
];

export const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'soc-ig',
    platform: 'instagram',
    name: 'إنستغرام',
    handle: '@zekra_print',
    url: 'https://instagram.com',
    iconBgColor: '#E1306C',
    isActive: true,
    order: 1
  },
  {
    id: 'soc-tt',
    platform: 'tiktok',
    name: 'تيك توك',
    handle: '@zekra_printing',
    url: 'https://tiktok.com',
    iconBgColor: '#000000',
    isActive: true,
    order: 2
  },
  {
    id: 'soc-wa',
    platform: 'whatsapp',
    name: 'واتساب مباشر',
    handle: '+964 770 123 4567',
    url: 'https://wa.me/9647701234567',
    iconBgColor: '#25D366',
    isActive: true,
    order: 3
  },
  {
    id: 'soc-tg',
    platform: 'telegram',
    name: 'قناة التليغرام',
    handle: 't.me/zekra_print_iq',
    url: 'https://t.me',
    iconBgColor: '#0088cc',
    isActive: true,
    order: 4
  },
  {
    id: 'soc-fb',
    platform: 'facebook',
    name: 'فيسبوك',
    handle: 'ذكرى للطباعة والهدايا',
    url: 'https://facebook.com',
    iconBgColor: '#1877F2',
    isActive: true,
    order: 5
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: 'ذكرى للطباعة',
  storeTagline: 'متجر الهدايا التذكارية والطباعة المخصصة',
  storeDescription: 'متجر عراقي رائد في مجال الطباعة الحرارية، الحفر الليزري، وصناعة الهدايا الشخصية والتذكارية بأعلى معايير الجودة والأناقة.',
  phone: '07701234567',
  whatsapp: '07701234567',
  email: 'contact@zekraprint.iq',
  address: 'العراق - بغداد - الكرادة - شارع 14 رمضان',
  workingHours: 'يومياً من 9:00 صباحاً حتى 11:00 مساءً',
  currency: 'د.ع',
  logoUrl: '/store-logo.svg',
  siteProtection: {
    enabled: false,
    password: '',
    hint: ''
  }
};

export const INITIAL_ADMIN_USERS: import('../types').AdminUserRecord[] = [
  {
    id: 'admin-owner',
    email: 'aaa0750907766@gmail.com',
    name: 'مالك المتجر (المدير العام)',
    role: 'super_admin',
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z'
  },
  {
    id: 'admin-system',
    email: 'admin@zekraprint.iq',
    name: 'مشرف النظام',
    role: 'admin',
    isActive: true,
    createdAt: '2026-09-01T00:00:00Z'
  }
];

export const INITIAL_THEME_SETTINGS: ThemeSettings = {
  primaryColor: '#1e3a2b',
  secondaryColor: '#b4914c',
  accentColor: '#d97706',
  bgColor: '#fafaf9',
  textColor: '#1c1917',
  buttonColor: '#1e3a2b',
  buttonTextColor: '#ffffff'
};

export const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ZKR-9041',
    customerName: 'حيدر علي الكرخي',
    phone: '07701122334',
    city: 'بغداد',
    address: 'اليرموك - محلة 608 - قرب جامع المأمون',
    notes: 'يرجى كتابة الاسم "حيدر علي" بالخط الديواني على الكوب',
    items: [
      {
        productId: 'prod-1',
        productName: 'كوب سيراميك فاخر مع خط عربي واسم مخصص',
        price: 12000,
        quantity: 2,
        image: '/src/assets/images/product_custom_mug_1790334124503.jpg',
        customNote: 'الاسم: حيدر علي'
      },
      {
        productId: 'prod-2',
        productName: 'إطار خشب السنديان الطبيعي مع حفر الاسم والصورة',
        price: 25000,
        quantity: 1,
        image: '/src/assets/images/product_wooden_frame_1790334136533.jpg',
        customNote: 'تم إرسال الصورة في المحادثة'
      }
    ],
    subtotal: 49000,
    deliveryFee: 5000,
    deliveryOptionTitle: 'توصيل داخل محافظة بغداد',
    total: 54000,
    status: 'تم قبول الطلب',
    createdAt: '2026-09-24T14:30:00Z',
    statusHistory: [
      { status: 'طلب جديد', timestamp: '2026-09-24T14:30:00Z', note: 'تم استلام طلب العميل بنجاح عبر المتجر' },
      { status: 'قيد المراجعة', timestamp: '2026-09-24T15:10:00Z', note: 'مراجعة بيانات التصميم وتأكيد توفر الخشب السندياني' },
      { status: 'تم قبول الطلب', timestamp: '2026-09-24T16:00:00Z', note: 'تم تأكيد الطلب مع العميل وإحالته لورشة الطباعة' }
    ],
    paymentMethod: 'الدفع عند الاستلام'
  },
  {
    id: 'ord-102',
    orderNumber: 'ZKR-9042',
    customerName: 'سارة محمد البصري',
    phone: '07809988776',
    city: 'البصرة',
    address: 'البصرة - الطويسة - شارع السيدة زينب',
    notes: 'وشاح تخرج كلية الهندسة 2026 باللون الزمردي والذهبي',
    items: [
      {
        productId: 'prod-3',
        productName: 'وشاح تخرج ملكي ساتان بتطريز ذهبي وشارة الكلية',
        price: 28000,
        quantity: 1,
        image: '/src/assets/images/product_graduation_sash_1790334150200.jpg',
        customNote: 'سارة محمد - هندسة حاسوب 2026'
      }
    ],
    subtotal: 28000,
    deliveryFee: 8000,
    deliveryOptionTitle: 'توصيل كافة المحافظات العراقية',
    total: 36000,
    status: 'قيد التجهيز',
    createdAt: '2026-09-25T02:15:00Z',
    statusHistory: [
      { status: 'طلب جديد', timestamp: '2026-09-25T02:15:00Z', note: 'استلام الطلب' },
      { status: 'تم قبول الطلب', timestamp: '2026-09-25T03:00:00Z', note: 'تأكيد تطريز الاسم والشعار' },
      { status: 'قيد التجهيز', timestamp: '2026-09-25T03:45:00Z', note: 'جاري التطريز بالقصب الذهبي في المشغل' }
    ],
    paymentMethod: 'الدفع عند الاستلام'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    customerName: 'حيدر علي الكرخي',
    customerPhone: '07701122334',
    lastMessage: 'أهلاً بكم، هل يمكنني اختيار نوع خط معين للاسم على الإطار؟',
    unreadAdminCount: 1,
    unreadCustomerCount: 0,
    updatedAt: '2026-09-25T03:30:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'customer',
        text: 'مرحبا أستاذ، عندي استفسار بخصوص إطار خشب السنديان قبل ما اثبت الطلب',
        productAttachment: {
          id: 'prod-2',
          name: 'إطار خشب السنديان الطبيعي مع حفر الاسم والصورة',
          price: 25000,
          image: '/src/assets/images/product_wooden_frame_1790334136533.jpg'
        },
        timestamp: '2026-09-25T03:20:00Z'
      },
      {
        id: 'msg-2',
        sender: 'admin',
        text: 'أهلاً بك أخي حيدر! نعم بالتأكيد، يسعدنا خدمتك. ما هو استفسارك؟',
        timestamp: '2026-09-25T03:25:00Z'
      },
      {
        id: 'msg-3',
        sender: 'customer',
        text: 'أهلاً بكم، هل يمكنني اختيار نوع خط معين للاسم على الإطار؟',
        timestamp: '2026-09-25T03:30:00Z'
      }
    ]
  }
];
