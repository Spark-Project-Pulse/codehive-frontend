'use server'

import { type ApiResponse, SuccessResponse } from '@/types/Api'
import { type Badge, UserBadge, UserBadgeProgress } from '@/types/Badges'
import { type UUID } from 'crypto'

/**
 * Fetches all badges from the backend.
 *
 * Returns:
 *   Promise<ApiResponse<Badge[]>>: A list of badges on success, or an error message on failure.
 */
export const getAllBadges = async (): Promise<ApiResponse<Badge[]>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/badges/getAll/`, {
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
 * Args:
 *   userId: UUID of the user whose badges are to be retrieved.
 *
 * Returns:
 *   Promise<ApiResponse<UserBadge[]>>: A list of earned badges on success, or an error message on failure.
 */
export const getUserBadges = async (userId: string): Promise<ApiResponse<Badge[]>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/badges/getUserBadges/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Fetch Response:', response); // Log the response details
  
      if (!response.ok) {
        const errorResponse = await response.text(); // Log additional error details
        console.error('Error response body:', errorResponse);
        throw new Error('Network response was not ok');
      }
  
      const badges = (await response.json()) as Badge[];
      return { errorMessage: null, data: badges };
    } catch (error) {
      console.error('Error getting user badges:', error);
      return { errorMessage: 'Error fetching user badges', data: [] };
    }
  };
  

/**
 * Fetches badge progress for a user from the backend.
 *
 * Args:
 *   userId: UUID of the user whose badge progress is to be retrieved.
 *
 * Returns:
 *   Promise<ApiResponse<UserBadgeProgress[]>>: A list of badge progress entries on success, or an error message on failure.
 */
export const getUserBadgeProgress = async (userId: UUID): Promise<ApiResponse<UserBadgeProgress[]>> => {
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

/**
 * Assigns a badge to a user.
 *
 * Args:
 *   badgeId: The ID of the badge to assign.
 *   userId: The ID of the user to whom the badge is assigned.
 *
 * Returns:
 *   Promise<ApiResponse<{ message: string }>>: Confirmation message on success, or an error message on failure.
 */
export const assignBadge = async (
  badgeId: number,
  userId: UUID
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/badges/assignBadge/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ badge_id: badgeId, user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = (await response.json()) as SuccessResponse;
    return { errorMessage: null, data: result };
  } catch (error) {
    console.error('Error assigning badge:', error);
    return { errorMessage: 'Error assigning badge' };
  }
}