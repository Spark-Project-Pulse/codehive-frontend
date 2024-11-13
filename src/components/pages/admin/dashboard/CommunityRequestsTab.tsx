'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { type Community } from '@/types/Communities'
import {
  approveCommunityRequest,
  getAllCommunityRequests,
  rejectCommunityRequest,
} from '@/api/communities'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { UUID } from 'crypto'
import { toast } from '@/components/ui/use-toast'

export default function CommunityRequestsTab() {
  // State for community requests fetched from the API
  const [communityRequests, setCommunityRequests] = useState<Community[]>([])
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch community requests data from the server
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true) // Start loading

        // Fetch communitiy requests
        const response = await getAllCommunityRequests()

        if (response.errorMessage) {
          throw new Error(response.errorMessage) // Handle error from response
        }

        // Update state if data is received
        if (response.data) {
          setCommunityRequests(response.data)
        }
      } catch (error) {
        console.error('Error fetching community requests:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchCommunities()
  }, [])

  const handleApproveCommunityRequest = (communityId: UUID) => async () => {
    try {
      // Make API request to approve community request
      const response = await approveCommunityRequest(communityId)

      if (response.errorMessage) {
        throw new Error(response.errorMessage)
      }

      // Update state to remove the approved community request
      setCommunityRequests((prevRequests) =>
        prevRequests.filter((request) => request.community_id !== communityId)
      )

      toast({
        title: 'Success!',
        description: 'The community request has been approved successfully.',
      })
    } catch (error) {
      console.error('Error approving community request:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve the community request.',
      })
    }
  }

  const handleRejectCommunityRequest = (communityId: UUID) => async () => {
    try {
      // Make API request to approve community request
      const response = await rejectCommunityRequest(communityId)

      if (response.errorMessage) {
        throw new Error(response.errorMessage)
      }

      // Update state to remove the approved community request
      setCommunityRequests((prevRequests) =>
        prevRequests.filter((request) => request.community_id !== communityId)
      )

      toast({
        title: 'Success!',
        description: 'The community request has been rejected successfully.',
      })
    } catch (error) {
      console.error('Error approving community request:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject the community request.',
      })
    }
  }

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">Community Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Avatar</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="max-w-md">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </TableCell>
                  <TableCell className="max-w-md">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="max-w-md">
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : communityRequests.map((request) => (
                <TableRow key={request.community_id}>
                  <TableCell className="max-w-md break-words">
                    {request.owner_info?.username}
                  </TableCell>
                  <TableCell>
                    <Image
                      src={
                        request.avatar_url ?? '/default-community-avatar.png'
                      }
                      alt="Community avatar"
                      width={48}
                      height={48}
                    />
                  </TableCell>
                  <TableCell className="max-w-md break-words">
                    {request.title}
                  </TableCell>
                  <TableCell className="max-w-md break-words">
                    {request.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={handleApproveCommunityRequest(
                          request.community_id
                        )}
                      >
                        <CheckCircle className="mr-1" size={16} />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={handleRejectCommunityRequest(
                          request.community_id
                        )}
                      >
                        <XCircle className="mr-1" size={16} />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  )
}
