import type { Tag, TagOption } from '@/types/Tags';

/**
 * Fetches all tags from the backend.
 *
 * @returns {Promise<TagOption[]>} An array of tag options on success, or an empty array on failure.
 * 
 */
export const getAllTags = async (): Promise<TagOption[]> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags/getAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = (await response.json()) as Tag[];

    const options: TagOption[] = data.map((tag) => ({
      value: tag.tag_id,
      label: tag.name,
    }));

    return options;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};