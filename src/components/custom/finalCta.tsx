import Link from "next/link";
import Button from "./ui-custom/button";

const FinalCta = () => {
  return (
    <div className="final__cta flex flex-col justify-between lg:gap-22.5 items-center h-fit  lg:px-[378] lg:py-[225px] px-4">
      <div
        className="w-full max-w-[1233px] min-h-[498px] lg:mt-20
        flex flex-col items-center justify-center text-center
        gap-[33px] lg:gap-12 sm:px-10 lg:px-16"
      >
        <p className="font-author font-medium text-[30px] lg:text-[80px] leading-[41px] lg:leading-[100px] tracking-normal text-center textradialgradientgrey">
          Your <span className="textradialgradientblue">Competitors</span> have
          AI Employees. Do you?
        </p>
        <p className="w-full font-author font-[375] text-[17px] lg:text-[40px] leading-[30px] lg:leading-[56px] tracking-normal text-center textradialgradientgrey px-2 lg:px-10">
          Everyday without AI automation costs you thousands in wasted labor and
          missed opportunities.
        </p>
        <div className="final__cta--button">
          <Button text="Get Our Free AI strategy" />
        </div>
      </div>

      <div className="final__cta--links text-white flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-10 ">
        <Link
          href="#"
          className="block text-center underline font-[375] lg:font-normal text-[14px] lg:text-[32px]"
        >
          Replace my most expensive employee
        </Link>
        <Link
          href="#"
          className="block text-center underline font-[375] lg:font-normal text-[14px] lg:text-[32px]"
        >
          Show me AI ROI Calculator
        </Link>
      </div>
    </div>
  );
};

export default FinalCta;
