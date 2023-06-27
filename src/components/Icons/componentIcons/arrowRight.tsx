function ArrowRight({ width, height }: { width?: number; height?: number }): JSX.Element {
    return (
        <svg
            width={width || 7}
            height={height || 11}
            viewBox="0 0 7 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.49193 11L6.25012 10.2332L1.74413 5.53826L2.22467 5.03755L2.22194 5.04048L6.22557 0.86914L5.47885 0.0909087C4.37212 1.24345 1.28267 4.46208 0.250122 5.53826C1.01703 6.3379 0.269205 5.55854 5.49193 11Z"
                fill="white"
            />
        </svg>
    );
}

export default ArrowRight;
