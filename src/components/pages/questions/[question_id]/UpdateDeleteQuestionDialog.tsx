import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import UpdateQuestionForm, { type FormValues } from './UpdateQuestionForm'
import { type Question } from '@/types/Questions'
import { toast } from '@/components/ui/use-toast'
import { updateQuestion, deleteQuestion } from '@/api/questions'
import { useEffect, useState } from 'react'
import { Pencil1Icon } from '@radix-ui/react-icons'

interface UpdateDeleteQuestionDialogProps {
  question: Question
  onUpdate: (updatedQuestion: Question) => void
  onDelete: (questionId: string) => void
}

export default function UpdateDeleteQuestionDialog({
  question,
  onUpdate,
  onDelete,
}: UpdateDeleteQuestionDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)

  // Lock and unlock scrolling when the sheet opens or closes
  useEffect(() => {
    if (isDialogOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = '' // Clean up in case of unmount
    }
  }, [isDialogOpen])

  const handleQuestionUpdate = async (form_data: FormValues) => {
    try {
      setIsLoadingUpdate(true)

      const { errorMessage } = await updateQuestion({
        questionId: form_data.question_id,
        asker: form_data.asker,
        title: form_data.title,
        description: form_data.description,
      })

      if (errorMessage) {
        // Show innapropriate content toast if there is innapropriate content
        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
        })
        throw new Error(errorMessage)
      }

      setIsLoadingUpdate(false)

      const updatedQuestion = { ...question, ...form_data }
      onUpdate(updatedQuestion as Question)

      toast({
        title: 'Question Updated',
        description: 'The question was updated successfully.',
      })

      setIsDialogOpen(false) // Close the dialog on update
    } catch (error) {
      console.error('Error updating question:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while updating the question.',
      })
    }
  }

  const handleQuestionDelete = async () => {
    try {
      const { errorMessage } = await deleteQuestion(
        question.question_id,
        question.asker
      )
      if (errorMessage) {
        throw new Error(errorMessage)
      }

      toast({
        title: 'Question Deleted',
        description: 'The question was deleted successfully.',
      })

      onDelete?.(question.question_id) // Notify parent to update UI
      setIsDialogOpen(false) // Close the dialog on delete
    } catch (error) {
      console.error('Error deleting question:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'An error occurred while deleting the question.',
      })
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil1Icon className="h-5 w-5 text-black" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Edit the title or description of your question.
          </DialogDescription>
        </DialogHeader>
        <UpdateQuestionForm
          question={question}
          onSubmit={handleQuestionUpdate}
          isLoadingUpdate={isLoadingUpdate}
          onDelete={handleQuestionDelete}
        />
      </DialogContent>
    </Dialog>
  )
}
