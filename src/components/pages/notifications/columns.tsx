import { type ColumnDef } from '@tanstack/react-table'
import { type Notification } from '@/types/Notifications'
import { format } from 'date-fns'
import { generateNotificationContent } from '@/utils/notifications'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Define columns for the Notification data table
export const columns: ColumnDef<Notification>[] = [
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
]
