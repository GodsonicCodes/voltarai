"use client";
import footerArt from "../../../public/assets/footer_art.png";
import Image from "next/image";
import FooterContent from "./ui-custom/footerContent";
import useScreenSize from "@/hooks/useScreenSize";

const Footer = () => {
  const date = new Date().getFullYear();
  const screenSize = useScreenSize();

  // Mobile footer
  if (screenSize <= 844) {
    return (
      <div className="w-screen flex flex-col pt-20 relative h-full bg-black gap-10 px-4 mb-[55px]">
        <FooterContent />

        <div className="footer self-end flex justify-between w-full h-fit mb-12.5">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <Image
                key={i}
                src={footerArt}
                alt="footer art work"
                width={screenSize / 3}
                height={61}
                className={`${
                  i == 0 ? "order-1" : "order-3 mirror scale-x-[-1]"
                } select-none`}
              />
            ))}
          <p className={`font-normal text-[26px] order-2 w-${screenSize/3} self-end text-white/80`}>
            &copy; {date} Dreamosoft
          </p>
        </div>
      </div>
    );
  }

  // Desktop footer
  return (
    <div className="w-screen flex flex-col pt-[231px] relative h-full bg-black gap-[74px] px-2">
      <div className="mx-41 h-full flex items-center justify-center">
        <FooterContent />
      </div>
      <div className="footer self-end flex justify-between w-full h-fit mb-12.5">
        {Array(2)
          .fill(null)
          .map((_, i) => (
            <Image
              key={i}
              src={footerArt}
              alt="footer art work"
              width={461}
              height={108}
              className={`${
                i == 0 ? "order-1" : "order-3 mirror scale-x-[-1]"
              } select-none`}
            />
          ))}
        <p className="font-normal text-[26px] order-2 self-end text-white/80">
          &copy; {date} Dreamosoft
        </p>
      </div>
    </div>
  );
};

export default Footer;
