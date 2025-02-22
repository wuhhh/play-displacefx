import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Plane, OrbitControls, Sparkles } from "@react-three/drei";
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

  const wheelDelta = useWheel();
  const getTouchDelta = useTouchMove();

  useFrame(({ clock }, _delta) => {
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 1 - 0.3;
    ref.current.scale.x = ref.current.scale.y = Math.sin(clock.elapsedTime * 1.1) * 0.125 + 1.25;
    //ref.current.rotation.z += delta;
    //console.log("Wheel delta:", wheelDelta);
    //console.log("Touch delta:", getTouchDelta());
    //ref.current.position.y += wheelDelta * 0.0005;
  });

  const config = useControls("scene", {
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
        <gradientMaterial {...config} key={GradientMaterial.key} />
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
