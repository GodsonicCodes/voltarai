import Button from "./ui-custom/button";

const CTA7 = () => {
  return (
    <div className="flex flex-col justify-between gap-22.5 items-center px-4 lg:px-[378] lg:py-[225px]">
      <div
        className="w-full max-w-[1233px] min-h-[498px] lg:mt-20
      flex flex-col items-center justify-center text-center
      gap-[33px] lg:gap-12 lg:px-16"
      >
        <p className="font-author font-medium text-[30px] lg:text-[80px] leading-[41px] lg:leading-[100px] tracking-normal text-center textradialgradientgrey">
          Ready to <span className="textradialgradientblue">Hire</span> your
          first AI employee
        </p>
        <p className="font-author font-[375] text-[17px] lg:text-[40px] leading-[30px] lg:leading-[56px] tracking-normal text-justify lg:text-center textradialgradientgrey px-2 lg:px-10">
          Book your strategy call. Discover which roles AI can replace fast.
        </p>
        <Button text="Schedule Strategy Call" />
      </div>
    </div>
  );
};

export default CTA7;
