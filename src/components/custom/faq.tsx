import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Balloon from "./ui-custom/numberBalloon";

interface Accordion {
  id: number;
  item: string;
  content: string;
}

const AccordionList: Accordion[] = [
  {
    id: 1,
    item: "How fast does one get ROI?",
    content:
      "Most Clients break even within 30 days through eliminated salary costs alone",
  },
  {
    id: 2,
    item: "What if it breaks?",
    content:
      "We provide full support and replacements if needed, ensuring minimal downtime.",
  },
  {
    id: 3,
    item: "Is my data safe?",
    content:
      "Enterprise-grade security. Bank-level encryption. Your data never leaves your control",
  },
  {
    id: 4,
    item: "Cost vs hiring humans?",
    content:
      "Our solution is significantly cheaper long-term compared to hiring full-time staff.",
  },
];

const FAQ = () => {
  return (
    <div className="flex flex-col gap-12 lg:gap-26 w-full items-center px-4 lg:px-0 lg:min-w-5xl mx-auto lg:py-[225px]">
      <p className="font-author font-[494] text-[30px] lg:text-[80px] leading-[100px] tracking-normal text-center textradialgradientgrey">
        Frequently <span className="textradialgradientblue">Asked </span>
        Questions
      </p>

      <Accordion
        type="single"
        collapsible
        className="w-full lg:px-[330px] lg:min-w-3xl px-2"
      >
        {AccordionList.map((listItem) => (
          <AccordionItem value={`item_${listItem.id}`} key={listItem.id}>
            <AccordionTrigger className="flex items-center font-[494] text-[17px] lg:text-[40px] text-white hover:no-underline">
              <span className="flex items-center gap-4">
                <Balloon value={listItem.id} /> {listItem.item}
              </span>
            </AccordionTrigger>

            <AccordionContent className="ml-9 flex flex-col gap-4 text-balance font-[375] text-[15px] lg:text-[30px] text-white/60">
              {listItem.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ;
