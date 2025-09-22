const AboutUs = () => {
  return (
    <div className="flex flex-col items-center gap-11.5 px-4">
      <p className="textradialgradientgrey font-[375] text-[20px] lg:text-[42px]">
        About Us
      </p>

      <div
        className="w-full lg:max-w-[1233px] h-fit lg:min-h-[498px] lg:mt-20
      flex flex-col items-center justify-center text-center
      gap-[33px] lg:gap-22.5 lg:px-16"
      >
        <div className="flex flex-col gap-7.5 ">
          <p className="font-author font-medium text-[30px] lg:text-[80px] leading-[41px] lg:leading-[100px] tracking-normal text-center textradialgradientgrey">
            We Build AI Employees For
            <span className="textradialgradientblue"> Growth-Stage </span>
            Companies
          </p>
          <p className="w-full px-2 font-author font-[375] text-[17px] lg:text-[30px] leading-[30px] lg:leading-[56px] tracking-normal text-center lg:text-center textradialgradientgrey lg:px-10">
            500+ successful AI Agents built. We don’t do generic chatbots, we
            build AI workers that replace expensive human roles with intelligent
            automation.
          </p>
        </div>
        <div className="px-2 flex flex-col gap-7.5 items-center justify-center">
          <p className="font-[494] text-[25px] lg:text-[48px] textradialgradientgrey">
            Our Speciality
          </p>
          <p className="w-full text-center font-[375] text-[17px] lg:text-[30px] leading-[30px] lg:leading-[56px] textradialgradientgrey">
            Turning your highest-cost manual processes into profitable AI
            systems
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
