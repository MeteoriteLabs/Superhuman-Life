import React from "react";
import Icons from "../Icons";

const DrawerTrigger: React.FC<{ toggle: any }> = (props) => {
  return (
    <Icons
      name="unreadeye"
      onClick={props.toggle}
      style={{ cursor: "pointer" }}
    />
  );
};

export default DrawerTrigger;
