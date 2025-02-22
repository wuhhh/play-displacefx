import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

const GradientMaterial = shaderMaterial(
  {
    time: 0,
    featherPow1: 1.18,
    featherSmoothOut: 0.83,
    featherPow2: 1.62,
    cstop1: -0.7,
    cstop2: 0.2,
    cstop3: 0.5,
    cstop1a: -0.7,
    cstop2a: 0.2,
    cstop3a: 0.5,
    cvalu1: new THREE.Color().setRGB(0.99, 0.96, 0.88),
    cvalu2: new THREE.Color().setRGB(0.75, 0.2, 0.1),
    cvalu3: new THREE.Color().setRGB(0.93, 0.41, 0.2),
    cvalu1a: new THREE.Color().setRGB(0.99, 0.96, 0.88),
    cvalu2a: new THREE.Color().setRGB(0.75, 0.2, 0.1),
    cvalu3a: new THREE.Color().setRGB(0.93, 0.41, 0.2),
    daynightMix: 0,
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
    uniform float featherPow1;
    uniform float featherSmoothOut;
    uniform float featherPow2;
    uniform float cstop1;
    uniform vec3 cvalu1;
    uniform float cstop2;
    uniform vec3 cvalu2;
    uniform float cstop3;
    uniform vec3 cvalu3;
    uniform float cstop1a;
    uniform vec3 cvalu1a;
    uniform float cstop2a;
    uniform vec3 cvalu2a;
    uniform float cstop3a;
    uniform vec3 cvalu3a;
    uniform float daynightMix;
    varying vec2 vUv;

    vec3 getGradient(vec4 c1, vec4 c2, vec4 c3, float value_) {
      float blend1 = smoothstep(c1.w, c2.w, value_);
      float blend2 = smoothstep(c2.w, c3.w, value_);

      vec3 col = mix(c1.rgb, c2.rgb, blend1);
      col = mix(col, c3.rgb, blend2);

      return col;
    }
  
    void main() {
      float feather = pow(1.0 - distance(vUv, vec2(0.5)), featherPow1);
		  feather = pow(smoothstep(.5, featherSmoothOut, feather) * 1., featherPow2);

      vec4 cvalu1 = vec4(cvalu1, cstop1);
      vec4 cvalu2 = vec4(cvalu2, cstop2);
      vec4 cvalu3 = vec4(cvalu3, cstop3);
      vec4 cvalu1a = vec4(cvalu1a, cstop1a);
      vec4 cvalu2a = vec4(cvalu2a, cstop2a);
      vec4 cvalu3a = vec4(cvalu3a, cstop3a);

      vec3 day = getGradient(cvalu1, cvalu2, cvalu3, vUv.x - vUv.y); 
      vec3 night = getGradient(cvalu1a, cvalu2a, cvalu3a, vUv.x - vUv.y); 

      gl_FragColor = vec4(mix(day, night, daynightMix), feather);
      //gl_FragColor = vec4((vUv.x + vUv.y) * .7, vUv.y * vUv.x, 0., feather);
    }
  `,
  self => {
    self.side = THREE.DoubleSide;
    self.transparent = true;
  }
);

export default GradientMaterial;
