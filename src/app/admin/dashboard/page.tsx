'use client'

import { getCurrentUserRole } from '@/api/users'
import AccessDenied from '@/app/access-denied'
import { useUser } from '@/app/contexts/UserContext'
import CommunityRequestsTab from '@/components/pages/admin/dashboard/CommunityRequestsTab'
import AdminDashboardSkeleton from '@/components/skeletons/AdminDashboardSkeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type UserRole } from '@/types/Users'
import { CheckCircle, LayoutDashboardIcon, Settings, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const { user } = useUser()
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setIsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const fetchUserRole = async () => {
      setIsLoading(true)

      try {
        const { errorMessage, data } = await getCurrentUserRole()

        if (!errorMessage && data) {
          setRole(data)
        } else {
          console.error('Error:', errorMessage)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUserRole()
  }, [])

  // Show loading state while user data is being fetched
  if (loading) {
    return <AdminDashboardSkeleton />
  }

  // Render AccessDenied if the user is not an admin; otherwise, show the admin panel
  return (
    <>
      {user && role?.role_type === 'admin' ? (
        <div className="container mx-auto p-6">
          <h1 className="mb-6 text-3xl font-semibold text-gray-800">
            Admin Panel
          </h1>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="dashboard" className="flex items-center">
                <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="community-requests"
                className="flex items-center"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Community Requests
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <h2 className="mb-4 text-2xl font-semibold">
                Dashboard Overview
              </h2>
              <p>
                Welcome to the admin dashboard. Here you can manage various
                aspects of your application.
              </p>
            </TabsContent>

            <TabsContent value="community-requests">
              <CommunityRequestsTab />
            </TabsContent>

            <TabsContent value="users">
              <h2 className="mb-4 text-2xl font-semibold">User Management</h2>
              <p>Here you can manage user accounts, roles, and permissions.</p>
              {/* Add user management functionality here */}
            </TabsContent>

            <TabsContent value="settings">
              <h2 className="mb-4 text-2xl font-semibold">Admin Settings</h2>
              <p>Configure various settings for the application here.</p>
              {/* Add settings configuration here */}
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  )
}
