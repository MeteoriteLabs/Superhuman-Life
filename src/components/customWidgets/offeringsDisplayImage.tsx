import React from 'react';

const OfferingsDisaplyImage = (props: any) => {

     console.log(props);

     return (
          <img src={`./assets/offeringsImages/${props.packageType.replaceAll(" ","-")}-${props.mode}.svg`} alt={`${props.packageType}-${props.mode}`} />
     );
};

export default OfferingsDisaplyImage;