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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading'
import { MultiSelector } from '@/components/ui/MultiSelector'

// Define the schema using zod
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Community title cannot be empty.',
  }),
  description: z.string().min(1, {
    message: 'Community description cannot be empty.',
  }),
  tags: z.array(z.string()).optional(), // Array of tag UUIDs
  avatar:
    typeof File !== 'undefined'
      ? z.instanceof(File).nullable()
      : z.any().nullable(), // Fallback for server environment (otheriwse the GitHub build fails)
})

type FormValues = z.infer<typeof formSchema>

// The CommunityForm component
export default function CommunityForm({
  onSubmit,
}: {
  onSubmit: (values: FormValues) => Promise<void>
}) {
  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      avatar: null,
    },
  })

  // Fetch tags from backend on component mount
  const [tagOptions, setTagOptions] = useState<TagOption[]>([])
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTags()
        setTagOptions(tags)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    void fetchTags()
  }, [])

  // Synchronize selectedTags with react-hook-form's "tags" field
  useEffect(() => {
    form.setValue(
      'tags',
      selectedTags.map((tag) => tag.value)
    )
  }, [selectedTags, form])

  // State to handle form submission
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle file upload for avatar
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    form.setValue('avatar', file)
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Community Title</FormLabel>
              <FormControl>
                <Input
                  id="title"
                  placeholder="Community title"
                  {...field}
                />
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
              <FormLabel htmlFor="description">Description</FormLabel>
              <FormControl>
                <Textarea
                  id="description"
                  placeholder="Describe the community"
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
              <FormLabel htmlFor="tags">Tags (optional)</FormLabel>
              <FormControl>
                <MultiSelector
                  options={tagOptions}
                  selected={selectedTags}
                  onSelectedChange={setSelectedTags}
                  placeholder="Select relevant tags"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Avatar Upload Field */}
        <FormField
          control={form.control}
          name="avatar"
          render={() => (
            <FormItem>
              <FormLabel htmlFor="avatar">
                Community Avatar (optional)
              </FormLabel>
              <FormControl>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <ButtonWithLoading
          buttonText="Create Community"
          buttonType="submit"
          isLoading={isSubmitting}
        />
      </form>
    </Form>
  )
}
