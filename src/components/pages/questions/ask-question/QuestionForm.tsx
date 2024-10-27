'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import type { TagOption } from '@/types/Tags'
import { getAllTags } from '@/api/tags'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'
import { MultiSelector } from '@/components/ui/MultiSelector'
import { useUser } from '@/app/contexts/UserContext'
import { getProjectsByUserId } from '@/api/projects'
import { type ProjectOption } from '@/types/Projects'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

// Define the schema using zod
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Question title cannot be empty.',
  }),
  description: z.string().min(1, {
    message: 'Question description cannot be empty.',
  }),
  related_project: z.string().optional(), // project UUID
  tags: z.array(z.string()).optional(), // Array of tag UUIDs
})

type FormValues = z.infer<typeof formSchema>

// The QuestionForm component
export default function QuestionForm({
  onSubmit,
}: {
  onSubmit: (values: FormValues) => Promise<void>
}) {
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      related_project: '',
      tags: [],
    },
  })

  const { user, loading } = useUser()

  // State to store tag options
  const [tagOptions, setTagOptions] = useState<TagOption[]>([])

  // State to manage selected tags
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])

  // State to store tag options
  const [projectOptions, setProjectOptions] = useState<ProjectOption[]>([])

  // Fetch tags from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tagOptions = await getAllTags() // Returns TagOption[]
        setTagOptions(tagOptions)

        if (user) {
          const projectsResponse = await getProjectsByUserId(user.user)
          const projectOptions = projectsResponse?.data?.map((project) => ({
            value: project.project_id,
            label: project.title,
          }))
          setProjectOptions(projectOptions ?? [])
        }
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    void fetchData()
  }, [user])

  // Synchronize selectedTags with react-hook-form's "tags" field
  useEffect(() => {
    form.setValue(
      'tags',
      selectedTags.map((tag) => tag.value)
    )
  }, [selectedTags, form])

  return (
    <Form {...form}>
      <form className="space-y-8">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input id="title" placeholder="Title" {...field} />
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
              <FormLabel htmlFor="description">
                What would you like to know?
              </FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags Field */}
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel htmlFor="tags">Tags</FormLabel>
              <FormControl>
                <MultiSelector
                  options={tagOptions}
                  selected={selectedTags}
                  onSelectedChange={setSelectedTags}
                  placeholder="Select relevant tags (optional)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Related Project Field */}
        <FormField
          control={form.control}
          name="related_project"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="related_project">
                Connect to a Project
              </FormLabel>
              <FormControl>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!user}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: find way to clear select menu (this is a shad issue: https://github.com/shadcn-ui/ui/issues/2054#issuecomment-2295431544) */}
                      {projectOptions.map((project) => (
                        <SelectItem key={project.value} value={project.value}>
                          {project.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormControl>
              {user ? (
                <FormDescription>
                  Linking a project to this question is optional, but may help
                  your question get answered faster!
                </FormDescription>
              ) : (
                <FormDescription>
                  You must be <Link href="/login">logged in</Link> to link a
                  question!
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <ButtonWithLoading
          onClick={form.handleSubmit(onSubmit)}
          buttonText="Submit"
          buttonType="button"
        />
      </form>
    </Form>
  )
}
