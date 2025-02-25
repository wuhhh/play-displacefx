import { useEffect, useState } from "react";

const useWheel = () => {
  const [wheelData, setWheelDelta] = useState({
    deltaY: 0,
    ternary: 0,
    timestamp: 0,
    wheelDeltaY: 0,
  });

  useEffect(() => {
    const handleWheel = event => {
      let { deltaY, timestamp, wheelDeltaY } = event;
      setWheelDelta({
        deltaY,
        ternary: deltaY == 0 ? deltaY : deltaY > 0 ? 1 : -1,
        timestamp,
        wheelDeltaY,
      });
    };

    window.addEventListener("wheel", handleWheel, false);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return wheelData;
};

export default useWheel;
