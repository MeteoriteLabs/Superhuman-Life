import React, { useImperativeHandle, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../../../components/modal";
import { ADD_GOAL, UPDATE_GOALS, GET_GOALS_DETAILS } from "./queries";
import AuthContext from "../../../../../context/auth-context";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";

interface Operation {
     id: string;
     type: "create" | "edit";
}

function CreateGoal(props: any, ref: any) {
     const last = window.location.pathname.split("/").pop();
     const auth = useContext(AuthContext);
     const GoalSchema: { [name: string]: any } = require("./forms/goal.json");
     //const uiSchema: {} = require("./schema.tsx");
     const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);

     const [createGoal] = useMutation(ADD_GOAL, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });
     const [editMessage] = useMutation(UPDATE_GOALS, {
          variables: { messageid: operation.id },
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

     function FillDetails(data: any) {
          let details: any = {};
          //   let msg = data.prerecordedmessage;
          //   console.log(msg);
          //   //debugger
          //   details.title = msg.title;
          //   details.prerecordedtype = msg.prerecordedtype.id;
          //   details.prerecordedtrigger = msg.prerecordedtrigger.id;
          //   details.description = msg.description;
          //   details.minidesc = msg.minidescription;
          //   details.mediaurl = msg.mediaurl;
          //   details.file = msg.mediaupload.id;
          //   details.status = msg.status;
          //   details.image = msg.upload;

          setMessageDetails(details);

          if (["edit"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
     }

     function FetchData() {
          useQuery(GET_GOALS_DETAILS, {
               variables: { id: operation.id },
               skip: !operation.id,
               onCompleted: (e: any) => {
                    FillDetails(e);
               },
          });
     }

     function CreateGoal(frm: any) {
          //console.log(frm);

          createGoal({
               variables: {
                    goals: frm.packagesearch.split(","),
                    assignedBy: auth.userid,
                    start: frm.startdate,
                    end: frm.enddate,
                    users_permissions_user: last,
               },
          });
     }
     function EditMessage(frm: any) {
          editMessage({ variables: frm });
     }

     function OnSubmit(frm: any) {
          switch (operation.type) {
               case "create":
                    CreateGoal(frm);
                    break;
               case "edit":
                    EditMessage(frm);
                    break;
          }
     }
     FetchData();
     return (
          <>
               {operation.type === "create" && (
                    <ModalView
                         name="New Goal"
                         isStepper={false}
                         formUISchema={schema}
                         formSchema={GoalSchema}
                         //showing={operation.modal_status}
                         formSubmit={(frm: any) => {
                              OnSubmit(frm);
                         }}
                         widgets={widgets}
                         modalTrigger={modalTrigger}
                    />
               )}
               {operation.type === "edit" && (
                    <ModalView
                         name="Edit"
                         isStepper={false}
                         formUISchema={schema}
                         formSchema={GoalSchema}
                         //showing={operation.modal_status}
                         formSubmit={(frm: any) => {
                              OnSubmit(frm);
                         }}
                         formData={messageDetails}
                         widgets={widgets}
                         modalTrigger={modalTrigger}
                    />
               )}
          </>
     );
}

export default React.forwardRef(CreateGoal);
