import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { useState } from 'react'
import { Pencil1Icon } from '@radix-ui/react-icons';

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

  const handleQuestionUpdate = async (form_data: FormValues) => {
    try {
      const { errorMessage, data } = await updateQuestion({
        questionId: form_data.question_id,
        asker: form_data.asker,
        title: form_data.title,
        description: form_data.description,
      })

      if (errorMessage) {
        throw new Error(errorMessage)
      }

      if (data?.toxic) {
        throw new Error('Toxic content detected in your question.')
      }

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
          <Pencil1Icon className="w-5 h-5 text-black" />
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
        />

        {/* Delete Button within the dialog */}
        <div className="mt-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="p-5">
                Delete Question
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Deleting this question will
                  remove it permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleQuestionDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}
