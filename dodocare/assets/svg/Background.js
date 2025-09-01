import * as React from 'react';
import Svg, { Defs, Pattern, Use, Rect, Path, G, ClipPath } from 'react-native-svg';

const Background = (props) => (
  <Svg width="412" height="917" viewBox="0 0 412 917" fill="none" {...props}>
    <Defs>
      <Pattern id="pattern0_269_380" patternContentUnits="objectBoundingBox" width="1" height="1">
        <Use xlinkHref="#image0_269_380" transform="scale(0.00130208)" />
      </Pattern>
      <ClipPath id="clip0_269_380">
        <Rect width="412" height="917" fill="white" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip0_269_380)">
      <Rect width="412" height="917" fill="white" />
      <Rect x="-98" y="-36" width="456" height="448" fill="url(#pattern0_269_380)" />
      <Path d="M0 367.259L231 322.466L412 120V917H0V367.259Z" fill="#2D3748" />

    </G>
  </Svg>
);

export default Background;
