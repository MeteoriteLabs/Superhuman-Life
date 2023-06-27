const MobileIcon = ({
    width,
    height
}: {
    width: string | number
    height: string | number
}): JSX.Element => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="20" height="31" fill="#E5E5E5" />
            <g clipPath="url(#clip0_201_9)">
                <rect width="1717" height="2242" transform="translate(-46 -188)" fill="#2E2E2E" />
                <rect x="-48" y="-124" width="334" height="2166" fill="#2E2E2E" />
                <path
                    d="M17.8378 0H2.16216C0.969595 0 0 0.969595 0 2.16216V28.1081C0 29.3007 0.969595 30.2703 2.16216 30.2703H17.8378C19.0304 30.2703 20 29.3007 20 28.1081V2.16216C20 0.969595 19.0304 0 17.8378 0ZM10 25.7432C9.25338 25.7432 8.64865 25.1385 8.64865 24.3919C8.64865 23.6453 9.25338 23.0405 10 23.0405C10.7466 23.0405 11.3514 23.6453 11.3514 24.3919C11.3514 25.1385 10.7466 25.7432 10 25.7432Z"
                    fill="#F2F2F2"
                />
            </g>
            <defs>
                <clipPath id="clip0_201_9">
                    <rect width="1717" height="2242" fill="white" transform="translate(-46 -188)" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default MobileIcon
