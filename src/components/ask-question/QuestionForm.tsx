import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z, type TypeOf } from 'zod'
import Select, { MultiValue } from 'react-select' // Import MultiValue type
import { useEffect, useState } from 'react'
import axios from 'axios'
import { TagOption } from '@/types/Tags'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { UUID } from 'crypto'

// Define form schema with optional tags field
const formSchema = z.object({
  title: z.string().min(1, { message: 'Question title cannot be empty.' }),
  description: z.string().min(1, { message: 'Question description cannot be empty.' }),
  tags: z.array(z.string()).optional(),
})

// Define props type
type QuestionFormProps = {
  onSubmit: (values: TypeOf<typeof formSchema>) => void
  children?: React.ReactNode
}

export default function QuestionForm({
  onSubmit,
  children,
}: QuestionFormProps) {
  const form = useForm<TypeOf<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
    },
  })

  const [tagOptions, setTagOptions] = useState<TagOption[]>([])
  const [selectedTags, setSelectedTags] = useState<MultiValue<TagOption>>([]) // Use MultiValue type

  // Fetch tags from the backend
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tags/`)
      .then((response) => {
        const options = response.data.map((tag: { tag_id: string; name: string }) => ({
          value: tag.tag_id,
          label: tag.name,
        }))
        setTagOptions(options)
      })
      .catch((error) => console.error('Error fetching tags:', error))
  }, [])

  const handleTagsChange = (newValue: MultiValue<TagOption>) => {
    console.log('Selected Tags:', newValue) // Debugging log
    setSelectedTags(newValue) // Update the state with selected tags
  }

  const handleSubmit = (values: TypeOf<typeof formSchema>) => {
    const payload = {
      ...values,
      tags: selectedTags.map(tag => tag.value), // Map tag IDs
    }

    console.log('QF Payload to be sent:', payload) // Debugging log

    onSubmit(payload) // Pass the final payload to the parent component
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
              <FormLabel>What would you like to know?</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <Controller
              control={form.control}
              name="tags"
              render={({ field }) => (
                <Select
                  {...field} // Spread the field props to use them in Select
                  isMulti
                  options={tagOptions}
                  placeholder="Select relevant tags (optional)"
                  value={tagOptions.filter(option =>
                    field.value?.includes(option.value)
                  )} // Ensure value stays in sync
                  onChange={(selected) => {
                    handleTagsChange(selected)
                    field.onChange(selected.map(option => option.value)) // Sync with form state
                  }}
                  className="mt-1"
                />
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>


        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
