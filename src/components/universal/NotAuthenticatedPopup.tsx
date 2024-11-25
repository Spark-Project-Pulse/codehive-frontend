import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'

interface NotAuthenticatedPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotAuthenticatedPopup({
  isOpen,
  onClose,
}: NotAuthenticatedPopupProps) {
  const [open, setOpen] = useState(isOpen)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authentication Required 🐝</DialogTitle>
          <DialogDescription>
            Looks like you need to login to buzz around this feature!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Link href='/login'>
            <Button>Fly to Login</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
