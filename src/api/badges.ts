'use server'

import { type ApiResponse } from '@/types/Api'
import { type Badge, type UserBadge, type UserBadgeProgress } from '@/types/Badges'

/**
 * Fetches all badges from the backend.
 *
 * @returns {Promise<ApiResponse<Badge[]>>} A list of badges on success, or an error message on failure.
 * 
 * TODO: Use function to create badge directory for users to view all potential badges they can earn.
 */
export const getAllBadges = async (): Promise<ApiResponse<Badge[]>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/badges/getAll`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const badges = (await response.json()) as Badge[];
    return { errorMessage: null, data: badges };
  } catch (error) {
    console.error('Error fetching badges:', error);
    return { errorMessage: 'Error fetching badges' };
  }
}

/**
 * Fetches earned badges for a user from the backend.
 *
 * @param {string} userId - The UUID of the user whose badges are to be retrieved.
 * @returns {Promise<ApiResponse<UserBadge[]>>} A list of earned badges on success, or an error message on failure.
 */
export const getUserBadges = async (userId: string): Promise<ApiResponse<UserBadge[]>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/badges/getUserBadges/${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Fetch Response:', response);

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error('Error response body:', errorResponse);
      throw new Error('Network response was not ok');
    }

    const badges = (await response.json()) as UserBadge[];
    return { errorMessage: null, data: badges };
  } catch (error) {
    console.error('Error getting user badges:', error);
    return { errorMessage: 'Error fetching user badges', data: [] };
  }
};

/**
 * Fetches badge progress for a user from the backend.
 *
 * @param {string} userId - The UUID of the user whose badge progress is to be retrieved.
 * @returns {Promise<ApiResponse<UserBadgeProgress[]>>} A list of badge progress entries on success, or an error message on failure.
 */
export const getUserBadgeProgress = async (userId: string): Promise<ApiResponse<UserBadgeProgress[]>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/badges/getUserProgress/${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const progressData = (await response.json()) as UserBadgeProgress[];
    return { errorMessage: null, data: progressData };
  } catch (error) {
    console.error('Error fetching user badge progress:', error);
    return { errorMessage: 'Error fetching badge progress' };
  }
}