import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVendors } from '../api/vendors';
import VendorCard from '../components/vendors/VendorCard';
import Loader from '../components/ui/Loader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { VENDOR_CATEGORIES } from '../constants/categories';

export default function Vendors({ defaultCategory }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || defaultCategory || '';
  const locationCity = searchParams.get('location.city') || '';
  const minRating = searchParams.get('rating[gte]') || '';
  const minPrice = searchParams.get('priceRange.min[gte]') || '';
  const maxPrice = searchParams.get('priceRange.min[lte]') || '';
  const sort = searchParams.get('sort') || 'recommended';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [filterState, setFilterState] = useState({
    keyword,
    category,
    locationCity,
    minRating,
    minPrice,
    maxPrice,
    sort,
  });

  // Sync local state when URL params change
  useEffect(() => {
    setFilterState({
      keyword: searchParams.get('keyword') || '',
      category: searchParams.get('category') || '',
      locationCity: searchParams.get('location.city') || '',
      minRating: searchParams.get('rating[gte]') || '',
      minPrice: searchParams.get('priceRange.min[gte]') || '',
      maxPrice: searchParams.get('priceRange.min[lte]') || '',
      sort: searchParams.get('sort') || 'recommended',
    });
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 6 }; // 6 per page initially for desktop as requested in section 14
    if (category) params.category = category;
    if (keyword) params.keyword = keyword;
    if (locationCity) params['location.city'] = locationCity;
    if (minRating) params['rating[gte]'] = minRating;
    if (minPrice) params['priceRange.min[gte]'] = minPrice;
    if (maxPrice) params['priceRange.min[lte]'] = maxPrice;
    if (sort) params.sort = sort;

    getVendors(params)
      .then(({ data }) => {
        setVendors(data.vendors || []);
        setTotal(data.total || 0);
        setError('');
      })
      .catch(() => setError('Unable to load curated artisans.'))
      .finally(() => setLoading(false));
  }, [category, keyword, locationCity, minRating, minPrice, maxPrice, sort, page]);

  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (filterState.keyword) params.set('keyword', filterState.keyword);
    if (filterState.category) params.set('category', filterState.category);
    if (filterState.locationCity) params.set('location.city', filterState.locationCity);
    if (filterState.minRating) params.set('rating[gte]', filterState.minRating);
    if (filterState.minPrice) params.set('priceRange.min[gte]', filterState.minPrice);
    if (filterState.maxPrice) params.set('priceRange.min[lte]', filterState.maxPrice);
    if (filterState.sort) params.set('sort', filterState.sort);
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const setCategory = (cat) => {
    setFilterState((prev) => ({ ...prev, category: cat }));
    const params = new URLSearchParams(searchParams);
    if (cat) params.set('category', cat);
    else params.delete('category');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (newSort) => {
    setFilterState((prev) => ({ ...prev, sort: newSort }));
    const params = new URLSearchParams(searchParams);
    if (newSort) params.set('sort', newSort);
    else params.delete('sort');
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (filterState.keyword) params.set('keyword', filterState.keyword);
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / 6);
  const activeFiltersCount = [locationCity, minRating, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="bg-warm-white min-h-screen pb-32">
      {/* HERO SECTION */}
      <section className="pt-36 md:pt-44 pb-16 px-6 lg:px-8 border-b border-gray-200/60 bg-gradient-to-b from-warm-white to-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-champagne-gold block mb-3">
              Moments Group Directory
            </span>
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl mb-4 text-matte-black tracking-tight">
              Curated Artisans
            </h1>
            <p className="text-gray-500 font-light tracking-wide text-base sm:text-lg leading-relaxed">
              A meticulously vetted selection of world-class vendors, dedicated to crafting unparalleled experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
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
                className="w-full bg-transparent border-b border-matte-black/30 pb-3 pt-4 px-2 text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light placeholder:text-gray-400 text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-3 text-xs uppercase tracking-widest font-semibold text-matte-black hover:text-champagne-gold transition-colors cursor-pointer"
              >
                EXPLORE
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* FILTER SIDEBAR */}
            <aside className="lg:w-64 shrink-0 space-y-10">
              {/* FILTER BY CRAFT */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400 mb-6">
                  FILTER BY CRAFT
                </h3>
                <div className="flex flex-col space-y-2.5">
                  <button
                    onClick={() => setCategory('')}
                    className={`text-left text-sm tracking-wide transition-all duration-300 py-1 cursor-pointer ${
                      !category
                        ? 'text-champagne-gold font-medium pl-4 border-l-2 border-champagne-gold'
                        : 'text-gray-600 hover:text-matte-black hover:pl-2'
                    }`}
                  >
                    All Artisans
                  </button>
                  {VENDOR_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`text-left text-sm tracking-wide transition-all duration-300 py-1 cursor-pointer ${
                        category === cat
                          ? 'text-champagne-gold font-medium pl-4 border-l-2 border-champagne-gold'
                          : 'text-gray-600 hover:text-matte-black hover:pl-2'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* REFINED SEARCH */}
              <form onSubmit={applyFilters} className="space-y-6 border-t border-gray-200/80 pt-8">
                <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400">
                  REFINE SEARCH
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Location (City)</label>
                    <Input
                      placeholder="e.g. Mumbai"
                      value={filterState.locationCity}
                      onChange={(e) => setFilterState({ ...filterState, locationCity: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Minimum Rating</label>
                    <select
                      value={filterState.minRating}
                      onChange={(e) => setFilterState({ ...filterState, minRating: e.target.value })}
                      className="w-full bg-transparent border-b border-gray-200 pb-2 pt-2 px-0 text-sm text-matte-black focus:outline-none focus:border-champagne-gold transition-colors font-light cursor-pointer"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.9">4.9+</option>
                      <option value="4.8">4.8+</option>
                      <option value="4.7">4.7+</option>
                      <option value="4.5">4.5+</option>
                      <option value="4.0">4.0+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Base Price (₹)</label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Min"
                        type="number"
                        value={filterState.minPrice}
                        onChange={(e) => setFilterState({ ...filterState, minPrice: e.target.value })}
                      />
                      <span className="text-gray-400 text-xs">-</span>
                      <Input
                        placeholder="Max"
                        type="number"
                        value={filterState.maxPrice}
                        onChange={(e) => setFilterState({ ...filterState, maxPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full text-xs py-3 uppercase tracking-wider">
                  Apply Filters
                </Button>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors mt-2 block uppercase tracking-widest cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </form>
            </aside>

            {/* VENDOR RESULTS AREA */}
            <div className="flex-1">
              {/* RESULTS BAR & SORT */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-200/60">
                <span className="text-sm font-light text-gray-600 tracking-wide">
                  <span className="font-semibold text-matte-black">{total}</span>{' '}
                  {category ? `${category} Artisans` : 'Artisans'} Found
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Sort:</span>
                  <select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-transparent text-xs uppercase tracking-wider text-matte-black font-semibold border-b border-gray-300 pb-1 focus:outline-none focus:border-champagne-gold cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest Rated</option>
                    <option value="reviews">Most Reviewed</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-4 mb-8 bg-red-50 text-red-600 rounded-xl text-sm">{error}</div>
              )}

              {loading ? (
                <Loader className="py-32" />
              ) : vendors.length === 0 ? (
                <div className="py-24 text-center glass-panel rounded-3xl p-12 border border-gray-100 max-w-lg mx-auto">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="font-display text-2xl mb-2 text-matte-black">No artisans found</h3>
                  <p className="text-sm text-gray-500 font-light mb-6">
                    Try adjusting your filters or search for another category.
                  </p>
                  <Button
                    onClick={() => {
                      setFilterState({ keyword: '', category: '', locationCity: '', minRating: '', minPrice: '', maxPrice: '', sort: 'recommended' });
                      setSearchParams(new URLSearchParams());
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {vendors.map((v, i) => (
                    <VendorCard key={v._id || v.id} vendor={v} index={i} />
                  ))}
                </div>
              )}

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-gray-100">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(page - 1));
                      setSearchParams(params);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-xs font-semibold uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 text-matte-black cursor-pointer"
                  >
                    «
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', String(p));
                        setSearchParams(params);
                      }}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                        p === page
                          ? 'bg-matte-black text-champagne-gold shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={page >= totalPages}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.set('page', String(page + 1));
                      setSearchParams(params);
                    }}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-xs font-semibold uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 text-matte-black cursor-pointer"
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
