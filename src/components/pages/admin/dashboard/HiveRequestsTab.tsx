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
import { type Hive } from '@/types/Hives'
import {
  approveHiveRequest,
  getAllHiveRequests,
  rejectHiveRequest,
} from '@/api/hives'
import { Skeleton } from '@/components/ui/skeleton'
import { type UUID } from 'crypto'
import { toast } from '@/components/ui/use-toast'
import Image from 'next/image'
import { Avatar, AvatarImage } from '@/components/ui/avatar'

export default function HiveRequestsTab() {
  // State for hive requests fetched from the API
  const [hiveRequests, setHiveRequests] = useState<Hive[]>([])
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch hive requests data from the server
  useEffect(() => {
    const fetchHives = async () => {
      try {
        setIsLoading(true) // Start loading

        // Fetch hive requests
        const response = await getAllHiveRequests()

        if (response.errorMessage) {
          throw new Error(response.errorMessage) // Handle error from response
        }

        // Update state if data is received
        if (response.data) {
          setHiveRequests(response.data)
        }
      } catch (error) {
        console.error('Error fetching hive requests:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchHives()
  }, [])

  const handleApproveHiveRequest = (hiveId: UUID) => async () => {
    try {
      // Make API request to approve hive request
      const response = await approveHiveRequest(hiveId)

      if (response.errorMessage) {
        throw new Error(response.errorMessage)
      }

      // Update state to remove the approved hive request
      setHiveRequests((prevRequests) =>
        prevRequests.filter((request) => request.hive_id !== hiveId)
      )

      toast({
        title: 'Success!',
        description: 'The hive request has been approved successfully.',
      })
    } catch (error) {
      console.error('Error approving hive request:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve the hive request.',
      })
    }
  }

  const handleRejectHiveRequest = (hiveId: UUID) => async () => {
    try {
      // Make API request to approve hive request
      const response = await rejectHiveRequest(hiveId)

      if (response.errorMessage) {
        throw new Error(response.errorMessage)
      }

      // Update state to remove the approved hive request
      setHiveRequests((prevRequests) =>
        prevRequests.filter((request) => request.hive_id !== hiveId)
      )

      toast({
        title: 'Success!',
        description: 'The hive request has been rejected successfully.',
      })
    } catch (error) {
      console.error('Error approving hive request:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject the hive request.',
      })
    }
  }

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold">Hive Requests</h2>
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
            : hiveRequests.map((request) => (
                <TableRow key={request.hive_id}>
                  <TableCell className="max-w-md break-words">
                    {request.owner_info?.username}
                  </TableCell>
                  <TableCell>
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={request.avatar_url ?? '/default-hive-avatar.png'}
                      alt={request.title || 'Hive avatar'}
                    />
                  </Avatar>
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
                        onClick={handleApproveHiveRequest(
                          request.hive_id
                        )}
                      >
                        <CheckCircle className="mr-1" size={16} />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={handleRejectHiveRequest(
                          request.hive_id
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
