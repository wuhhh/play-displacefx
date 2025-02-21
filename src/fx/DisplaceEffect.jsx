import React, { forwardRef, useMemo } from "react";
import { Uniform } from "three";
import { Effect } from "postprocessing";

const fragmentShader = `
  uniform bool togglePattern;

  float displace(in vec2 uv) {          
    float optimalResolutionHeight = 968. * 2.;
    float optimalStripes = 20.;
    float optimalRatio = optimalStripes / optimalResolutionHeight;
    float nstripes = optimalRatio * resolution.y;

    float displacePattern = mod(uv.y * nstripes, 1.); // 0..1 repeated
	  displacePattern = 1. - pow(abs(displacePattern * 2. - 1.), 2.); // stripes   

    // Distort the pattern with gentle waves 
    displacePattern += sin(uv.x * 50.0) * .1 * (1. - smoothstep(.01, .09, pow((distance(vec2(uv.x, uv.y * 1.19), vec2((sin(time * .5) * .1) + .6, (cos(time * .2) * .2) + .45)) * .7), 2.)));
    displacePattern += sin(uv.x * 40.0) * .12 * (1. - smoothstep(.0, .02, pow((distance(vec2(uv.x, uv.y), vec2((sin(time) * .1) + .2, (cos(time) * .2) + .7)) * .5), 2.)));
    displacePattern += sin(uv.x * 3.0) * -.4 * (1. - smoothstep(.0, .3, pow((distance(vec2(uv.x, uv.y), vec2(.5,.8)) * .3), 2.)));
      
    return displacePattern;
  }

  vec2 dir(in vec2 uv) {
    // -1., 0. or 1. depending on where the point is on a central axis
    return vec2(sign(uv.x - .5), sign(uv.y - .5));
  }
  
  void mainUv(inout vec2 uv) {  
    float displacePattern = displace(uv);
    float displaceStr = .1;
    //vec2 dir = dir(uv);

    // accommodate stretching and keep centred
    uv /= 1. + displaceStr; 
    uv.x += displaceStr * .5;

    float d = displacePattern * displaceStr;
    uv = vec2(uv.x, uv.y + d);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float displacePattern = displace(vUv);
    //float displaceStr = .04;
    //vec2 dir = dir(uv);
    
    outputColor = togglePattern ? vec4(vec3(displacePattern), 1.) : vec4(vec3(inputColor.rgb), .1);
    //outputColor = vec4(inputColor.rgb * displacePattern, 1.);
  }
`;

let _uTogglePattern;

// Effect implementation
class DisplaceEffectImpl extends Effect {
  constructor(togglePattern) {
    super("DisplaceEffect", fragmentShader, {
      uniforms: new Map([["togglePattern", new Uniform(togglePattern)]]),
    });

    _uTogglePattern = togglePattern;
  }
}

// Effect component
export const DisplaceEffect = forwardRef(({ togglePattern }, ref) => {
  const effect = useMemo(() => new DisplaceEffectImpl(togglePattern), [togglePattern]);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
