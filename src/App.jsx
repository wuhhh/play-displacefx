import React, { useRef } from "react";
import * as THREE from "three";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Circle, Plane, OrbitControls } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { useControls } from "leva";
import { DisplaceEffect } from "./fx/DisplaceEffect";
import GradientMaterial from "./materials/GradientMaterial";

extend({ GradientMaterial });

const Scene = () => {
  const ref = useRef();

  useFrame((_, delta) => {
    //ref.current.rotation.x += delta * 1.2;
    //ref.current.rotation.y += delta * 0.3;
    //ref.current.rotation.z += delta * 1.4;
  });

  const config = useControls("settings", {
    cstop1: "#fcefdc",
    cstop2: "#f17f44",
    cstop3: "#c93c1e",
  });

  return (
    <Circle ref={ref} args={[1.5, 64]}>
      <gradientMaterial {...config} key={GradientMaterial.key} />
    </Circle>
  );
};

const App = () => {
  return (
    <>
      <Canvas orthographic flat linear camera={{ fov: 70, position: [0, 0, 3], zoom: 200 }}>
        <OrbitControls />
        <EffectComposer>
          <DisplaceEffect />
          <Noise opacity={0.2} />
        </EffectComposer>
        <Scene />
      </Canvas>
    </>
  );
};

export default App;
