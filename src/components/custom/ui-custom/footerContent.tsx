import Link from "next/link";
import EmailInput from "./emailInput";
import useScreenSize from "@/hooks/useScreenSize";

interface urlProps {
  name: string;
  url: string;
}
interface FooterProps {
  id: number;
  header: string;
  url: urlProps[];
  footer?: {
    name: string;
    url: string;
  };
}

const footerItems: FooterProps[] = [
  {
    id: 1,
    header: "Company",
    url: [
      { name: "About Us", url: "#" },
      { name: "Solutions", url: "#" },
      { name: "Why Choose Us", url: "#" },
      { name: "Pricing", url: "#" },
    ],
    footer: { name: "Terms & Conditions", url: "#" },
  },
  {
    id: 2,
    header: "Solutions",
    url: [
      { name: "Smart Automation", url: "#" },
      { name: "Analytics Agent", url: "#" },
      { name: "Customer Agent", url: "#" },
      { name: "AI Data Processors", url: "#" },
    ],
    footer: { name: "Privacy Policy", url: "#" },
  },
  {
    id: 3,
    header: "Follow",
    url: [
      { name: "LinkedIn", url: "#" },
      { name: "Youtube", url: "#" },
      { name: "Instagram", url: "#" },
    ],
  },
];

const FooterContent = () => {
  const screenSize = useScreenSize();

  // Mobile footer
  if (screenSize <= 844) {
    return (
      <div className="flex flex-col px-4 gap-12.5">
        <p className="font-[375] text-[17px] text-white">
          Voltar AI is your intelligent partner for automation, analysis and
          decision making. We scale businesses 10x faster with AI that never
          sleeps.{" "}
        </p>

        {footerItems.map((footer) => (
          <div
            key={footer.id}
            className={`footer__url__${footer.id} flex flex-col justify-between gap-21 self-start`}
          >
            <div className="flex flex-col gap-3 text-[17px] font-[375]">
              <p className="text-blue-700">{footer.header}</p>
              {footer.url.map((url, index) => (
                <div key={index} className="h-fit w-fit">
                  <Link href={url.url} className="text-white">
                    {url.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-between">
          <Link
            href={"#"}
            className="text-white underline text-[17px] font-[375]"
          >
            Terms &amp; Conditions
          </Link>

          <Link
            href={"#"}
            className="text-white underline text-[17px] font-[375]"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="flex flex-col gap-5">
          <p className="text-white text-[17px] font-[375]">
            Join our mailing list
          </p>
          <EmailInput />
        </div>
      </div>
    );
  }
  return (
    <div className="footer__content grid grid-cols-5 font-normal justify-items-end justify-end">
      <div className="flex flex-col gap-[51px] justify-end items-center col-span-2 pt-[139px] ">
        {/* Image  */}
        <p className="footer__text text-2xl font-[375] text-white ">
          Voltar AI is your intelligent partner for automation, analysis and
          decision making. We scale businesses 10x faster with AI that never
          sleeps.
        </p>
        <div className="footer__form flex flex-col gap-2.5 items-start w-full">
          <p className="text-white text-2xl font-[375]">
            Join our mailing list
          </p>
          <div className="w-full h-full p-1 flex justify-center items-center">
            <div className="relative w-full h-full">
              <EmailInput />
            </div>
          </div>

          <button>{/* Button and the logo */}</button>
        </div>
      </div>
      {footerItems.map((footer) => (
        <div
          key={footer.id}
          className={`footer__url__${footer.id} flex flex-col justify-between col-span-1 gap-21 self-start`}
        >
          <div className="flex flex-col gap-3 text-[24px] font-[375]">
            <p className="text-blue-700">{footer.header}</p>
            {footer.url.map((url, index) => (
              <div key={index} className="h-fit w-fit">
                <Link href={url.url} className="text-white">
                  {url.name}
                </Link>
              </div>
            ))}
          </div>
          {footer.footer && footer.footer.name && (
            <Link
              href={footer.footer.url}
              className="text-white underline text-[24px] font-[375]"
            >
              {footer.footer.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default FooterContent;
