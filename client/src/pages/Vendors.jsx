import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVendors } from '../api/vendors';
import VendorCard from '../components/vendors/VendorCard';
import Loader from '../components/ui/Loader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { VENDOR_CATEGORIES } from '../constants/categories';

export default function Vendors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const locationCity = searchParams.get('location.city') || '';
  const minRating = searchParams.get('rating[gte]') || '';
  const minPrice = searchParams.get('priceRange.min[gte]') || '';
  const maxPrice = searchParams.get('priceRange.min[lte]') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [filterState, setFilterState] = useState({
    keyword,
    category,
    locationCity,
    minRating,
    minPrice,
    maxPrice,
  });

  // Keep local state in sync with URL
  useEffect(() => {
    setFilterState({
      keyword: searchParams.get('keyword') || '',
      category: searchParams.get('category') || '',
      locationCity: searchParams.get('location.city') || '',
      minRating: searchParams.get('rating[gte]') || '',
      minPrice: searchParams.get('priceRange.min[gte]') || '',
      maxPrice: searchParams.get('priceRange.min[lte]') || '',
    });
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;
    if (keyword) params.keyword = keyword;
    if (locationCity) params['location.city'] = locationCity;
    if (minRating) params['rating[gte]'] = minRating;
    if (minPrice) params['priceRange.min[gte]'] = minPrice;
    if (maxPrice) params['priceRange.min[lte]'] = maxPrice;

    getVendors(params)
      .then(({ data }) => {
        setVendors(data.vendors || []);
        setTotal(data.total || 0);
        setError('');
      })
      .catch(() => setError('Unable to load vendors.'))
      .finally(() => setLoading(false));
  }, [category, keyword, locationCity, minRating, minPrice, maxPrice, page]);

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (filterState.keyword) params.set('keyword', filterState.keyword);
    if (filterState.category) params.set('category', filterState.category);
    if (filterState.locationCity) params.set('location.city', filterState.locationCity);
    if (filterState.minRating) params.set('rating[gte]', filterState.minRating);
    if (filterState.minPrice) params.set('priceRange.min[gte]', filterState.minPrice);
    if (filterState.maxPrice) params.set('priceRange.min[lte]', filterState.maxPrice);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const setCategory = (cat) => {
    setFilterState(prev => ({ ...prev, category: cat }));
    // We want category clicks to apply immediately
    const params = new URLSearchParams(searchParams);
    if (cat) params.set('category', cat);
    else params.delete('category');
    params.set('page', '1');
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="bg-warm-white min-h-screen pb-32">
      <section className="pt-40 pb-20 px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-5xl md:text-7xl mb-4 text-matte-black tracking-tight">Curated Artisans</h1>
            <p className="text-gray-500 font-light tracking-wide text-lg">
              A meticulously vetted selection of world-class vendors, dedicated to crafting unparalleled experiences.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full md:w-auto"
          >
            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search artisans..."
                value={filterState.keyword}
                onChange={(e) => setFilterState({ ...filterState, keyword: e.target.value })}
                className="w-full bg-transparent border-b border-matte-black/20 pb-2 pt-4 px-2 text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light placeholder:text-gray-400"
              />
              <button type="submit" className="absolute right-0 bottom-2 text-xs uppercase tracking-widest font-semibold text-gray-500 hover:text-champagne-gold transition-colors">
                Explore
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Minimalist Sidebar */}
            <aside className="lg:w-64 shrink-0 space-y-12">
              
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mb-6">Filter by Craft</h3>
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setCategory('')}
                    className={`text-left text-sm tracking-wide transition-all duration-300 ${!category ? 'text-champagne-gold font-medium pl-4 border-l-2 border-champagne-gold' : 'text-gray-500 hover:text-matte-black hover:pl-2'}`}
                  >
                    All Artisans
                  </button>
                  {VENDOR_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-left text-sm tracking-wide transition-all duration-300 ${category === cat ? 'text-champagne-gold font-medium pl-4 border-l-2 border-champagne-gold' : 'text-gray-500 hover:text-matte-black hover:pl-2'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={applyFilters} className="space-y-8 border-t border-gray-100 pt-8">
                <div>
                  <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mb-6">Refine Search</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Location (City)</label>
                      <Input 
                        placeholder="e.g. Mumbai" 
                        value={filterState.locationCity} 
                        onChange={(e) => setFilterState({ ...filterState, locationCity: e.target.value })} 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Minimum Rating</label>
                      <select 
                        value={filterState.minRating} 
                        onChange={(e) => setFilterState({ ...filterState, minRating: e.target.value })}
                        className="w-full bg-transparent border-b border-gray-200 pb-2 pt-2 px-0 text-sm text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light"
                      >
                        <option value="">Any Rating</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="3">3+ Stars</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-2">Base Price (₹)</label>
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Min" 
                          type="number"
                          value={filterState.minPrice} 
                          onChange={(e) => setFilterState({ ...filterState, minPrice: e.target.value })} 
                        />
                        <span className="text-gray-400">-</span>
                        <Input 
                          placeholder="Max" 
                          type="number"
                          value={filterState.maxPrice} 
                          onChange={(e) => setFilterState({ ...filterState, maxPrice: e.target.value })} 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full text-xs">Apply Filters</Button>
                
                {(locationCity || minRating || minPrice || maxPrice) && (
                  <button 
                    type="button" 
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (category) params.set('category', category);
                      if (keyword) params.set('keyword', keyword);
                      setSearchParams(params);
                    }}
                    className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors mt-4 block uppercase tracking-widest"
                  >
                    Clear Filters
                  </button>
                )}
              </form>

            </aside>

            {/* Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-100">
                <span className="text-sm font-light text-gray-500">{total} {total === 1 ? 'Artisan' : 'Artisans'} Found</span>
              </div>

              {error && (
                <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
              )}

              {loading ? (
                <Loader className="py-32" />
              ) : vendors.length === 0 ? (
                <div className="py-32 text-center text-gray-400 font-light">
                  <p className="text-2xl mb-2">No artisans found</p>
                  <p className="text-sm">Try exploring a different category or search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                  {vendors.map((v, i) => (
                    <VendorCard key={v._id} vendor={v} index={i} />
                  ))}
                </div>
              )}

              {/* Minimal Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-24">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', String(p));
                        setSearchParams(params);
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-light transition-all duration-300 ${p === page ? 'bg-matte-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
