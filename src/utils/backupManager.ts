import { getSupabase } from '../lib/supabase';

export interface BackupDataPayload {
  version: string;
  timestamp: string;
  metadata: {
    storeName: string;
    totalProducts: number;
    totalOrders: number;
    totalCategories: number;
  };
  data: {
    categories: any[];
    products: any[];
    orders: any[];
    deliveryOptions: any[];
    announcements: any[];
    promotionalVideos: any[];
    socialLinks: any[];
    storeSettings: any;
    themeSettings: any;
    adminUsers: any[];
  };
}

/**
 * Creates a comprehensive JSON snapshot of the entire store state.
 */
export const createBackupSnapshot = (state: {
  categories: any[];
  products: any[];
  orders: any[];
  deliveryOptions: any[];
  announcements: any[];
  promotionalVideos: any[];
  socialLinks: any[];
  storeSettings: any;
  themeSettings: any;
  adminUsers: any[];
}): BackupDataPayload => {
  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    metadata: {
      storeName: state.storeSettings?.storeName || 'ذكرى للطباعة',
      totalProducts: state.products?.length || 0,
      totalOrders: state.orders?.length || 0,
      totalCategories: state.categories?.length || 0
    },
    data: {
      categories: state.categories,
      products: state.products,
      orders: state.orders,
      deliveryOptions: state.deliveryOptions,
      announcements: state.announcements,
      promotionalVideos: state.promotionalVideos,
      socialLinks: state.socialLinks,
      storeSettings: state.storeSettings,
      themeSettings: state.themeSettings,
      adminUsers: state.adminUsers
    }
  };
};

/**
 * Downloads a backup snapshot as a .json file directly to the admin's device.
 */
export const downloadBackupAsFile = (backup: BackupDataPayload) => {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `zekra_store_backup_${dateStr}.json`;
  const jsonBlob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(jsonBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Saves a backup snapshot to Supabase (if connected) in 'system_backups' table.
 */
export const syncBackupToSupabase = async (backup: BackupDataPayload): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase.from('system_backups').insert({
      id: `backup-${Date.now()}`,
      version: backup.version,
      timestamp: backup.timestamp,
      metadata: backup.metadata,
      payload: backup.data
    });

    if (error) {
      console.warn('Notice syncing backup to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Backup sync exception:', err);
    return false;
  }
};

/**
 * Reads and validates an imported backup JSON file.
 */
export const parseBackupFile = (file: File): Promise<BackupDataPayload> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('تعذر قراءة ملف النسخة الاحتياطية'));
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.data || !parsed.timestamp) {
          throw new Error('صيغة ملف النسخة الاحتياطية غير صالحة أو تالفة');
        }

        resolve(parsed as BackupDataPayload);
      } catch (err: any) {
        reject(new Error(err.message || 'الملف ليس بتنسيق JSON صحيح'));
      }
    };
    reader.readAsText(file);
  });
};
