"use client";

import React from "react";
import { MultiSelector } from "@/components/ui/MultiSelector";
import { type TagOption } from "@/types/Tags";

interface SearchAndTagComponentProps {
  tags: TagOption[];
  selectedTags: TagOption[];
  onSearchChange: (query: string) => void;
  onTagChange: (selected: TagOption[]) => void;
  onClearFilters: () => void;
  searchQuery: string;
  sortOptions?: { label: string; value: string }[]; // Optional
  selectedSort?: string;
  onSortChange?: (sortOption: string) => void;
  showSortOptions?: boolean; // New prop to toggle the sort dropdown
}

export const SearchAndTagComponent: React.FC<SearchAndTagComponentProps> = ({
  tags,
  selectedTags,
  onSearchChange,
  onTagChange,
  onClearFilters,
  searchQuery,
  sortOptions = [],
  selectedSort,
  onSortChange,
  showSortOptions = true, // Default to true
}) => {
  return (
    <aside className="flex flex-col min-w-[250px] max-w-xs md:basis-1/4">
      <div className="rounded-lg border bg-card p-4 pb-10">
        <h2 className="mb-4 text-p1 font-subHeading">Search and Filter</h2>
        <div className="mb-4">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              className="w-full rounded border px-3 py-2"
            />
          </div>
        </div>
        <MultiSelector
          options={tags}
          selected={selectedTags}
          onSelectedChange={onTagChange}
          placeholder="Tags"
        />
        {showSortOptions && sortOptions && onSortChange && (
          <MultiSelector
            options={sortOptions}
            selected={
              selectedSort
                ? [{ label: selectedSort, value: selectedSort }]
                : []
            }
            onSelectedChange={(selected) =>
              onSortChange(selected[0]?.value || "")
            }
            singleSelect={true}
            placeholder="Sort by..."
          />
        )}
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
  );
};
