import React, { useState, useImperativeHandle } from "react";
import ModalView from "../../components/modal";
import { schema } from "./webpageSchema";
import { Subject } from "rxjs";

interface Operation {
  id: string;
  type: "create" | "edit" | "view";
  current_status: boolean;
}

function CreateWebpageDetails(ref: any) {
  const [webpageDetails, setWebpagDetails] = useState<any>({});
  const [operation, setOperation] = useState<Operation>({} as Operation);

  const webPageSchema: { [name: string]: any } = require("./webpage.json");

  console.log(webPageSchema);

  let name = "Webpage Details";

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      debugger;
      setOperation(msg);

      if (msg && !msg.id)
        //render form if no message id
        modalTrigger.next(true);
    },
  }));

  // modalTrigger.next(true);

  // const FillWebpageDetails = () => {
  //   let details: any = {};

  //   setWebpagDetails(details);
  // };
  // FillWebpageDetails();

  return (
    <>
      <ModalView
        name={name}
        isStepper={true}
        stepperValues={[
          "Intro Page",
          "About",
          "Programs",
          "Contact",
          "Social Media",
        ]}
        //formSubmit={() => modalTrigger.next(true)}
        formUISchema={schema}
        formSchema={webPageSchema}
        // widgets={null}
        formData={webpageDetails}
        modalTrigger={modalTrigger}
      />
    </>
  );
}

export default React.forwardRef(CreateWebpageDetails);
