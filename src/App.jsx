import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Plane, Sparkles } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Leva, useControls } from "leva";
import useWheel from "./lib/useWheel";
import useTouchMove from "./lib/useTouchMove";
import { DisplaceEffect } from "./fx/DisplaceEffect";
import GradientMaterial from "./materials/GradientMaterial";
extend({ GradientMaterial });

const Scene = () => {
  const ref = useRef();
  const { viewport } = useThree();

  const planeFromToY = [-3.7, 3.7];
  const distY = useRef(0);
  const wheelData = useWheel();
  const getTouchDelta = useTouchMove();

  /**
   * Super simple timeline(ish) fn
   * @param {React.RefObject<Mesh>} ref
   * @param {Array} fromTo
   * @param {Number} easeFactor
   */
  const tl = (ref, fromTo, easeFactor) => {
    const ticker = useRef(0.5);

    return {
      onFrame() {
        // Reset position at bounds
        if (ref.current.position.y < fromTo[0]) {
          ref.current.position.y = fromTo[1];
          ticker.current += 1;
        }
        if (ref.current.position.y > fromTo[1]) {
          ref.current.position.y = fromTo[0];
          ticker.current -= 1;
        }

        const targetY = THREE.MathUtils.lerp(fromTo[0], fromTo[1], ticker.current);

        // Current distance from target
        distY.current = targetY - ref.current.position.y;

        // Ease towards the target by closing the distance gradually
        ref.current.position.y += distY.current * easeFactor;
      },
      incrementTicker(value) {
        ticker.current += value;
      },
    };
  };

  const planeTl = tl(ref, planeFromToY, 0.0125);

  useEffect(() => {
    planeTl.incrementTicker(wheelData.deltaY * 0.00025);
  }, [wheelData]);

  useFrame(({ clock }, _delta) => {
    ref.current.scale.x = ref.current.scale.y = Math.sin(clock.elapsedTime * 1.1) * 0.125 + 1.25;
    planeTl.onFrame();
    planeTl.incrementTicker(getTouchDelta().y * 0.025);
  });

  /*
  const planeConfig = useControls("plane", {
    position: [0, 0, 0],
  });
  */

  const gradientMaterialConfig = useControls("gradientMaterial", {
    featherPow1: {
      value: 1.18,
      min: 0,
      max: 20,
      step: 0.01,
    },
    featherSmoothOut: {
      value: 0.83,
      min: 0,
      max: 1,
      step: 0.01,
    },
    featherPow2: {
      value: 1.62,
      min: 0,
      max: 20,
      step: 0.01,
    },
    cvalu1: "#fcefdc",
    cstop1: {
      value: -0.7,
      min: -2,
      max: 2,
      step: 0.01,
    },
    cvalu2: "#e59066",
    cstop2: {
      value: 0.2,
      min: -2,
      max: 2,
      step: 0.01,
    },
    cvalu3: "#fc9983",
    cstop3: {
      value: 0.5,
      min: -2,
      max: 2,
      step: 0.01,
    },
    cvalu1a: "#dceafc",
    cstop1a: {
      value: -0.7,
      min: -2,
      max: 2,
      step: 0.01,
    },
    cvalu2a: "#306edb",
    cstop2a: {
      value: 0.2,
      min: -2,
      max: 2,
      step: 0.01,
    },
    cvalu3a: "#00519d",
    cstop3a: {
      value: 0.5,
      min: -2,
      max: 2,
      step: 0.01,
    },
    daynightMix: {
      value: 0.0,
      step: 0.01,
      min: 0.0,
      max: 1,
    },
  });

  return (
    <>
      <Sparkles
        speed={0.05}
        size={[0.5, 1, 2]}
        opacity={0.75}
        position={[0, 0, -4]}
        scale={[viewport.width, viewport.height, 0]}
        color={new THREE.Color("#fcefdc")}
      />
      <Plane ref={ref} args={[3, 3]}>
        <gradientMaterial {...gradientMaterialConfig} key={GradientMaterial.key} />
      </Plane>
    </>
  );
};

const Overlay = () => {
  return (
    <div className='overlay'>
      Night Follows Day
      <br />
      Follows Night
      <br />
      Follows Day
    </div>
  );
};

const App = () => {
  const config = useControls("app", {
    togglePattern: {
      label: "toggle pattern",
      value: false,
    },
  });

  return (
    <>
      <Canvas orthographic flat linear camera={{ fov: 70, position: [0, 0, 3], zoom: 200 }}>
        {/* <OrbitControls /> */}
        <EffectComposer>
          <DisplaceEffect togglePattern={config.togglePattern} />
          <Noise opacity={0.2} />
        </EffectComposer>
        <Scene />
      </Canvas>
      <Overlay />
      <Leva hidden />
    </>
  );
};

export default App;
