import * as React from "react";
import Svg, { Path, G, ClipPath, Defs, Rect } from "react-native-svg";

const Background2 = (props) => (
  <Svg
    width={412}
    height={917}
    viewBox="0 0 412 917"
    fill="none"
    {...props}
  >
    <Defs>
      <ClipPath id="clip0">
        <Rect width="412" height="917" fill="#fff" />
      </ClipPath>
    </Defs>

    <G clipPath="url(#clip0)">
      <Path fill="#2D3748" d="M0 0h412v917H0z" />
      <Path
        fill="#fff"
        d="M-7 0h419v97.519H295.593c-3.723 0-7.44.297-11.115.888L205 111.19 99.137 141.004A80 80 0 0 1 77.45 144H-7z"
      />
    </G>
  </Svg>
);

export default Background2;
