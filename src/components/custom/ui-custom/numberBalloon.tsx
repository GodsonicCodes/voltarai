const Balloon = ({ value }: { value: string | number }) => {
  return (
    <p className="text-zinc-200/80 font-medium text-[7px] lg:text-[14px] border-[0.4px] lg:border border-white/20 rounded-full w-fit h-fit px-2 py-1 lg:py-0">
      {value}
    </p>
  );
};
export default Balloon;
