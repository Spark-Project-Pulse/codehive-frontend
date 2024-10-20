"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import type { TagOption } from '@/types/Tags';
import { getAllTags } from '@/api/tags';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ButtonWithLoading } from '@/components/universal/ButtonWithLoading';
import { MultiSelector } from '@/components/ui/MultiSelector';

// Schema is defined for the form which helps with input requirements and error handling
const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Question title cannot be empty.',
  }),
  description: z.string().min(1, {
    message: 'Question description cannot be empty.',
  }),
  tags: z.array(z.string()).optional(), // Array of tag UUIDs
});

type FormValues = z.infer<typeof formSchema>;

// Function that will render the question form and passes the results to the ask question page on submit
export default function QuestionForm({
  onSubmit,
}: {
  onSubmit: (values: FormValues) => void;
}) {
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [], // Initialize tags as an empty array
    },
  });

  // State to store tag options
  const [tagOptions, setTagOptions] = useState<TagOption[]>([]);

  // State to manage selected tags
  const [selectedTags, setSelectedTags] = useState<TagOption[]>([]);

  // Fetch tags from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = await getAllTags(); // Returns TagOption[]
        setTagOptions(options);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchData().catch((error) => {
      console.error('Error in fetchData:', error);
    });
  }, []);

  // Synchronize selectedTags with react-hook-form's "tags" field
  useEffect(() => {
    form.setValue('tags', selectedTags.map((tag) => tag.value));
  }, [selectedTags, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormLabel htmlFor="description">What would you like to know?</FormLabel>
              <FormControl>
                <Textarea id="description" placeholder="Description" {...field} />
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
        
        {/* Submit Button */}
        <ButtonWithLoading
          isLoading={form.formState.isSubmitting}
          buttonText="Submit"
          buttonType="submit"
        />
      </form>
    </Form>
  );
}
