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
            Getting Started<span className="text-[#5046e6]">.</span>
          </h1>
        </BoxReveal>

        <Accordion type="single" collapsible className="w-full">
          <BoxReveal duration={0.5}>
            <AccordionItem value="item-1">
              <AccordionTrigger>Upload a project from github</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </BoxReveal>

          <BoxReveal duration={0.5}>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
          </BoxReveal>

          <BoxReveal duration={0.5}>
            <Button className="mt-[1.6rem] bg-[#5046e6]">Take a tour</Button>
          </BoxReveal>
        </Accordion>
      </div>
    </div>
  )
}
