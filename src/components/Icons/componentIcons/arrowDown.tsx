function ArrowDown({ width, height }: { width: number; height: number }): JSX.Element {
  return (
    <svg
      width={width || 8}
      height={height || 4}
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.54541 0.50546L7.03422 -2.23447e-08L3.90425 3.00399L3.57045 2.68364L3.5724 2.68546L0.791505 0.0163682L0.272684 0.514182C1.04105 1.252 3.1868 3.31164 3.90425 4C4.43734 3.48873 3.91777 3.98728 7.54541 0.50546Z"
        fill="white"
      />
    </svg>
  );
}

export default ArrowDown;
