import Svg, { Polygon, Line, Rect, Circle, Path } from 'react-native-svg';

export const DoNotBleachIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Polygon
      points="12,3 22,21 2,21"
      stroke="#8A8A8F"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Line x1="7" y1="11" x2="17" y2="19" stroke="#8A8A8F" strokeWidth="1.5" />
    <Line x1="17" y1="11" x2="7" y2="19" stroke="#8A8A8F" strokeWidth="1.5" />
  </Svg>
);

export const DoNotTumbleDryIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="#8A8A8F"
      strokeWidth="2"
    />
    <Circle cx="12" cy="12" r="6" stroke="#8A8A8F" strokeWidth="1.5" />
    <Line x1="5" y1="5" x2="19" y2="19" stroke="#8A8A8F" strokeWidth="1.5" />
    <Line x1="19" y1="5" x2="5" y2="19" stroke="#8A8A8F" strokeWidth="1.5" />
  </Svg>
);

export const DryCleanIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#8A8A8F" strokeWidth="2" />
    <Path d="M7 17 H17" stroke="#8A8A8F" strokeWidth="1.5" />
  </Svg>
);

export const IronIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17 H21 L19 11 C18 9 16 8 14 8 H7 C5 8 4 9 3 11 Z"
      stroke="#8A8A8F"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path
      d="M7 8 V5 H15 V8"
      stroke="#8A8A8F"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Circle cx="8" cy="13" r="1" fill="#8A8A8F" />
  </Svg>
);
