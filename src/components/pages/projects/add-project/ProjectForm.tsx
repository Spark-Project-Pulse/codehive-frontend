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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'
import { type Repo } from '@/types/Projects'
import { Skeleton } from '@/components/ui/skeleton'

// Schema is defined for the form which helps with input requirements and error handling
const formSchema = z.object({
  public: z.boolean().refine((val) => typeof val === 'boolean', {
    message: 'You must select a privacy status.',
  }),
  title: z.string().min(1, {
    message: 'Question title cannot be empty.',
  }),
  description: z.string().min(1, {
    message: 'Question description cannot be empty.',
  }),
  repoFullName: z.string().min(1, {
    message: 'You must select a GitHub repository for this project.',
  }),
})

// Function that will render the question form and passes the results to the ask question page on submit
export default function ProjectForm({
  repos,
  onSubmit,
  isLoading,
}: {
  repos: Repo[]
  onSubmit: (values: z.infer<typeof formSchema>) => void
  isLoading: boolean
}) {
  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      public: false,
      title: '',
      description: '',
      repoFullName: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="public"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project privacy</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) => field.onChange(value === 'public')} // Convert string to boolean
                  value={field.value ? 'public' : 'private'} // Map boolean to string
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select privacy status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your project about?</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repoFullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select GitHub Repository</FormLabel>
              <FormControl>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="w-full h-10" />
                  </div>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Repositories</SelectLabel>
                        {repos.map((repo) => (
                          <SelectItem key={repo.id} value={repo.full_name}>
                            {repo.name} {repo.private ? '(Private)' : '(Public)'}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonWithLoading
          onClick={form.handleSubmit(onSubmit)}
          buttonText="Submit"
          buttonType="submit"
        />
      </form>
    </Form>
  )
}
