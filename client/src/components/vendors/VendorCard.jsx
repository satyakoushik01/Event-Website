import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarRating from '../ui/StarRating';
import { PLACEHOLDER_IMAGE } from '../../constants/images';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist } from '../../api/users';

export default function VendorCard({ vendor, index = 0 }) {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [localShortlisted, setLocalShortlisted] = useState(false);

  const vendorId = vendor._id || vendor.id;
  const vendorSlug = vendor.slug || vendorId;
  const imageUrl = vendor.coverImage?.url || vendor.logo?.url || PLACEHOLDER_IMAGE;

  // Check shortlist state from user wishlist or localStorage
  useEffect(() => {
    if (user?.wishlist) {
      const isSaved = user.wishlist.some(
        (w) => String(w._id || w) === String(vendorId)
      );
      setLocalShortlisted(isSaved);
    } else {
      const savedList = JSON.parse(localStorage.getItem('moments_shortlist') || '[]');
      setLocalShortlisted(savedList.includes(String(vendorId)));
    }
  }, [user, vendorId]);

  const handleShortlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      setLoading(true);
      try {
        const res = await toggleWishlist(vendorId);
        if (res.data?.wishlist) {
          setUser({ ...user, wishlist: res.data.wishlist });
          setLocalShortlisted(res.data.wishlist.some((w) => String(w._id || w) === String(vendorId)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      // LocalStorage fallback for guest users
      const savedList = JSON.parse(localStorage.getItem('moments_shortlist') || '[]');
      const strId = String(vendorId);
      let updated;
      if (savedList.includes(strId)) {
        updated = savedList.filter((id) => id !== strId);
        setLocalShortlisted(false);
      } else {
        updated = [...savedList, strId];
        setLocalShortlisted(true);
      }
      localStorage.setItem('moments_shortlist', JSON.stringify(updated));
    }
  };

  const formattedPrice = vendor.startingPrice
    ? vendor.startingPrice >= 10000
      ? `₹${vendor.startingPrice.toLocaleString('en-IN')}`
      : `₹${vendor.startingPrice.toLocaleString('en-IN')} per person`
    : vendor.priceRange?.min
    ? `₹${vendor.priceRange.min.toLocaleString('en-IN')}`
    : 'Custom Quote';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.08, ease: 'easeOut' }}
      className="bg-white rounded-3xl border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col justify-between group h-full"
    >
      <div>
        {/* Image Container */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-matte-black/5">
          <img
            src={imageUrl}
            alt={vendor.businessName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            {vendor.isNew && (
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-red-600 rounded-full shadow-md">
                NEW
              </span>
            )}
            {(vendor.isVerified || vendor.featured) && (
              <span className="px-3 py-1 flex items-center gap-1 text-[10px] uppercase tracking-widest text-matte-black bg-champagne-gold font-semibold rounded-full shadow-md">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                VERIFIED
              </span>
            )}
            <span className="px-3 py-1 text-[10px] uppercase tracking-widest text-white/90 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
              {vendor.category}
            </span>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="text-[11px] font-medium tracking-wide text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              📍 {vendor.location?.city || 'Global'}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-display text-2xl text-matte-black line-clamp-1 group-hover:text-champagne-gold transition-colors">
              {vendor.businessName}
            </h3>
          </div>

          {/* Specialty */}
          <p className="text-xs uppercase tracking-widest text-champagne-gold font-semibold mb-3">
            Specialty: {vendor.specialty || vendor.category}
          </p>

          {/* Rating & Price */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="text-champagne-gold font-bold text-base">★</span>
              <span className="font-semibold text-matte-black">{vendor.rating || '4.8'}</span>
              <span className="text-xs text-gray-400 font-light">({vendor.totalReviews || vendor.reviewCount || 35} Reviews)</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Starting Price</span>
              <span className="text-sm font-bold text-matte-black">{formattedPrice}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-2 mb-6">
            {vendor.shortDescription || vendor.description}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 pt-0 grid grid-cols-2 gap-3">
        <button
          onClick={handleShortlist}
          disabled={loading}
          className={`py-3 px-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 ${
            localShortlisted
              ? 'bg-matte-black text-champagne-gold border-matte-black'
              : 'bg-white text-gray-600 border-gray-200 hover:border-matte-black hover:text-matte-black'
          }`}
        >
          <svg className={`w-4 h-4 ${localShortlisted ? 'fill-current text-champagne-gold' : 'stroke-current'}`} fill={localShortlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {localShortlisted ? 'SHORTLISTED' : 'SHORTLIST'}
        </button>

        <Link
          to={`/vendors/${vendorSlug}`}
          className="py-3 px-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-matte-black text-white hover:bg-champagne-gold hover:text-matte-black transition-all text-center flex items-center justify-center shadow-sm"
        >
          VIEW PORTFOLIO
        </Link>
      </div>
    </motion.div>
  );
}
