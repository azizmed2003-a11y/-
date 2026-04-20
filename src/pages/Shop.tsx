import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import BookCard from '../components/BookCard';
import { Search, SlidersHorizontal, Grid, List as ListIcon } from 'lucide-react';
import { Category } from '../types';
import { useAdmin } from '../context/AdminContext';

export default function Shop() {
  const { books } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const selectedCategory = searchParams.get('category') || 'All';

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      if (!book.isVisible) return false;
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      const matchesSearch = book.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           book.author?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, books]);

  return (
    <div className="container mx-auto px-4 md:px-10 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-[220px] shrink-0">
          <div className="sidebar-title text-[12px] uppercase tracking-[1px] text-[#999] mb-4 font-semibold text-right">تصفح الأقسام</div>
          <div className="flex flex-col text-right">
            <button
              onClick={() => setSearchParams({ category: 'All' })}
              className={`py-2 text-[15px] border-b border-[#f0f0f0] transition-colors flex justify-between items-center ${
                selectedCategory === 'All' ? 'text-brand-accent-brown font-bold' : 'text-[#444] hover:text-brand-accent-brown'
              }`}
            >
              <span>جميع الكتب</span>
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSearchParams({ category: cat.id })}
                className={`py-2 text-[15px] border-b border-[#f0f0f0] transition-colors flex justify-between items-center ${
                  selectedCategory === cat.id ? 'text-brand-accent-brown font-bold' : 'text-[#444] hover:text-brand-accent-brown'
                }`}
              >
                <span>{cat.labelAr}</span>
                <span className="text-[11px] opacity-40">({books.filter(b => b.category === cat.id && b.isVisible).length})</span>
              </button>
            ))}
          </div>

          <div className="mt-12">
            <div className="sidebar-title text-[12px] uppercase tracking-[1px] text-[#999] mb-4 font-semibold">السعر</div>
            <input type="range" className="w-full accent-brand-accent-brown h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" min="0" max="100" />
            <div className="flex justify-between text-[11px] text-[#999] mt-2 font-bold uppercase tracking-wider">
              <span>$0</span>
              <span>$100</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-[#eee] flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ابحث عن كتاب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#f9f8f4] border border-[#eee] rounded-md py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent-brown"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-100">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>Show:</span>
                <select className="bg-transparent font-bold text-gray-900 outline-none">
                  <option>12 Items</option>
                  <option>24 Items</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredBooks.map(book => (
              viewMode === 'grid' ? (
                <BookCard key={book.id} book={book} />
              ) : (
                <div key={book.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-6 hover:shadow-lg transition-shadow">
                  <img src={book.image} className="w-32 h-44 object-cover rounded-xl" referrerPolicy="no-referrer" />
                  <div className="flex-1 py-2">
                    <span className="text-[10px] text-orange-500 font-bold uppercase">{book.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-1">{book.name}</h3>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{book.description}</p>
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-2xl font-black text-gray-900">${book.salePrice || book.price}</span>
                      {book.salePrice && <span className="text-gray-400 line-through">${book.price}</span>}
                    </div>
                  </div>
                </div>
              )
            ))}

            {filteredBooks.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900">No books found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
