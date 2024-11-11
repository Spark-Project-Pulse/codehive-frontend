import { type ColumnDef } from "@tanstack/react-table"
import { type Notification } from "@/types/Notifications"
import { format } from 'date-fns'
import { generateNotificationContent } from "@/utils/notifications"


// Define columns for the Notification data table
export const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: "read",
    header: "Read",
    cell: ({ row }) => (row.original.read ? "Yes" : "No"),
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const { message, link } = generateNotificationContent(row.original)
      return message
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.original.created_at), 'PPP p'),
  },
  {
    accessorKey: "actor_info",
    header: "Triggered By",
    cell: ({ row }) => row.original.actor_info?.username ?? "n/a",
  },
]
