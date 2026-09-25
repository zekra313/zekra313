import { getSupabase } from '../lib/supabase';

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg' | 'image/png';
}

/**
 * Compresses an image file on the client using HTML5 Canvas.
 * Produces crisp, lightweight WebP/JPEG files (<150KB) for instant uploads.
 */
export const compressImageFile = (
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<{ blob: Blob; dataUrl: string; originalSize: number; compressedSize: number }> => {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    format = 'image/webp'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة ملف الصورة'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('فشل معالجة أبعاد الصورة'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('فشل تهيئة محرك معالجة الصور'));
          return;
        }

        // Smooth resampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(format, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('فشل ضغط الصورة'));
              return;
            }
            resolve({
              blob,
              dataUrl,
              originalSize: file.size,
              compressedSize: blob.size
            });
          },
          format,
          quality
        );
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Uploads an image to Supabase Storage bucket 'zekra-media' (or falls back to optimized dataUrl).
 */
export const uploadImageToCloudStorage = async (
  file: File | Blob,
  folder: 'logos' | 'products' | 'banners' | 'videos' = 'products',
  customFileName?: string
): Promise<{ url: string; source: 'supabase' | 'local_optimized'; size: number }> => {
  // 1. Compress image first
  const { blob, dataUrl, compressedSize } = await compressImageFile(file, {
    maxWidth: folder === 'logos' ? 600 : 1200,
    quality: 0.85
  });

  const supabase = getSupabase();
  if (!supabase) {
    return {
      url: dataUrl,
      source: 'local_optimized',
      size: compressedSize
    };
  }

  try {
    const ext = 'webp';
    const timestamp = Date.now();
    const cleanName = customFileName
      ? `${customFileName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${timestamp}.${ext}`
      : `${folder}_${timestamp}.${ext}`;
    const filePath = `${folder}/${cleanName}`;

    // Upload to Supabase Storage bucket 'zekra-media'
    const { data, error } = await supabase.storage
      .from('zekra-media')
      .upload(filePath, blob, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      console.warn('Supabase storage bucket notice, falling back to dataUrl:', error.message);
      return {
        url: dataUrl,
        source: 'local_optimized',
        size: compressedSize
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('zekra-media')
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl || dataUrl,
      source: 'supabase',
      size: compressedSize
    };
  } catch (err) {
    console.warn('Upload error, using compressed local dataUrl:', err);
    return {
      url: dataUrl,
      source: 'local_optimized',
      size: compressedSize
    };
  }
};
