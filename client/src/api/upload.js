import api from './axios';

/**
 * Upload a single image file to Cloudinary via the backend.
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Optional progress callback (0–100)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = (file, onProgress) => {
  const formData = new FormData();
  formData.append('image', file);

  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onProgress(percent);
      }
    },
  });
};

/**
 * Upload multiple image files.
 * @param {File[]} files - Array of image files
 * @returns {Promise<{files: Array<{url: string, publicId: string}>}>}
 */
export const uploadMultipleImages = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  return api.post('/upload/multiple', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** Validate file before upload — returns error string or null */
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPG, PNG, WebP, or GIF images are allowed.';
  }
  if (file.size > maxSize) {
    return 'Image must be smaller than 5 MB.';
  }
  return null;
};
