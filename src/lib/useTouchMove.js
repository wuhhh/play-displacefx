import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

const useTouchMove = () => {
  const touchMoveXYRef = useRef({ x: 0, y: 0 });
  const lastDistanceRef = useRef({ x: 0, y: 0 });
  const deltaRef = useRef({ x: 0, y: 0 });

  const handleTouchStart = event => {
    lastDistanceRef.current.x = touchMoveXYRef.current.x = event.touches[0].clientX;
    lastDistanceRef.current.y = touchMoveXYRef.current.y = event.touches[0].clientY;
  };

  const handleTouchEnd = _ => {
    lastDistanceRef.current.x = touchMoveXYRef.current.x = 0;
    lastDistanceRef.current.y = touchMoveXYRef.current.y = 0;
  };

  const handleTouchMove = event => {
    touchMoveXYRef.current.x = event.touches[0].clientX;
    touchMoveXYRef.current.y = event.touches[0].clientY;
  };

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useFrame(() => {
    const travelX = lastDistanceRef.current.x - touchMoveXYRef.current.x;
    const travelY = lastDistanceRef.current.y - touchMoveXYRef.current.y;
    const normalizedTravelX = travelX / window.innerWidth;
    const normalizedTravelY = travelY / window.innerHeight;
    deltaRef.current = { x: normalizedTravelX * 50, y: normalizedTravelY * 50 };

    lastDistanceRef.current.x = touchMoveXYRef.current.x;
    lastDistanceRef.current.y = touchMoveXYRef.current.y;
  });

  const getTouchDelta = () => deltaRef.current;

  return getTouchDelta;
};

export default useTouchMove;
