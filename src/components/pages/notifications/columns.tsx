import { type ColumnDef } from "@tanstack/react-table"
import { type Notification } from "@/types/Notifications"
import { format } from 'date-fns'
import { Badge } from "@/components/ui/badge"


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
    cell: ({ row }) => (
      <div>
        {row.original.message}
        {row.original.question_info && (
          <span>
            {" "}to <Badge>{row.original.question_info.title}</Badge>
          </span>
        )}
      </div>
    ),
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
