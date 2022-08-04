import React, { useImperativeHandle, useState } from "react";
import { useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { ADD_CLIENT_NEW } from "./queries";
//import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create" | "delete";
}

function CreateClient(props: any, ref: any) {
     //const auth = useContext(AuthContext);
     const ClientSchema: { [name: string]: any } = require("./client.json");
     //const uiSchema: {} = require("./schema.tsx");
     //const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);

     const [createClient] = useMutation(ADD_CLIENT_NEW, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
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

     //function loadData(data: any) {
     // messageSchema["1"].properties.prerecordedtype.enum = [...data.prerecordedtypes].map(n => (n.id));
     // messageSchema["1"].properties.prerecordedtype.enumNames = [...data.prerecordedtypes].map(n => (n.name));
     // messageSchema["1"].properties.prerecordedtrigger.enum = [...data.prerecordedtriggers].map(n => (n.id));
     // messageSchema["1"].properties.prerecordedtrigger.enumNames = [...data.prerecordedtriggers].map(n => (n.name));
     //}

     //  function FillDetails(data: any) {
     //       let details: any = {};
     //       let msg = data.UsersPermissionsUser;
     //       console.log(msg);
     //       //debugger
     //       details.firstname = msg.username;
     //       details.email = msg.email;
     //       details.phone = msg.phone;
     //       setMessageDetails(details);

     //       OnSubmit(null);
     //  }

     function CreateClient(frm: any) {
          console.log(frm);
          let userName = frm.firstname.slice(0, 1) + " " + frm.lastname;
          createClient({
               variables: {
                    username: userName,
                    firstname: frm.firstname,
                    lastname: frm.lastname,
                    email: frm.email,
                    phone: frm.phone,
               },
          });
     }

     function DeleteClient(id: any) {
          // deleteClient({ variables: { id: id } });
     }

     function OnSubmit(frm: any) {
          //   if (frm) {
          //        frm.user_permissions_user = auth.userid;
          //   }

          switch (operation.type) {
               case "create":
                    CreateClient(frm);
                    break;
          }
     }

     //FetchData();
     // mutation client($username: String!, $firstname: String, $lastname: String, $email: String!, $phone: String) {
     //      createUser(
     //           input: {
     //                data: {
     //                     username: $username
     //                     Firstname: $firstname
     //                     Lastname: $lastname
     //                     email: $email
     //                     Phone: $phone
     //                     role: "2"
     //                }
     //           }
     //      ) {
     //           user {
     //                id
     //                createdAt
     //                updatedAt
     //                username
     //                Phone
     //                email
     //           }
     //      }
     // }



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
                         //  formData={messageDetails}
                         widgets={widgets}
                         modalTrigger={modalTrigger}
                    />
               )}
               {operation.type === "delete" && (
                    <StatusModal
                         modalTitle="Delete"
                         modalBody="Do you want to delete this message?"
                         buttonLeft="Cancel"
                         buttonRight="Yes"
                         onClick={() => { DeleteClient(operation.id) }}
                    />
               )}
          </>
     );
}

export default React.forwardRef(CreateClient);
