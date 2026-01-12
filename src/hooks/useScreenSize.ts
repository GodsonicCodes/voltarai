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

  return {
    currentScreenSize,
    isMobile: currentScreenSize !== null && currentScreenSize < 768,
    isTablet: currentScreenSize !== null && currentScreenSize >= 768 && currentScreenSize < 1024,
    isDesktop: currentScreenSize !== null && currentScreenSize >= 1024,
  };
};

export default useScreenSize;
