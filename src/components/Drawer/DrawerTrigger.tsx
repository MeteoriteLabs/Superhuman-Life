import React from "react";
import Icons from "../Icons";

const DrawerTrigger: React.FC<{ toggle: () => void}> = (props) => {
  return (
    <div onClick={props.toggle}>
    <Icons
      name="unreadeye"
      style={{ cursor: "pointer" }}
    />
    </div>
  );
};

export default DrawerTrigger;
