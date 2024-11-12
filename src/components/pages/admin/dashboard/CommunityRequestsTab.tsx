'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

// Sample communityRequests data; replace with real data source
const communityRequests = [
  { id: 1, user: 'John Doe', type: 'Join Request', description: 'Request to join community' },
  { id: 2, user: 'Jane Smith', type: 'Role Change', description: 'Request to change role to admin' },
  // Add more entries as needed
]

export default function CommunityRequestsTab() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Community Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {communityRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.user}</TableCell>
              <TableCell>{request.type}</TableCell>
              <TableCell>{request.description}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                    <CheckCircle className="mr-1" size={16} />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
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
