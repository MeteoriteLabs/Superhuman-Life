const OfferingsDisaplyImage = (props: any) => {
  return (
    <img
      src={`./assets/offeringImages/${props.packageType
        ?.replaceAll(" ", "-")
        ?.toLowerCase()}-${
        props?.mode === null ? "Online" : props.mode?.toLowerCase()
      }.svg`}
      alt={`${props.packageType}-${props.mode}`}
    />
  );
};

export default OfferingsDisaplyImage;
