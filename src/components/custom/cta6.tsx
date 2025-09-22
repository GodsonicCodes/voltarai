import Button from "./ui-custom/button";

const CTA6 = () => {
  return (
    <div className="flex flex-col items-center justify-between gap-22.5 px-4 lg:px-[378px] lg:py-[225px]">
      <div className="flex w-full max-w-[1233px] min-h-[498px] flex-col items-center justify-center text-center gap-[33px] px-2 lg:mt-20 lg:gap-12 lg:px-16">
        
        {/* Header (matched with AboutUs header) */}
        <p className="font-author font-medium text-[30px] lg:text-[80px] leading-[41px] lg:leading-[100px] tracking-normal text-center textradialgradientgrey">
          Stop Paying{" "}
          <span className="textradialgradientblue">Salaries</span> For Robot Work
        </p>
        
        {/* Body (matched with AboutUs body) */}
        <p className="w-full px-2 font-author font-[375] text-[17px] lg:text-[30px] leading-[30px] lg:leading-[56px] tracking-normal text-center textradialgradientgrey lg:px-10">
          30-minute strategy call. See exactly how AI replaces your costliest
          manual work
        </p>

        <Button text="Get Our Custom AI Employee" />
      </div>
    </div>
  );
};

export default CTA6;
