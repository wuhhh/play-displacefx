import React, { forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Center, Plane } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Leva, useControls } from "leva";
import useWheel from "./lib/useWheel";
import useTouchMove from "./lib/useTouchMove";
import { DisplaceEffect } from "./fx/DisplaceEffect";
import GradientMaterial from "./materials/GradientMaterial";
extend({ GradientMaterial });

/**
 * Super simple timeline(ish) fn
 * @param {React.RefObject<Mesh>} ref
 * @param {Array} fromTo
 * @param {Number} startPosition
 * @param {Number} easeFactor
 */
const tl = (ref, fromTo, startPosition = 0.5, easeFactor) => {
  const ticker = useRef(startPosition);
  const distY = useRef(0);

  useEffect(() => {
    // Set start position
    ref.current.position.y = THREE.MathUtils.lerp(fromTo[0], fromTo[1], startPosition);
  }, []);

  useFrame(() => {
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
    ref.current.position.y += distY.current * easeFactor * 0.01;

    // Cycle day/night
    //ref.current.children[0].children[0].children[0].material.daynightMix = ticker.current;
    //ref.current.children[0].children[0].children[1].material.daynightMix = ticker.current;
  });

  return {
    incrementTicker(value) {
      ticker.current += value * 0.001;
    },
  };
};

/**
 * SunMoon
 */
const SunMoon = () => {
  const { width, height } = useThree(state => state.viewport);
  const sun = useRef();
  const moon = useRef();
  const sunTl = tl(sun, [-height, height], 0.5, 1.25);
  const moonTl = tl(moon, [-height, height], 0, 1.25);
  const wheelData = useWheel();
  const getTouchDelta = useTouchMove();

  useEffect(() => {
    sunTl.incrementTicker(wheelData.deltaY * 0.25);
    moonTl.incrementTicker(wheelData.deltaY * 0.25);
  }, [wheelData]);

  useFrame(({ clock }, _delta) => {
    sun.current.scale.x = sun.current.scale.y = Math.sin(clock.elapsedTime * 0.5) * 0.125 + 1.25;
    moon.current.scale.x = moon.current.scale.y = Math.sin(clock.elapsedTime * 0.5) * 0.125 + 1.25;
    sunTl.incrementTicker(getTouchDelta().y * 25);
    moonTl.incrementTicker(getTouchDelta().y * 25);
  });

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
    cvalu1a: "#0079db",
    cstop1a: {
      value: -0.2,
      min: -2,
      max: 2,
      step: 0.01,
    },
    cvalu2a: "#246ce8",
    cstop2a: {
      value: 0.03,
      min: -2,
      max: 2,
      step: 0.01,
    },
    cvalu3a: "#1464b1",
    cstop3a: {
      value: -0.3,
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
    <group>
      <Center ref={sun}>
        <Plane args={[3, 3]}>
          <gradientMaterial {...gradientMaterialConfig} key={GradientMaterial.key} />
        </Plane>
        <Plane args={[8, 2]} position={[0, -0.4, 0]}>
          <gradientMaterial {...gradientMaterialConfig} featherPow1={4} key={GradientMaterial.key} />
        </Plane>
      </Center>
      <Center ref={moon} position={[0, -height, 0]}>
        <Plane args={[3, 3]}>
          <gradientMaterial {...gradientMaterialConfig} key={GradientMaterial.key} />
        </Plane>
        <Plane args={[8, 2]} position={[0, -0.4, 0]}>
          <gradientMaterial {...gradientMaterialConfig} featherPow1={4} key={GradientMaterial.key} />
        </Plane>
      </Center>
    </group>
  );
};

/*
const Satellite = forwardRef((props, ref) => {
  const planeFromToY = [-3.7, 3.7];
  const planeTl = tl(ref, planeFromToY, 0.45, 1.25);
  const wheelData = useWheel();
  const getTouchDelta = useTouchMove();

  useEffect(() => {
    planeTl.incrementTicker(wheelData.deltaY * 0.25);
  }, [wheelData]);

  useFrame(() => {
    planeTl.incrementTicker(getTouchDelta().y * 25);
  });

  return (
    <>
      <Plane ref={ref} {...props}>
        <gradientMaterial featherPow1={4} cvalu2='#ea956b' />
      </Plane>
    </>
  );
});
*/

/*
const Satellites = () => {
  const ref = useRef();
  return <Satellite ref={ref} args={[8, 2]} position={[-0.0125, 0, 1]} />;
};
*/

const Overlay = () => {
  return (
    <div>
      <div className='overlay'>
        Day after day
        <br />
        After day
        <br />_
      </div>
      <div className='scroll-cue'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
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
        <EffectComposer>
          <DisplaceEffect togglePattern={config.togglePattern} />
          <Noise opacity={0.2} />
        </EffectComposer>
        {/* <Satellites /> */}
        <SunMoon />
      </Canvas>
      <Overlay />
      <Leva hidden />
    </>
  );
};

export default App;
