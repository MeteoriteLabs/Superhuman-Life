import React, { useImperativeHandle, useState } from "react";
import { useMutation } from "@apollo/client";
import ModalView from "../../../../../components/modal";
import { ADD_SUGGESTION } from "./queries";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";

interface Operation {
     id: string;
     type: "create";
}

function CreateSuggestion(props: any, ref: any) {
     const last = window.location.pathname.split("/").pop();
     const Schema: { [name: string]: any } = require("./suggest.json");
     //const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);
     const [createSuggestion] = useMutation(ADD_SUGGESTION, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               if (msg && !msg.id) {
                    modalTrigger.next(true);
               }
          },
     }));

     function CreateSuggestion(frm: any) {
          //console.log(frm);
          let searchid: any = frm.packagesearch.split(",");
          for (let i = 0; i < searchid.length; i++) {
               createSuggestion({
                    variables: {
                         fitnesspackage: searchid[i],
                         id: last,
                    },
               });
          }
     }
     function OnSubmit(frm: any) {
          console.log(operation.type);
          CreateSuggestion(frm);
     }

     return (
          <>
               <ModalView
                    name="create"
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={Schema}
                    //showing={operation.modal_status}
                    formSubmit={(frm: any) => {
                         OnSubmit(frm);
                    }}
                    //formData={messageDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
               />
          </>
     );
}

export default React.forwardRef(CreateSuggestion);
