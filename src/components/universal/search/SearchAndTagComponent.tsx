'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { MultiSelector } from '@/components/ui/MultiSelector'
import { type TagOption } from '@/types/Tags'

interface SearchAndTagComponentProps {
  tags: TagOption[];
  selectedTags: TagOption[];
  onSearchChange: (query: string) => void;
  onTagChange: (selected: TagOption[]) => void;
  onClearFilters: () => void;
  searchQuery: string;
  sortOptions: { label: string; value: string }[];
  onSortChange: (sortOption: string) => void;
}


export const SearchAndTagComponent: React.FC<SearchAndTagComponentProps> = ({
  tags,
  selectedTags,
  onSearchChange,
  onTagChange,
  onClearFilters,
  searchQuery,
  sortOptions,
  onSortChange,
}) => {
  return (
    <aside className="flex flex-col min-w-[250px] max-w-xs md:basis-1/4">
      <div className="rounded-lg border bg-card p-4 pb-10">
        <h2 className="mb-4 text-p1 font-subHeading">Search and Filter</h2>
        <div className="mb-4">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full pr-10"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-500" />
          </div>
        </div>
        <MultiSelector
          options={tags}
          selected={selectedTags}
          onSelectedChange={onTagChange}
          placeholder="Tags"
        />
        <div className="mt-4">
        <MultiSelector
          options={sortOptions} // Pass sortOptions
          selected={[]} // No pre-selected sort
          onSelectedChange={(selected) => {
            onSortChange(selected[0]?.value || ""); // Trigger sort change
          }}
          placeholder="Sort by" // Unique placeholder for sort dropdown
          singleSelect={true} // Ensure single select
        />
        </div>
        {(selectedTags.length > 0 || searchQuery.trim()) && (
          <button
            onClick={onClearFilters}
            className="mt-4 w-full rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            Clear Filters
          </button>
        )}
      </div>
    </aside>
  )
}
