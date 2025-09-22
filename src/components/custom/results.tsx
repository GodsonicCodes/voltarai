import Balloon from "./ui-custom/numberBalloon";

interface Weeks {
  id: number;
  week: string;
  details: string;
}

interface Results {
  id: number;
  result: string;
}

const weekImpact: Weeks[] = [
  { id: 1, week: "1", details: "AI deployed and handling basic tasks" },
  { id: 2, week: "2", details: "Processing leads and customer inquiries" },
  { id: 3, week: "3", details: "Full automation running 24/7" },
];

const typicalResults: Results[] = [
  { id: 1, result: "Replaces 2-3 full-time positions" },
  { id: 2, result: "Save $120K - 300K annually" },
  { id: 3, result: "Capture 3x more opportunities" },
  { id: 4, result: "Scale without hiring stress" },
];

const Results = () => {
  return (
    <div className="flex w-full min-h-[675px] px-4 lg:px-[200px] justify-center items-center">
      <div className="w-full h-full lg:my-[221px] my-[81px] flex flex-col items-center justify-between gap-10 lg:gap-20">
        <p className="font-author font-medium text-[30px] lg:text-[80px] leading-[41px] lg:leading-[100px] tracking-normal text-center textradialgradientgrey">
          Real <span className="textradialgradientblue">Impact,</span> Real Fast
        </p>

        <div className="flex flex-col lg:flex-row w-full h-full items-center lg:items-start lg:justify-between gap-10">
          {/* Weeks Impact */}
          <div className="flex flex-col gap-10 items-start flex-1 w-fit">
            {weekImpact.map((week) => (
              <div key={week.id} className="flex flex-col justify-start">
                <p className="text-white text-[18px] lg:text-[40px] font-[375]">
                  Week {week.week}:
                </p>
                <p className="text-white/70 text-[18px] lg:text-[38px] font-[375]">
                  {week.details}
                </p>
              </div>
            ))}
          </div>

          {/* Typical Results */}
          <div className="flex flex-col flex-1 gap-8.5 justify-start items-center lg:items-start w-fit lg:mt-[-10px]">
            <p className="lg:text-start font-[375] text-[18px] text-center lg:text-[50px] textradialgradientgrey">
              Typical Results
            </p>
            <div className="flex flex-col gap-14 w-fit">
              {typicalResults.map((results) => (
                <span
                  key={results.id}
                  className="h-fit flex gap-3 items-center"
                >
                  <Balloon value={results.id} />
                  <p className="text-white font-[375] text-[17px] lg:text-[40px]">
                    {results.result}
                  </p>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Results;
