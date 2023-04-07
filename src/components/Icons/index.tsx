import React from "react";
import icons from './icons.svg';

const Icon: React.FC<{name: string; width: number; height: number; style?: any;}> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={props.width}
    height={props.height}
    style={props.style}
  >
    <use xlinkHref={`${icons}#${props.name}`} />
  </svg>
);

export default Icon;
