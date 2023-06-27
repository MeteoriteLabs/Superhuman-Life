import React from 'react';

const OfferingsDisaplyImage: React.FC<{ packageType: string; mode: string }> = (props) => {
    return props?.packageType === 'Classic Class' ? (
        <img src="./assets/offeringImages/classic-class-online.svg" alt={`${props.packageType}`} />
    ) : (
        <img
            src={`./assets/offeringImages/${props.packageType
                ?.replaceAll(' ', '-')
                ?.toLowerCase()}-${
                props?.mode === null ? 'Online' : props.mode?.toLowerCase()
            }.svg`}
            alt={`${props.packageType}-${props.mode}`}
        />
    );
};

export default OfferingsDisaplyImage;
