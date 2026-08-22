import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import StarRating from '../ui/StarRating';
import { PLACEHOLDER_IMAGE } from '../../constants/images';
import { useAuth } from '../../context/AuthContext';
import { toggleWishlist } from '../../api/users';

export default function VendorCard({ vendor, index = 0 }) {
  const imageUrl = vendor.coverImage?.url || vendor.logo?.url || PLACEHOLDER_IMAGE;
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isSaved = user?.wishlist?.includes(vendor._id);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      const res = await toggleWishlist(vendor._id);
      // user.wishlist needs to be updated. Assuming AuthContext watches for changes, or we manually update it
      setUser({ ...user, wishlist: res.data.wishlist });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      className="h-full"
    >
      <Link to={`/vendors/${vendor._id}`} className="block h-full group">
        <div className="relative h-[400px] w-full overflow-hidden rounded-2xl mb-4 cinematic-shadow">
          <img
            src={imageUrl}
            alt={vendor.businessName}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-matte-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {vendor.featured && (
              <span className="px-3 py-1 flex items-center gap-1 text-[10px] uppercase tracking-widest text-matte-black bg-champagne-gold backdrop-blur-md rounded-full font-semibold shadow-lg">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
            <span className="px-3 py-1 text-[10px] uppercase tracking-widest text-white bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/10">
              {vendor.category}
            </span>
          </div>

          {/* Wishlist Button */}
          <button 
            onClick={handleSave}
            disabled={loading}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
          >
            <svg className={`w-5 h-5 ${isSaved ? 'text-champagne-gold fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSaved ? 0 : 1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-6 right-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10">
            <div className="flex items-center gap-2 mb-2 text-white/90 text-sm">
              <StarRating rating={vendor.rating || 0} />
              <span className="text-xs font-light">({vendor.totalReviews || 0} reviews)</span>
            </div>
            <h3 className="font-display text-2xl text-white mb-2 line-clamp-1">
              {vendor.businessName}
            </h3>
            <p className="text-sm text-white/70 line-clamp-2 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              {vendor.description}
            </p>
          </div>
        </div>
        <div className="px-2 flex justify-between items-end">
          <span className="text-xs uppercase tracking-widest text-gray-400">{vendor.location?.city || 'Global'}</span>
          {vendor.priceRange && (
            <span className="text-sm font-medium text-matte-black">
              From ₹{vendor.priceRange.min?.toLocaleString()}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
