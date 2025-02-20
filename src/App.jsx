import React, { useRef } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Circle, OrbitControls } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { useControls } from "leva";
import { DisplaceEffect } from "./fx/DisplaceEffect";
import GradientMaterial from "./materials/GradientMaterial";
extend({ GradientMaterial });

const Scene = () => {
  const ref = useRef();

  useFrame(({ clock }, delta) => {
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 2;
    ref.current.scale.x = ref.current.scale.y = Math.sin(clock.elapsedTime * 0.1) * 0.5 + 1;
    //ref.current.rotation.z += delta;
  });

  const config = useControls("scene", {
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
  const config = useControls("app", {
    togglePattern: {
      label: "toggle pattern",
      value: false,
    },
  });

  return (
    <>
      <Canvas orthographic flat linear camera={{ fov: 70, position: [0, 0, 3], zoom: 200 }}>
        <OrbitControls />
        <EffectComposer>
          <DisplaceEffect togglePattern={config.togglePattern} />
          <Noise opacity={0.2} />
        </EffectComposer>
        <Scene />
      </Canvas>
    </>
  );
};

export default App;
