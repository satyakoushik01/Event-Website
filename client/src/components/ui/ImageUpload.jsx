import { useRef, useState } from 'react';
import { uploadImage, validateImageFile } from '../../api/upload';

/**
 * Reusable image upload component.
 * Props:
 *  - currentUrl: existing image URL to display
 *  - onUpload(url): called with the Cloudinary URL after successful upload
 *  - shape: 'circle' | 'rect' (default: 'rect')
 *  - placeholder: text shown when no image is selected
 *  - className: extra class on wrapper
 */
export default function ImageUpload({
  currentUrl,
  onUpload,
  shape = 'rect',
  placeholder = 'Click to upload image',
  className = '',
}) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentUrl || null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const isCircle = shape === 'circle';

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(0);

    try {
      const { data } = await uploadImage(file, setProgress);
      onUpload(data.url, data.publicId);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setPreview(currentUrl || null);
    } finally {
      setUploading(false);
      setProgress(0);
      // Reset input so the same file can be re-selected if needed
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Preview area */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`relative overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary-300 bg-gray-50 transition-colors group
          ${isCircle ? 'w-24 h-24 rounded-full' : 'w-full h-40 rounded-2xl'}
          ${uploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt="Upload preview"
            className={`w-full h-full object-cover ${isCircle ? 'rounded-full' : 'rounded-2xl'}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <span className="text-3xl mb-1">📷</span>
            <span className="text-xs text-gray-400">{placeholder}</span>
          </div>
        )}

        {/* Hover overlay */}
        {!uploading && (
          <div className={`absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${isCircle ? 'rounded-full' : 'rounded-2xl'}`}>
            <span className="text-white text-xs font-medium">Change</span>
          </div>
        )}

        {/* Upload progress overlay */}
        {uploading && (
          <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 ${isCircle ? 'rounded-full' : 'rounded-2xl'}`}>
            <div className="w-3/4 bg-white/30 rounded-full h-1.5">
              <div
                className="bg-white h-1.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white text-xs font-medium">{progress}%</span>
          </div>
        )}
      </button>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-500 text-center">{error}</p>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-400 text-center">
        JPG, PNG or WebP · Max 5 MB
      </p>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="sr-only"
      />
    </div>
  );
}
