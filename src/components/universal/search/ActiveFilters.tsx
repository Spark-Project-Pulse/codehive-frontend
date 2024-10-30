'use client'

import React from 'react'
import { type TagOption } from '@/types/Tags'

interface ActiveFiltersProps {
  selectedTags: TagOption[]
  searchQuery: string
  onRemoveTag: (tagValue: string) => void
  onClearSearchQuery: () => void
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedTags,
  searchQuery,
  onRemoveTag,
  onClearSearchQuery,
}) => {
  return (
    <div className="mb-4">
      <p className="text-lg font-medium">Active Filters:</p>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map((tag) => (
          <span
            key={tag.value}
            className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center"
          >
            {tag.label}
            <button
              onClick={() => onRemoveTag(tag.value)}
              className="ml-1 text-indigo-700 hover:text-indigo-900 focus:outline-none"
            >
              &times;
            </button>
          </span>
        ))}
        {searchQuery.trim() && (
          <span
            className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center"
          >
            {searchQuery}
            <button
              onClick={onClearSearchQuery}
              className="ml-1 text-indigo-700 hover:text-indigo-900 focus:outline-none"
            >
              &times;
            </button>
          </span>
        )}
      </div>
    </div>
  )
}
