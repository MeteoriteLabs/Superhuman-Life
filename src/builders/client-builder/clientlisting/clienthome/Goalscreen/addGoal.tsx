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
     //console.log(operation.id);
     const [createGoal]: any = useMutation(ADD_GOAL, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });
     const [editMessage]: any = useMutation(UPDATE_GOALS, {
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
          let msg = data.userGoals;
          // console.log(
          //      msg[0].goals.map((val: any) => {
          //           return val.name;
          //      })
          // );
          let o = { ...operation };
          details.name = o.type.toLowerCase();
          details.packagesearch = msg[0].goals[0];
          details.startdate = msg[0].start;
          details.enddate = msg[0].end;
          details.messageid = msg[0].id;

          setMessageDetails(details);
          setOperation({} as Operation);

          if (["edit"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
     }

     useQuery(GET_GOALS_DETAILS, {
          variables: { id: operation.id },
          skip: !operation.id,
          onCompleted: (e: any) => {
               FillDetails(e);
          },
     });

     function CreateGoal(frm: any) {
          console.log(frm);

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
          console.log(frm);
          //editMessage({ variables: frm });
          editMessage({
               variables: {
                    goals: frm.packagesearch.split(","),
                    assignedBy: auth.userid,
                    start: frm.startdate,
                    end: frm.enddate,
                    users_permissions_user: last,
                    messageid: frm.messageid,
               },
          });
     }

     function OnSubmit(frm: any) {
          console.log(frm);
          console.log(frm.name);
          if (frm) frm.user_permissions_user = auth.userid;
          if (frm.name === "edit" || frm.name === "view") {
               if (frm.name === "edit") {
                    EditMessage(frm);
               }
          } else {
               CreateGoal(frm);
          }
     }
     //FetchData();
     return (
          <>
               <ModalView
                    name={operation.type}
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
               {/* {operation.type === "create" && (
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
               )} */}
          </>
     );
}

export default React.forwardRef(CreateGoal);
