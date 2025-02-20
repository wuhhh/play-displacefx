import React, { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";

const fragmentShader = `
  float displace(in vec2 uv) {          
    float optimalResolutionHeight = 968. * 2.;
    float optimalStripes = 20.;
    float optimalRatio = optimalStripes / optimalResolutionHeight;
    float nstripes = optimalRatio * resolution.y;

    float displacePattern = mod(uv.y * nstripes, 1.); // 0..1 repeated
	  displacePattern = 1. - pow(abs(displacePattern * 2. - 1.), 2.); // stripes   
          
    return displacePattern;
  }

  vec2 dir(in vec2 uv) {
    // -1., 0. or 1. depending on where the point is on a central axis
    return vec2(sign(uv.x - .5), sign(uv.y - .5));
  }
  
  void mainUv(inout vec2 uv) {  
    float displacePattern = displace(uv) - .5;
    float displaceStr = .1;
    //vec2 dir = dir(uv);

    // accommodate stretching and keep centred
    uv /= 1. + displaceStr; 
    uv += displaceStr * .5;

    float d = displacePattern * displaceStr;
    uv = vec2(uv.x, uv.y + d);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float displacePattern = displace(vUv);
    //float displaceStr = .04;
    //vec2 dir = dir(uv);
      
    outputColor = vec4(vec3(inputColor.rgb), .1);
    //outputColor = vec4(inputColor.rgb * displacePattern, 1.);
  }
`;

// Effect implementation
class DisplaceEffectImpl extends Effect {
  constructor() {
    super("DisplaceEffect", fragmentShader);
  }
}

// Effect component
export const DisplaceEffect = forwardRef(({ }, ref) => {
  const effect = useMemo(() => new DisplaceEffectImpl(), []);
  return <primitive ref={ref} object={effect} dispose={null} />;
});
