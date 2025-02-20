import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const GradientMaterial = shaderMaterial(
  {
    time: 0,
    cstop1: new THREE.Color().setRGB(0.99, 0.96, 0.88),
    cstop2: new THREE.Color().setRGB(0.75, 0.2, 0.1),
    cstop3: new THREE.Color().setRGB(0.93, 0.41, 0.2),
  },
  // vert
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // frag
  /*glsl*/ `
    uniform float time;
    uniform vec3 cstop1;
    uniform vec3 cstop2;
    uniform vec3 cstop3;
    varying vec2 vUv;

    vec3 getGradient(vec4 c1, vec4 c2, vec4 c3, float value_) {
      float blend1 = smoothstep(c1.w, c2.w, value_);
      float blend2 = smoothstep(c2.w, c3.w, value_);

      vec3 col = mix(c1.rgb, c2.rgb, blend1);
      col = mix(col, c3.rgb, blend2);

      return col;
    }
  
    void main() {
      float feather = pow(1.0 - distance(vUv, vec2(0.5)), 1.3);
		  feather = pow(smoothstep(.5, .6, feather) * 1., 3.5);

      vec4 cstop1 = vec4(cstop1, -0.7);
      vec4 cstop2 = vec4(cstop2, 0.2);
      vec4 cstop3 = vec4(cstop3, 0.5);

      vec3 gradient = getGradient(cstop1, cstop2, cstop3, vUv.x - vUv.y); 

      gl_FragColor = vec4(gradient, feather);
      //gl_FragColor = vec4((vUv.x + vUv.y) * .7, vUv.y * vUv.x, 0., feather);
    }
  `,
  self => {
    self.side = THREE.DoubleSide;
    self.transparent = true;
  }
);

export default GradientMaterial;
