import { useState, useEffect } from "react";

const useScreenSize = () => {
  const [currentScreenSize, setCurrentScreenSize] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setCurrentScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return currentScreenSize;
};

export default useScreenSize;
