import React from 'react';

const OfferingsDisaplyImage = (props: any) => {

     console.log(props);
     debugger;
     
     return (
          <img src={`./assets/offeringsImages/${props.packageType.replace(" ","-")}-${props.mode}.svg`} alt={`${props.packageType}-${props.mode}`} />
     );
};

export default OfferingsDisaplyImage;