import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
export default function TutorialPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="size-full max-w-lg items-center justify-center overflow-hidden">
        <h1 className="text-center font-subHeading text-h2 font-bold text-secondary-foreground">
          Getting Started
        </h1>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Upload a project from GitHub</AccordionTrigger>
            <AccordionContent>
              {/* TODO: connect link to authenticate with github*/}
              First, make sure your account is connected to GitHub by
              authenticating through this link.
            </AccordionContent>
            <AccordionContent>
              Next, open the sidebar, go to the &quot;Projects&quot; section,
              and click &quot;Add&quot;
            </AccordionContent>
            <AccordionContent>
              Finally, complete the project details, including privacy settings,
              title, description, and link to your GitHub repository.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Ask a Question</AccordionTrigger>
            <AccordionContent>
              Open the sidebar, head to the &quot;Questions&quot; section, and
              click &quot;Ask&quot;
            </AccordionContent>
            <AccordionContent>
              Fill in the title and description of your question. A few extra
              fields are also available for you to explore
            </AccordionContent>
            <AccordionContent>
              You can tag your question, share it with a specific hive, or
              even link it to a related project. These are all optional, but
              always encouraged!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Answer a Question</AccordionTrigger>
            <AccordionContent>
              Open the sidebar, navigate to the &quot;Questions&quot; section,
              and click &quot;Find Questions&quot;
            </AccordionContent>
            <AccordionContent>
              Use the search and filter options to find questions that match
              your expertise and interests
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Join a Hive</AccordionTrigger>
            <AccordionContent>
              Open the sidebar, navigate to the &quot;Hives&quot; section
            </AccordionContent>
            <AccordionContent>
              Browse through existing hives, or request to create one of
              your own. Collaboration starts here!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>About CodeHive</AccordionTrigger>
            <AccordionContent>
              CodeHive is a platform built for developers to grow, collaborate,
              and get the feedback they need to thrive. We support
              project-specific insights that help you improve and innovate
            </AccordionContent>
          </AccordionItem>

          <Button className="mt-[1.6rem] bg-primary">Take a tour</Button>
        </Accordion>
      </div>
    </div>
  )
}
