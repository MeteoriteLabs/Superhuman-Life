import React, { useImperativeHandle, useState } from "react";
import { useMutation } from "@apollo/client";
import ModalView from "../../../../../components/modal";
import { ADD_SUGGESTION } from "./queries";
//import AuthContext from "../../../../../context/auth-context";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";

interface Operation {
     id: string;
     type: "create";
}

function CreateSuggestion(props: any, ref: any) {
     const last = window.location.pathname.split("/").pop();
     //  const auth = useContext(AuthContext);
     const Schema: { [name: string]: any } = require("./suggest.json");
     //const uiSchema: {} = require("./schema.tsx");
     //const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);
     //console.log(operation.id);
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
          createSuggestion({
               variables: {
                    fitnesspackage: frm.packagesearch.split(","),
                    users_permissions_user: last,
               },
          });
     }

     function OnSubmit(frm: any) {
          switch (operation.type) {
               case "create":
                    CreateSuggestion(frm);
                    break;
          }
     }

     return (
          <>
               {operation.type === "create" && (
                    <ModalView
                         name="Suggest Package"
                         isStepper={false}
                         formUISchema={schema}
                         formSchema={Schema}
                         //showing={operation.modal_status}
                         formSubmit={(frm: any) => {
                              OnSubmit(frm);
                         }}
                         widgets={widgets}
                         modalTrigger={modalTrigger}
                    />
               )}
          </>
     );
}

export default React.forwardRef(CreateSuggestion);
