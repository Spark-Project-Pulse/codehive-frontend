import type { NextApiRequest, NextApiResponse } from 'next';
import { type Question } from '@/types/Questions';

// Define the response structure
interface SearchResponse {
  results: Question[];
}

// Define possible error responses
interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | ErrorResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract the search query from the query parameters
  const { q } = req.query;

  // Validate the search query
  if (!q || typeof q !== 'string' || q.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing search query parameter "q".' });
  }

  try {
    // Make a request to the backend API's search endpoint
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions/search/?q=${encodeURIComponent(q)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Check if the backend response is OK
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend Error: ${backendResponse.status} - ${errorText}`);
    }

    // Parse the JSON response from the backend with a defined type
    const data = (await backendResponse.json()) as SearchResponse;

    // Return the search results
    return res.status(200).json(data);
  } catch (error) {
    // Type guard for error messages
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Search API Error:', errorMessage);

    return res.status(500).json({ error: errorMessage });
  }
}
