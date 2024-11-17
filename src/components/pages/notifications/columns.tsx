import { type ColumnDef } from '@tanstack/react-table'
import { type Notification } from '@/types/Notifications'
import { format } from 'date-fns'
import { generateNotificationContent } from '@/utils/notifications'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

interface ColumnsProps {
  handleMarkNotificationAsRead: (notification_id: string) => Promise<void>
  handleDeleteNotification: (notification_id: string) => Promise<void>
}

// Define columns for the Notification data table
export const getColumns = ({
  handleMarkNotificationAsRead,
  handleDeleteNotification
}: ColumnsProps): ColumnDef<Notification>[] => [
  {
    accessorKey: 'read',
    header: 'Read',
    cell: ({ row }) => (row.original.read ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => {
      const { message } = generateNotificationContent(row.original)
      return message
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => format(new Date(row.original.created_at), 'PPP p'),
  },
  {
    accessorKey: 'actor_info',
    header: 'Triggered By',
    cell: ({ row }) =>
      row.original.actor_info ? (
        <div className="flex justify-center">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={`${row.original.actor_info?.profile_image_url}?t=${Date.now()}`}
              alt={row.original.actor_info?.username}
            />
            <AvatarFallback className="rounded-lg">
              {row.original.actor_info?.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="text-center">-</div>
      ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const notification = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                handleMarkNotificationAsRead(notification.notification_id)
              }
            >
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                handleDeleteNotification(notification.notification_id)
              }
            >
              Delete Notification
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
