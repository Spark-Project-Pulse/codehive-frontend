'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'
import { type Question } from '@/types/Questions'

// Define the schema for validation using zod
const formSchema = z.object({
  question_id: z.string().uuid({ message: 'Invalid question ID.' }),
  asker: z.string().uuid({ message: 'Invalid asker ID.' }),
  title: z.string().min(1, { message: 'Title cannot be empty.' }),
  description: z.string().min(1, { message: 'Description cannot be empty.' }),
})

export type FormValues = z.infer<typeof formSchema>

interface UpdateQuestionFormProps {
  question: Question
  onSubmit: (values: FormValues) => Promise<void>
}

export default function UpdateQuestionForm({
  question,
  onSubmit,
}: UpdateQuestionFormProps) {
  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question_id: question.question_id,
      asker: question.asker,
      title: question.title,
      description: question.description,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter the question title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Provide a detailed description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <ButtonWithLoading
          buttonText="Update Question"
          buttonType="submit"
          isLoading={false} // Replace with actual loading state if needed
        />
      </form>
    </Form>
  )
}
