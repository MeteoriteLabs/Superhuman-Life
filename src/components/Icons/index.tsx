import icons from './icons.svg';

const Icon = ({ name, ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={24}
    height={24}
    {...rest}
  >
    <use xlinkHref={`${icons}#${name}`} />
  </svg>
);

export default Icon;