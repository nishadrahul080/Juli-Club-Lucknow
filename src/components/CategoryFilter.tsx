import React from 'react';
import { CategoryType, LucknowArea } from '../types';
import { LUCKNOW_AREAS } from '../data/mockData';
import { Filter, MapPin, Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  selectedArea: LucknowArea;
  onSelectArea: (area: LucknowArea) => void;
  sortBy: 'popular' | 'priceLow' | 'priceHigh' | 'rating';
  onSortChange: (sort: 'popular' | 'priceLow' | 'priceHigh' | 'rating') => void;
}

const CATEGORIES: CategoryType[] = [
  'All',
  'Independent',
  'College Girls',
  'Housewife',
  'Supermodels',
  'Russian / Exotic',
  'Air Hostess',
  'South Indian',
  'North Indian',
  'Asian',
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedArea,
  onSelectArea,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="bg-[#0d0d0d] border-y border-white/10 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="flex items-center gap-1 font-bold uppercase tracking-widest text-[#c5a059] shrink-0 pr-3 border-r border-white/10 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            Category Filter:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#c5a059]/20 border border-[#c5a059] text-[#c5a059] shadow-sm'
                  : 'bg-white/5 border border-white/10 text-[#e0e0e0]/70 hover:border-[#c5a059] hover:text-[#e0e0e0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Row: Area + Sort By */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {/* Lucknow Area Dropdown */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/50 font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
              Lucknow Location:
            </span>
            <select
              value={selectedArea}
              onChange={(e) => onSelectArea(e.target.value as LucknowArea)}
              className="bg-[#1a1a1a] border border-white/10 text-[#c5a059] rounded px-3 py-1.5 focus:outline-none focus:border-[#c5a059] text-xs font-medium cursor-pointer"
            >
              {LUCKNOW_AREAS.map((area) => (
                <option key={area} value={area} className="bg-[#0f0f0f] text-[#e0e0e0]">
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/50 font-bold">
              <Filter className="w-3.5 h-3.5 text-white/40" />
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(
                  e.target.value as 'popular' | 'priceLow' | 'priceHigh' | 'rating'
                )
              }
              className="bg-[#1a1a1a] border border-white/10 text-[#e0e0e0] rounded px-3 py-1.5 focus:outline-none focus:border-[#c5a059] text-xs cursor-pointer"
            >
              <option value="popular" className="bg-[#0f0f0f]">Most Popular & Recommended</option>
              <option value="rating" className="bg-[#0f0f0f]">Highest Rated (5.0★)</option>
              <option value="priceLow" className="bg-[#0f0f0f]">Rate: Low to High (₹3,999+)</option>
              <option value="priceHigh" className="bg-[#0f0f0f]">Rate: High to Low (VIP Models)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

