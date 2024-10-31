'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'

// Schema is defined for the form which helps with input requirements and error handling
const formSchema = z.object({
  response: z.string().min(1, {
    message: 'Response field cannot be empty.',
  }),
})

// Function that will render the commment form and passes the results to the asked-question page on submit
export default function CommentForm({
  onSubmit,
}: {
  onSubmit: (values: z.infer<typeof formSchema>) => void
}) {
  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      response: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="your comment here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonWithLoading
          id="comment-submit-button"
          onClick={form.handleSubmit(onSubmit)}
          buttonText="Submit"
          buttonType="submit"
        />

      </form>
    </Form>
  )
}
