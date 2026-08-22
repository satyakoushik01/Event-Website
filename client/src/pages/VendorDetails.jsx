import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getVendor, getVendorsByCategory, getVendorAvailability } from '../api/vendors';
import { getVendorReviews, createReview } from '../api/reviews';
import { toggleWishlist } from '../api/users';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import Badge from '../components/ui/Badge';
import StarRating from '../components/ui/StarRating';
import Button from '../components/ui/Button';
import Textarea from '../components/ui/Textarea';
import Input from '../components/ui/Input';
import ImageUpload from '../components/ui/ImageUpload';
import VendorCard from '../components/vendors/VendorCard';
import { PLACEHOLDER_IMAGE } from '../constants/images';

export default function VendorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarVendors, setSimilarVendors] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '', images: [] });
  const [submitting, setSubmitting] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [error, setError] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    setSelectedPackage(null);
    setSelectedDate(null);
    window.scrollTo(0, 0);

    Promise.all([
      getVendor(id), 
      getVendorReviews(id),
      getVendorAvailability(id).catch(() => ({ data: { bookedDates: [] } }))
    ])
      .then(([vRes, rRes, aRes]) => {
        const fetchedVendor = vRes.data.vendor;
        setVendor(fetchedVendor);
        setReviews(rRes.data.reviews || []);
        setBookedDates(aRes.data.bookedDates?.map(d => new Date(d)) || []);
        
        // Fetch similar vendors
        getVendorsByCategory(fetchedVendor.category, { limit: 3 })
          .then(simRes => {
            const filtered = simRes.data.vendors.filter(v => v._id !== id).slice(0, 3);
            setSimilarVendors(filtered);
          })
          .catch(console.error);
      })
      .catch(() => setError('Unable to load vendor details.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.wishlist) {
      setWishlisted(user.wishlist.some((w) => String(w._id || w) === String(id)));
    }
  }, [user, id]);

  const handleWishlist = async () => {
    if (!user) return navigate('/login');
    try {
      await toggleWishlist(id);
      setWishlisted(!wishlisted);
      refreshUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setSubmitting(true);
    try {
      await createReview({ vendor: id, ...reviewForm });
      const { data } = await getVendorReviews(id);
      setReviews(data.reviews || []);
      setReviewForm({ rating: 5, title: '', comment: '', images: [] });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewImageUpload = (url, publicId) => {
    setReviewForm((prev) => ({ ...prev, images: [...prev.images, { url, publicId }] }));
  };

  if (loading) return <Loader className="min-h-screen" size="lg" />;
  if (error) return <div className="text-center py-40 text-red-500 font-light">{error}</div>;
  if (!vendor) return <div className="text-center py-40 text-gray-400 font-light">Vendor not found</div>;

  const coverUrl = vendor.coverImage?.url || PLACEHOLDER_IMAGE;

  return (
    <div className="bg-warm-white">
      {/* Cinematic hero image */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden bg-matte-black">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src={coverUrl}
          alt={vendor.businessName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <Badge color="gold" className="mb-4">{vendor.category}</Badge>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white mb-4 tracking-tight">
                {vendor.businessName}
              </h1>
              <div className="flex flex-wrap items-center gap-6">
                <StarRating rating={vendor.rating} size="lg" />
                <span className="text-white/60 text-sm font-light">{vendor.totalReviews} reviews</span>
                {vendor.location?.city && (
                  <span className="text-white/60 text-sm font-light">
                    {vendor.location.city}, {vendor.location.state}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-16">
            <section>
              <h2 className="font-display text-3xl mb-6 text-matte-black">About</h2>
              <div className="w-12 h-[1px] bg-champagne-gold mb-8" />
              <p className="text-gray-600 leading-relaxed font-light text-lg">{vendor.description}</p>
            </section>

            {vendor.services?.length > 0 && (
              <section>
                <h2 className="font-display text-3xl mb-6 text-matte-black">Services & Packages</h2>
                <div className="w-12 h-[1px] bg-champagne-gold mb-8" />
                <div className="grid gap-6">
                  {vendor.services.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      onClick={() => setSelectedPackage(s)}
                      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer cinematic-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        selectedPackage?.name === s.name 
                          ? 'border-champagne-gold bg-champagne-gold/5' 
                          : 'border-transparent bg-white hover:border-gray-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-display text-xl text-matte-black">{s.name}</h3>
                          {selectedPackage?.name === s.name && (
                            <span className="px-2 py-1 text-[10px] uppercase tracking-widest text-matte-black bg-champagne-gold rounded-full font-semibold shadow-sm">Selected</span>
                          )}
                        </div>
                        {s.description && <p className="text-sm text-gray-500 font-light leading-relaxed">{s.description}</p>}
                      </div>
                      <div className="flex flex-col md:items-end">
                        <span className="font-display text-2xl text-matte-black mb-1">₹{s.price?.toLocaleString()}</span>
                        <span className="text-xs uppercase tracking-widest text-gray-400">{s.unit || 'per event'}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section>
              <h2 className="font-display text-3xl mb-6 text-matte-black">Client Reviews</h2>
              <div className="w-12 h-[1px] bg-champagne-gold mb-8" />
              
              {reviews.length === 0 ? (
                <p className="text-gray-400 font-light italic">No reviews yet. Be the first to share your experience.</p>
              ) : (
                <div className="space-y-8">
                  {reviews.map((r, i) => (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="pb-8 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-matte-black flex items-center justify-center text-white font-display text-lg">
                          {r.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-matte-black">{r.user?.name}</p>
                          <StarRating rating={r.rating} />
                        </div>
                      </div>
                      {r.title && <h4 className="font-display text-xl mb-2 text-matte-black">{r.title}</h4>}
                      <p className="text-gray-600 font-light leading-relaxed">{r.comment}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {user && (
                <div className="mt-16 glass-panel p-8 rounded-3xl">
                  <h3 className="font-display text-2xl mb-8 text-matte-black">Share Your Experience</h3>
                  <form onSubmit={handleReview} className="space-y-8">
                    <div>
                      <label className="block text-xs uppercase tracking-widest font-medium text-gray-500 mb-2">Rating</label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="w-full bg-transparent border-b border-gray-200 pb-2 pt-4 px-0 text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>{n} Stars</option>
                        ))}
                      </select>
                    </div>
                    <Input label="Title" value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} />
                    <Textarea label="Your Experience" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} required rows={4} />
                    <div>
                      <p className="text-xs uppercase tracking-widest font-medium text-gray-500 mb-4">Add a Photo <span className="text-gray-400 font-normal normal-case">(optional)</span></p>
                      {reviewForm.images.length === 0 ? (
                        <ImageUpload onUpload={handleReviewImageUpload} placeholder="Upload review photo" shape="rect" />
                      ) : (
                        <div className="flex items-center gap-4">
                          <img src={reviewForm.images[0].url} alt="Review" className="w-24 h-24 rounded-xl object-cover cinematic-shadow" />
                          <button type="button" onClick={() => setReviewForm((p) => ({ ...p, images: [] }))} className="text-xs text-red-500 hover:underline font-light">
                            Remove photo
                          </button>
                        </div>
                      )}
                    </div>
                    <Button type="submit" loading={submitting} size="lg">Submit Review</Button>
                  </form>
                </div>
              )}
            </section>
          </div>

          {/* Right: Booking Card */}
          <div>
            <div className="glass-panel p-8 rounded-3xl sticky top-28 cinematic-shadow">
              {vendor.priceRange && (
                <div className="mb-8 pb-8 border-b border-gray-100">
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Investment</p>
                  <p className="font-display text-3xl text-matte-black">
                    {selectedPackage ? `₹${selectedPackage.price.toLocaleString()}` : `From ₹${vendor.priceRange.min?.toLocaleString()}`}
                  </p>
                  <p className="text-sm text-gray-400 font-light mt-1">
                    {selectedPackage ? `Selected: ${selectedPackage.name}` : `Up to ₹${vendor.priceRange.max?.toLocaleString()}`}
                  </p>
                </div>
              )}
              
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest font-medium text-gray-500 mb-3">Select Event Date</p>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  excludeDates={bookedDates}
                  minDate={new Date()}
                  placeholderText="Choose an available date"
                  className="w-full bg-white border border-gray-200 p-4 rounded-xl text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light shadow-sm cursor-pointer"
                />
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    if (!selectedPackage || !selectedDate) {
                      alert('Please select a package and an available date to continue.');
                      return;
                    }
                    navigate(`/checkout/${id}`, { state: { package: selectedPackage, date: selectedDate } });
                  }}
                >
                  Reserve Now
                </Button>
                <Button variant="outline" className="w-full" onClick={handleWishlist}>
                  {wishlisted ? '♥ Saved to Wishlist' : '♡ Save to Wishlist'}
                </Button>
                {vendor.contactInfo?.whatsapp && (
                  <a href={`https://wa.me/${vendor.contactInfo.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="block w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      Chat on WhatsApp
                    </Button>
                  </a>
                )}
              </div>

              {vendor.contactInfo && (
                <div className="mt-8 pt-8 border-t border-gray-100 space-y-3 text-sm text-gray-500 font-light">
                  {vendor.contactInfo.phone && <p>{vendor.contactInfo.phone}</p>}
                  {vendor.contactInfo.email && <p>{vendor.contactInfo.email}</p>}
                  {vendor.yearsOfExperience > 0 && (
                    <p>{vendor.yearsOfExperience} years of excellence</p>
                  )}
                  {vendor.completedEvents > 0 && (
                    <p>{vendor.completedEvents} events curated</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Vendors */}
      {similarVendors.length > 0 && (
        <div className="bg-white py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-display text-3xl mb-6 text-matte-black text-center">Similar Artisans</h2>
            <div className="w-12 h-[1px] bg-champagne-gold mb-12 mx-auto" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarVendors.map((v, i) => (
                <VendorCard key={v._id} vendor={v} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
