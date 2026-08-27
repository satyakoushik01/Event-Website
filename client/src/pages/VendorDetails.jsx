import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVendor, getVendorsByCategory, getVendorAvailability } from '../api/vendors';
import { getVendorReviews } from '../api/reviews';
import { toggleWishlist } from '../api/users';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import StarRating from '../components/ui/StarRating';
import EnquiryModal from '../components/vendors/EnquiryModal';
import PortfolioLightbox from '../components/vendors/PortfolioLightbox';
import { PLACEHOLDER_IMAGE } from '../constants/images';

/* ── Icons ───────────────────────────────────────── */
function WaIcon({ cls = 'w-4 h-4' }) {
  return (
    <svg className={`fill-current ${cls}`} viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function HeartIcon({ filled, cls = 'w-4 h-4' }) {
  return (
    <svg className={`fill-current ${cls}`} viewBox="0 0 24 24">
      {filled
        ? <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        : <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
      }
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   VENDOR DETAILS  –  NO SIDEBAR, FULL-WIDTH CARD STACK
═══════════════════════════════════════════════════════ */
export default function VendorDetails() {
  const { id } = useParams();
  const { user, refreshUser, setUser } = useAuth();

  /* state */
  const [vendor, setVendor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('About');
  const [portfolioTab, setPortfolioTab] = useState('All');
  const [wishlisted, setWishlisted] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryPkg, setEnquiryPkg] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /* data load */
  useEffect(() => {
    setLoading(true);
    setError('');
    setActiveTab('About');
    setPortfolioTab('All');
    window.scrollTo(0, 0);

    Promise.all([
      getVendor(id),
      getVendorReviews(id).catch(() => ({ data: { reviews: [] } })),
      getVendorAvailability(id).catch(() => ({ data: { bookedDates: [] } })),
    ])
      .then(([vRes, rRes]) => {
        const v = vRes.data.vendor;
        setVendor(v);
        const merged = rRes.data.reviews?.length ? rRes.data.reviews : (v.reviews || []);
        setReviews(merged);
      })
      .catch(() => setError('Unable to load vendor portfolio.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!vendor) return;
    const vid = vendor._id || vendor.id;
    if (user?.wishlist) {
      setWishlisted(user.wishlist.some(w => String(w._id || w) === String(vid)));
    } else {
      const saved = JSON.parse(localStorage.getItem('moments_shortlist') || '[]');
      setWishlisted(saved.includes(String(vid)));
    }
  }, [user, vendor]);

  const handleWishlist = async () => {
    if (!vendor) return;
    const vid = vendor._id || vendor.id;
    if (user) {
      try {
        const res = await toggleWishlist(vid);
        if (res.data?.wishlist) {
          setUser({ ...user, wishlist: res.data.wishlist });
          setWishlisted(res.data.wishlist.some(w => String(w._id || w) === String(vid)));
        } else setWishlisted(w => !w);
        refreshUser();
      } catch (e) { console.error(e); }
    } else {
      const saved = JSON.parse(localStorage.getItem('moments_shortlist') || '[]');
      const sid = String(vid);
      const updated = saved.includes(sid) ? saved.filter(i => i !== sid) : [...saved, sid];
      setWishlisted(!saved.includes(sid));
      localStorage.setItem('moments_shortlist', JSON.stringify(updated));
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── guards ── */
  if (loading) return <Loader className="min-h-screen" size="lg" />;
  if (error)   return <div className="text-center py-40 text-red-400 font-light">{error}</div>;
  if (!vendor) return <div className="text-center py-40 text-gray-400 font-light">Vendor not found</div>;

  /* ── derived ── */
  const cover = vendor.coverImage?.url || PLACEHOLDER_IMAGE;
  const waNum = (vendor.contactInfo?.whatsapp || vendor.contactInfo?.phone || '919820011223').replace(/\D/g, '');
  const waMsg = encodeURIComponent(`Hi, I found ${vendor.businessName} on Moments Group and would like to know more about your services.`);
  const waUrl = `https://wa.me/${waNum}?text=${waMsg}`;

  const startPrice = vendor.startingPrice
    ? vendor.startingPrice >= 100000
      ? `₹${(vendor.startingPrice / 100000).toFixed(1)}L`
      : `₹${(vendor.startingPrice / 1000).toFixed(0)}K`
    : vendor.priceRange?.min
    ? `₹${(vendor.priceRange.min / 1000).toFixed(0)}K`
    : '₹75K';

  const catLabel = vendor.category === 'Photography'
    ? 'Photography & Films'
    : vendor.category === 'Decoration'
    ? 'Decor & Styling'
    : vendor.category || 'Event Services';

  const specialty = vendor.specialty || `${catLabel} • Floral Design • Stage Design`;

  /* stats */
  const stats = [
    { val: `${vendor.quickStats?.yearsExperience || vendor.yearsOfExperience || 8}+`, label: 'Years\nExperience' },
    { val: `${vendor.quickStats?.eventsCompleted || vendor.completedEvents || 240}+`, label: 'Events\nCompleted' },
    { val: vendor.quickStats?.photosDelivered || (vendor.category === 'Photography' ? '500K+' : '35+'), label: vendor.category === 'Photography' ? 'Photos\nDelivered' : 'Venues\nWorked' },
    { val: `${vendor.quickStats?.citiesCovered || 12}`, label: 'Cities\nServed' },
  ];

  /* portfolio */
  const portfolio = vendor.portfolio?.length ? vendor.portfolio : [
    { id: '1', title: 'Grand Mandap Setup',        category: 'Weddings',    url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85' },
    { id: '2', title: 'Floral Chandelier',          category: 'Weddings',    url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80' },
    { id: '3', title: 'Corporate Gala',             category: 'Corporate',   url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
    { id: '4', title: 'Engagement Arch',            category: 'Engagements', url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80' },
    { id: '5', title: 'Sangeet Night',              category: 'Sangeet',     url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80' },
    { id: '6', title: 'Centrepiece Table',          category: 'Weddings',    url: 'https://images.unsplash.com/photo-1567696153798-9111f9cd3d0d?w=800&q=80' },
  ];
  const portCats = ['All', 'Weddings', 'Corporate', 'Engagements', 'Sangeet', 'Other'];
  const filtered = portfolioTab === 'All'
    ? portfolio
    : portfolio.filter(p => p.category === portfolioTab || (portfolioTab === 'Weddings' && !p.category));

  /* packages */
  const packages = vendor.packages?.length ? vendor.packages : [
    {
      id: 'p1', name: 'Essential',
      priceLabel: vendor.category === 'Decoration' ? 'From ₹1.5L' : 'From ₹75K',
      features: vendor.category === 'Decoration'
        ? ['Basic stage décor', 'Entrance décor', 'Floral arrangements', 'Standard lighting']
        : ['6 Hours Coverage', 'Candid Photography', 'High Res Photos', 'Online Gallery'],
      isPopular: false,
    },
    {
      id: 'p2', name: 'Signature',
      priceLabel: vendor.category === 'Decoration' ? 'From ₹3.5L' : 'From ₹1.5L',
      features: vendor.category === 'Decoration'
        ? ['Premium stage décor', 'Customised theme', 'Floral styling', 'Entrance installation', 'Premium lighting']
        : ['12 Hours Coverage', 'Candid Photography', 'Cinematic Highlight', 'Photo Album', 'Drone (Basic)'],
      isPopular: true,
    },
    {
      id: 'p3', name: 'Bespoke',
      priceLabel: 'Custom Quote',
      features: ['Designed according to your venue, guest count and requirements.'],
      isPopular: false,
    },
  ];

  /* featured event */
  const feat = vendor.featuredEvents?.[0] || {
    title: 'Ananya & Rohan',
    eventType: 'Signature Wedding',
    location: vendor.location?.city || 'Hyderabad',
    guestCount: 350,
    theme: 'Contemporary Gold Theme',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80',
    tags: vendor.category === 'Decoration'
      ? ['Stage Décor', 'Floral Styling', 'Entrance Décor', 'Table Styling', 'Lighting']
      : ['Wedding Photography', 'Cinematic Film', 'Pre-Wedding Shoot', 'Drone', 'Photo Album'],
    budget: vendor.category === 'Decoration' ? '₹5L – ₹7L' : '₹3L+',
  };

  /* ────────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────── */
  return (
    <div style={{ background: '#f9f6f1', fontFamily: "'Inter', sans-serif" }} className="min-h-screen text-[#1a1a1a] pb-28">

      {/* ── BREADCRUMB ── */}
      <div className="pt-24 pb-3 px-6 sm:px-8 max-w-7xl mx-auto text-[11px] text-gray-400 flex items-center gap-1.5 flex-wrap mt-6">
        <Link to="/" className="hover:text-amber-700 transition-colors">Home</Link>
        <span>›</span>
        <Link to="/vendors" className="hover:text-amber-700 transition-colors">Vendors</Link>
        <span>›</span>
        <Link to={`/vendors?category=${encodeURIComponent(vendor.category)}`} className="hover:text-amber-700 transition-colors">{catLabel}</Link>
        <span>›</span>
        <span className="text-[#1a1a1a] font-medium">{vendor.businessName}</span>
      </div>

      {/* ═══════════════════════════════════════
          CARD STACK  (max-w-960, centered)
      ═══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col gap-4">

        {/* ─── 1. HERO CARD ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6">

            {/* top: info left + image right */}
            <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">

              {/* LEFT: text info */}
              <div className="flex-1 min-w-0 flex flex-col gap-3">

                {/* name + badge */}
                <div>
                  <div className="flex items-start gap-2.5 flex-wrap">
                    <h1
                      className="text-[28px] sm:text-[34px] font-bold text-[#1a1a1a] leading-tight"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {vendor.businessName}
                    </h1>
                    <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300/70 text-amber-800 text-[9px] font-bold uppercase tracking-wider shrink-0">
                      <svg className="w-2.5 h-2.5 fill-current text-amber-600" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Vendor
                    </span>
                  </div>

                  {/* specialty line */}
                  <p className="text-[12px] text-gray-500 mt-1">{specialty}</p>
                </div>

                {/* location + rating */}
                <div className="flex items-center gap-3 flex-wrap text-[12px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <span>📍</span>
                    {vendor.location?.city || 'Hyderabad'}, {vendor.location?.state || 'Telangana'}
                  </span>
                  <span className="text-gray-200">|</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#1a1a1a] text-[13px]">{vendor.rating || 4.8}</span>
                    <StarRating rating={vendor.rating || 4.8} size="sm" />
                    <span className="text-gray-400">({vendor.totalReviews || reviews.length || 256} Reviews)</span>
                  </div>
                </div>

                {/* description */}
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  {vendor.shortDescription || vendor.description
                    || `Creating elegant, personalised event environments through bespoke décor, floral styling, and immersive visual experiences globally.`}
                </p>

                {/* 4 stats */}
                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                  {stats.map(s => (
                    <div key={s.label} className="text-center">
                      <span
                        className="block font-bold text-[22px] text-[#1a1a1a] leading-none"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >{s.val}</span>
                      <span className="block text-[9px] text-gray-400 uppercase tracking-wider mt-1 leading-tight whitespace-pre-line font-medium">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: cover image with buttons */}
              <div className="lg:w-[380px] shrink-0 relative rounded-xl overflow-hidden" style={{ minHeight: 220 }}>
                <img
                  src={cover}
                  alt={vendor.businessName}
                  className="w-full h-full object-cover"
                  style={{ minHeight: 220 }}
                />
                {/* gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* WhatsApp + Enquire buttons */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2.5 z-10">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-white hover:bg-gray-50 text-[#1a1a1a] rounded-full px-4 py-2 text-[12px] font-semibold shadow-lg border border-gray-200 transition-all"
                  >
                    <WaIcon cls="w-3.5 h-3.5 text-[#25D366]" />
                    WhatsApp
                  </a>
                  <button
                    onClick={() => { setEnquiryPkg(null); setEnquiryOpen(true); }}
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-full px-5 py-2 text-[12px] font-bold shadow-lg transition-all cursor-pointer"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. MOMENTSHUB VERIFICATION ──────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3
            className="text-[13px] font-bold text-[#1a1a1a] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            MomentsHub Verification
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* 6 icon tiles */}
            <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {[
                { icon: '🏢', label: 'Business\nVerified' },
                { icon: '📋', label: 'Portfolio\nReviewed' },
                { icon: '📞', label: 'Contact\nVerified' },
                { icon: '📑', label: 'Information\nVerified' },
                { icon: '⭐', label: 'Reviews\nVerified' },
                { icon: '📜', label: 'Terms &\nPolicies\nAccepted' },
              ].map((v, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-[#f9f6f1] border border-gray-100 flex flex-col items-center gap-1">
                  <span className="text-[20px] leading-none">{v.icon}</span>
                  <span className="text-[9px] text-gray-600 font-medium leading-tight whitespace-pre-line">{v.label}</span>
                </div>
              ))}
            </div>

            {/* Verified shield */}
            <div className="sm:w-[200px] shrink-0 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[15px] shrink-0">✓</div>
              <div>
                <h4 className="text-[11px] font-bold text-amber-900">MomentsHub Verified</h4>
                <p className="text-[10px] text-amber-800/80 leading-relaxed mt-0.5">
                  We've verified this vendor. Verification does not guarantee quality or availability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 3. PORTFOLIO ────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          {/* header */}
          <div className="flex items-center justify-between">
            <h3
              className="text-[15px] font-bold text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Portfolio
            </h3>
            <button
              onClick={() => { setLightboxIdx(0); setLightboxOpen(true); }}
              className="text-[12px] text-amber-700 font-semibold hover:underline cursor-pointer"
            >
              View All Photos →
            </button>
          </div>

          {/* tab pills */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {portCats.map(cat => (
              <button
                key={cat}
                onClick={() => setPortfolioTab(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  portfolioTab === cat
                    ? 'bg-[#1a1a1a] text-white shadow-sm'
                    : 'bg-[#f9f6f1] border border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* image grid  –  first image large (spans 2 rows), rest fill right side */}
          <div className="grid grid-cols-3 gap-2.5" style={{ gridAutoRows: '160px' }}>
            {filtered.slice(0, 5).map((img, idx) => (
              <div
                key={img.id || idx}
                onClick={() => { setLightboxIdx(idx); setLightboxOpen(true); }}
                className={`relative rounded-xl overflow-hidden cursor-pointer group border border-gray-100 shadow-sm ${
                  idx === 0 ? 'col-span-2 row-span-2' : ''
                }`}
                style={idx === 0 ? { gridRow: 'span 2' } : {}}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-[10px] font-semibold">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 4. FEATURED EVENTS + PACKAGES ──────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Featured Events (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[14px] font-bold text-[#1a1a1a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Featured Events
              </h3>
              <span className="text-[11px] text-amber-700 font-semibold cursor-pointer">View All →</span>
            </div>

            {/* event card */}
            <div className="flex-1 rounded-xl overflow-hidden border border-gray-100 bg-[#f9f6f1] flex flex-col">
              <div className="relative h-40 shrink-0">
                <img src={feat.image} alt={feat.title} className="w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 bg-black/60 text-white backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase">
                  {feat.eventType}
                </span>
              </div>
              <div className="p-4 flex flex-col gap-2 flex-1">
                <h4
                  className="font-bold text-[14px] text-[#1a1a1a]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >{feat.title}</h4>

                <div className="flex items-center gap-2 text-[11px] text-gray-500 flex-wrap">
                  <span>📍 {feat.location}</span>
                  <span>•</span>
                  <span>👥 {feat.guestCount} Guests</span>
                </div>
                {feat.theme && <p className="text-[11px] text-gray-500">{feat.theme}</p>}

                <div className="border-t border-gray-200 pt-2 mt-auto">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Services Provided</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(feat.tags || feat.serviceTags || []).map((t, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-600">{t}</span>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 mt-1">
                  Budget Range: <span className="font-bold text-[#1a1a1a]">{feat.budget || feat.packageSummary}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Packages (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[14px] font-bold text-[#1a1a1a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Packages
              </h3>
              <span className="text-[9px] bg-amber-50 border border-amber-300/60 text-amber-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Most Popular
              </span>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3">
              {packages.map(pkg => (
                <div
                  key={pkg.id}
                  className={`relative rounded-xl p-3.5 border flex flex-col justify-between ${
                    pkg.isPopular
                      ? 'border-amber-400 bg-amber-50/20 shadow-md'
                      : 'border-gray-200 bg-[#f9f6f1]'
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-2.5 inset-x-0 flex justify-center">
                      <span className="bg-amber-600 text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div>
                    <h4
                      className="font-bold text-[13px] text-[#1a1a1a] mb-0.5"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >{pkg.name}</h4>
                    <span className="text-[11px] font-bold text-amber-700 block mb-2.5">{pkg.priceLabel}</span>
                    <ul className="space-y-1.5 mb-3">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[10px] text-gray-600">
                          <span className="text-emerald-500 font-bold shrink-0 mt-px">✓</span>
                          <span className="line-clamp-2">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => { setEnquiryPkg(pkg); setEnquiryOpen(true); }}
                    className={`w-full py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                      pkg.isPopular
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : pkg.name === 'Bespoke'
                        ? 'bg-[#1a1a1a] hover:bg-black text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-[#1a1a1a]'
                    }`}
                  >
                    {pkg.name === 'Bespoke' ? 'Request Quote' : 'View Details'}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-gray-400 mt-3 text-center">
              Prices are indicative and may vary based on requirements.
            </p>
          </div>
        </div>

        {/* ─── 5. ABOUT + CONTACT ──────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* tab bar */}
          <div className="flex border-b border-gray-200 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {['About', 'Pricing', 'Gallery', 'Service Area', `Reviews (${reviews.length || 126})`, 'Policies', 'FAQs'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                  activeTab === tab
                    ? 'border-[#1a1a1a] text-[#1a1a1a]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* body: about left + contact right */}
          <div className="grid md:grid-cols-12 gap-6 p-5 sm:p-6">

            {/* About (8 cols) */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <h4
                  className="text-[16px] font-bold text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  About {vendor.businessName}
                </h4>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  {vendor.description
                    || `${vendor.businessName} has been creating customised event environments for more than 8 years. From intimate gatherings to grand celebrations, our team specialises in transforming ideas into breathtaking experiences with meticulous precision and passion.`}
                </p>
              </div>

              {/* feature pills */}
              <div className="flex flex-wrap gap-2">
                {['🎨 Custom Concepts', '💎 Premium Quality', '⏱ On-time Delivery', '👥 Experienced Team'].map(p => (
                  <span key={p} className="px-3 py-1.5 rounded-full bg-[#f9f6f1] border border-gray-200 text-[11px] font-medium text-gray-700">{p}</span>
                ))}
              </div>

              {/* what makes them special + video */}
              <div className="grid sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 items-start">
                <div>
                  <h5 className="text-[10px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2.5">What Makes Them Special?</h5>
                  <ul className="space-y-2">
                    {[
                      'Unique & personalised décor concepts',
                      'High quality floral & premium materials',
                      'Experienced & creative design team',
                      'On-time execution with attention to detail',
                      'Pan India & destination event expertise',
                    ].map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-gray-600">
                        <span className="text-amber-500 font-bold mt-0.5 shrink-0">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* video thumb */}
                <div
                  onClick={() => setVideoOpen(true)}
                  className="relative h-36 rounded-xl overflow-hidden border border-gray-200 cursor-pointer group shadow-sm"
                >
                  <img src={cover} alt="Showreel" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">▶</div>
                    <span className="font-bold text-[12px]">Watch Our Work</span>
                    <span className="text-[10px] text-white/70 mt-0.5">See how we transform spaces.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact (4 cols) */}
            <div className="md:col-span-4 bg-[#f9f6f1] rounded-xl border border-gray-100 p-4 space-y-2.5">
              <h4
                className="text-[13px] font-bold text-[#1a1a1a] pb-2 border-b border-gray-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Contact Vendor
              </h4>

              {[
                { icon: '💬', label: 'Chat on WhatsApp', sub: 'Usually replies within 2 hrs', href: waUrl, action: null },
                { icon: '📞', label: 'Request a Callback', sub: 'Share your number', href: null, action: () => { setEnquiryPkg(null); setEnquiryOpen(true); } },
                { icon: '✉',  label: 'Email', sub: vendor.contactInfo?.email || 'hello@aavanisharts.com', href: `mailto:${vendor.contactInfo?.email || ''}`, action: null },
                { icon: '🌐', label: 'Website', sub: vendor.contactInfo?.website || 'www.aavanisharts.com', href: vendor.contactInfo?.website ? `https://${vendor.contactInfo.website}` : '#', action: null },
                { icon: '📸', label: 'Instagram', sub: `@${(vendor.businessName || 'aavanisharts').toLowerCase().replace(/\s+/g, '')}`, href: '#', action: null },
              ].map((row, i) => {
                const inner = (
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200 hover:border-amber-400 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[17px] shrink-0">{row.icon}</span>
                      <div className="min-w-0">
                        <span className="block text-[12px] font-semibold text-[#1a1a1a]">{row.label}</span>
                        <span className="block text-[10px] text-gray-400 truncate">{row.sub}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 font-bold shrink-0 ml-2">›</span>
                  </div>
                );
                if (row.action) return <button key={i} onClick={row.action} className="w-full text-left cursor-pointer">{inner}</button>;
                if (row.href) return <a key={i} href={row.href} target="_blank" rel="noreferrer">{inner}</a>;
                return <div key={i}>{inner}</div>;
              })}
            </div>
          </div>
        </div>

        {/* ─── 6. REVIEWS + DISCLAIMER ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Client Reviews (7 cols) */}
          <div className="md:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h3
              className="text-[14px] font-bold text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Client Reviews
            </h3>

            {/* rating summary */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-gray-100">
              {/* big number */}
              <div className="col-span-5 flex flex-col items-center justify-center text-center">
                <span
                  className="font-bold text-[40px] leading-none text-[#1a1a1a]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {vendor.rating || 4.8}
                </span>
                <span className="text-[12px] text-gray-400 font-medium">/ 5</span>
                <div className="my-1.5"><StarRating rating={vendor.rating || 4.8} size="md" /></div>
                <span className="text-[10px] text-gray-400">{vendor.totalReviews || 126} Verified Reviews</span>
              </div>

              {/* bars */}
              <div className="col-span-7 space-y-1.5 text-[11px]">
                {[
                  { star: '5 ★', pct: 82 },
                  { star: '4 ★', pct: 14 },
                  { star: '3 ★', pct: 3 },
                  { star: '2 ★', pct: 1 },
                  { star: '1 ★', pct: 1 },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-500 w-7 shrink-0">{r.star}</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="text-gray-400 w-6 text-right shrink-0">{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* sample review */}
            <div className="p-3.5 rounded-xl bg-[#f9f6f1] border border-gray-100 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-[13px] shrink-0">A</div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[12px] text-[#1a1a1a]">Ananya Sharma</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-semibold rounded-full">✓ Verified Booking</span>
                    </div>
                    <span className="text-[10px] text-gray-400">2 weeks ago</span>
                  </div>
                </div>
                <StarRating rating={5} size="sm" />
              </div>
              <p className="text-[12px] text-gray-600 leading-relaxed">
                The décor was exactly what we discussed. The team was professional, on time and the final look was beyond our expectations. Highly recommended!
              </p>
              <div className="flex gap-2 pt-1">
                {portfolio.slice(0, 4).map((img, i) => (
                  <img key={i} src={img.url} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                ))}
              </div>
            </div>

            <div className="text-center">
              <span className="text-[12px] text-amber-700 font-semibold cursor-pointer hover:underline">View All Reviews →</span>
            </div>
          </div>

          {/* Disclaimer (5 cols) */}
          <div className="md:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between">
            <div>
              <h3
                className="text-[14px] font-bold text-[#1a1a1a] mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                MomentsHub Disclaimer
              </h3>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                MomentsHub provides a platform to discover and connect with event service providers. We only ascertain select information for vendors listed on our platform. We do not guarantee their availability, pricing, quality of services or performance. Clients are advised to review quotations, terms and policies before confirming any booking.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100 mt-4">
              <span className="text-[12px] text-amber-700 font-semibold cursor-pointer hover:underline">
                Read full Terms &amp; Conditions →
              </span>
            </div>
          </div>
        </div>

      </div>{/* /card stack */}

      {/* ═══ STICKY BOTTOM BAR ═══════════════════ */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#1a1a1a] border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* left: vendor info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <span className="font-bold text-amber-400 text-sm">
                {vendor.businessName?.substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <h4
                className="font-bold text-[13px] text-white leading-tight truncate"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >{vendor.businessName}</h4>
              <div className="flex items-center gap-2 text-[11px] text-white/60">
                <span>From <strong className="text-white">{startPrice}</strong></span>
                <span>•</span>
                <span className="text-amber-400 font-semibold">★ {vendor.rating || 4.8}</span>
                <span className="text-white/40 hidden sm:inline">({vendor.totalReviews || 126})</span>
              </div>
            </div>
          </div>

          {/* right: actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full text-[12px] font-bold shadow-md transition-all"
            >
              <WaIcon cls="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <button
              onClick={() => { setEnquiryPkg(null); setEnquiryOpen(true); }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-[12px] font-bold shadow-md transition-all cursor-pointer"
            >
              Enquire Now
            </button>
            <button
              onClick={handleWishlist}
              className={`p-2.5 rounded-full border transition-all cursor-pointer ${
                wishlisted
                  ? 'bg-amber-500 text-[#1a1a1a] border-amber-500'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
              title={wishlisted ? 'Remove from wishlist' : 'Save'}
            >
              <HeartIcon filled={wishlisted} cls="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ MODALS ═══════════════════════════════ */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        vendorName={vendor.businessName}
        defaultPackage={enquiryPkg}
      />

      <PortfolioLightbox
        images={filtered}
        initialIndex={lightboxIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {videoOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg cursor-pointer transition-all"
            >✕</button>
            <div className="aspect-video w-full">
              <iframe
                src={vendor.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title="Showreel"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
