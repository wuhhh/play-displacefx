import { useState, useEffect } from "react";

const useWheel = () => {
  const [wheelDelta, setWheelDelta] = useState(0);

  useEffect(() => {
    const handleWheel = event => {
      setWheelDelta(event.wheelDeltaY);
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return wheelDelta;
};

export default useWheel;
