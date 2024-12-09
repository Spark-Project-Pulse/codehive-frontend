'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const faqData = [
  {
    question: 'What is the purpose of this platform?',
    answer:
      'Our platform helps developers and creators connect, learn, and grow by providing tools for collaboration, code review, and community engagement.',
  },
  {
    question: 'How do I integrate GitHub with my account?',
    answer:
      'You can easily sync your GitHub repos by logging in with GitHub and creating a project.',
  },
  {
    question: 'What kind of communities can I join?',
    answer: (
      <>
        You can join hives(communities) based on your interests, such as AI, open
        source, frontend development, and many more. You can also create a{' '}
        <Link href="/hives/create">
          <Button className="p-0" variant="link">
            hive request
          </Button>
        </Link>{' '}
        if you want to see a new hive on CodeHive!
      </>
    ),
  },
  {
    question: 'How can I get help if I face an issue?',
    answer:
      'You can reach out to our support team via the contact page or post your query in the hive forums for assistance from other members.',
  },
]

export default function FAQ() {
  return (
    <section className="container mx-auto px-6 py-12">
      {/* Title and Description */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Got questions? We&apos;ve got answers! Explore some common inquiries
          below.
        </p>
      </div>

      {/* Accordion for FAQ */}
      <Accordion type="single" collapsible className="space-y-4">
        {faqData.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-lg font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 dark:text-gray-300">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
