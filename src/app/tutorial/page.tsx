import { Button } from "@/components/ui/button";
import BoxReveal from "@/components/ui/box-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
export default function TutorialPage() {
  return (
    <div>

      <div className="size-full max-w-lg items-center justify-center overflow-hidden pt-8 m-12">
        <BoxReveal duration={0.5}>
          <h1 className="text-center text-h2 font-bold font-subHeading text-secondary-foreground">
            Getting Started
          </h1>
        </BoxReveal>

        <Accordion type="single" collapsible className="w-full">

          <BoxReveal duration={0.5}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Upload a project from GitHub</AccordionTrigger>
              <AccordionContent>
                {/* TODO: connect link to authenticate with github*/}
                First, ensure your account is connected to GitHub by authenticating through this link
              </AccordionContent>
              <AccordionContent>
                Then, open the sidebar, navigate to the "Projects" section, and click "Add"
              </AccordionContent>
              <AccordionContent>
                Finally, complete the project details, including privacy settings, title, and description. Select the GitHub repository associated with your project
              </AccordionContent>
            </AccordionItem>
          </BoxReveal>

          <BoxReveal duration={0.5}>
            <AccordionItem value="item-2">
              <AccordionTrigger>Ask a Question</AccordionTrigger>
              <AccordionContent>
                Open the sidebar, navigate to the "Questions" section, and click "Ask"
              </AccordionContent>
              <AccordionContent>
                Fill in the title and description of your question. You'll also find a few optional fields
              </AccordionContent>
              <AccordionContent>
                You can include relevant tags, share the question within a specific community, and optionally link it to a related project. Keep in mind that linking a question to a project is not mandatory
              </AccordionContent>
            </AccordionItem>
          </BoxReveal>

          <BoxReveal duration={0.5}>
            <AccordionItem value="item-3">
              <AccordionTrigger>Answer a Question</AccordionTrigger>
              <AccordionContent>
                Open the sidebar, navigate to the "Questions" section, and click "Find Questions"
              </AccordionContent>
              <AccordionContent>
                Use the search and filter options to explore questions by keywords and tags
              </AccordionContent>
            </AccordionItem>
          </BoxReveal>

          <BoxReveal duration={0.5}>
            <AccordionItem value="item-4">
              <AccordionTrigger>Join a Community</AccordionTrigger>
              <AccordionContent>
                Open the sidebar, navigate to the "Communities" section
              </AccordionContent>
              <AccordionContent>
                You can either browse the current communities, or submit a request to create your own community
              </AccordionContent>
            </AccordionItem>
          </BoxReveal>

          <BoxReveal duration={0.5}>
            <AccordionItem value="item-5">
              <AccordionTrigger>About CodeHive</AccordionTrigger>
              <AccordionContent>
                We provide a platform for growing developers to request feedback tailored to their project's context
              </AccordionContent>
            </AccordionItem>
          </BoxReveal>

          <BoxReveal duration={0.5}>
            <Button className="mt-[1.6rem] bg-primary">Take a tour</Button>
          </BoxReveal>
        </Accordion>
      </div>
    </div>
  )
}
