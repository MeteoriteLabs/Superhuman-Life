import React, { useContext, useImperativeHandle, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { ADD_CLIENT } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create";
}

function CreateClient(props: any, ref: any) {
     const auth = useContext(AuthContext);
     const ClientSchema: { [name: string]: any } = require("./client.json");
     //const uiSchema: {} = require("./schema.tsx");
     const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);

     const [createClient] = useMutation(ADD_CLIENT, {
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

     function loadData(data: any) {
          // messageSchema["1"].properties.prerecordedtype.enum = [...data.prerecordedtypes].map(n => (n.id));
          // messageSchema["1"].properties.prerecordedtype.enumNames = [...data.prerecordedtypes].map(n => (n.name));
          // messageSchema["1"].properties.prerecordedtrigger.enum = [...data.prerecordedtriggers].map(n => (n.id));
          // messageSchema["1"].properties.prerecordedtrigger.enumNames = [...data.prerecordedtriggers].map(n => (n.name));
     }

     function FillDetails(data: any) {
          // let details: any = {};
          // let msg = data.prerecordedmessage;
          // console.log(msg)
          // //debugger
          // details.title = msg.title;
          // details.prerecordedtype = msg.prerecordedtype.id;
          // details.prerecordedtrigger = msg.prerecordedtrigger.id;
          // details.description = msg.description;
          // details.minidesc = msg.minidescription;
          // details.mediaurl = msg.mediaurl;
          // details.file = msg.mediaupload.id;
          // details.status = msg.status;
          // details.image = msg.upload;
          // setMessageDetails(details);

          OnSubmit(null);
     }

     function CreateClient(frm: any) {
          createClient({ variables: frm });
     }

     function OnSubmit(frm: any) {
          if (frm) {
               frm.user_permissions_user = auth.userid;
          }

          switch (operation.type) {
               case "create":
                    CreateClient(frm);
                    break;
          }
     }

     //FetchData();

     return (
          <>
               {operation.type === "create" && (
                    <ModalView
                         name="New Client"
                         isStepper={false}
                         formUISchema={schema}
                         formSchema={ClientSchema}
                         showing={operation.modal_status}
                         formSubmit={(frm: any) => {
                              OnSubmit(frm);
                         }}
                         formData={messageDetails}
                         widgets={widgets}
                         modalTrigger={modalTrigger}
                    />
               )}
               {/* {operation.type === "delete" && (
                    <StatusModal
                         modalTitle="Delete"
                         modalBody="Do you want to delete this message?"
                         buttonLeft="Cancel"
                         buttonRight="Yes"
                         onClick={() => {}}
                    />
               )} */}
          </>
     );
}

export default React.forwardRef(CreateClient);
