import React, { useImperativeHandle, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../../../components/modal";
import { ADD_GOAL_NEW, GET_GOALS_DETAILS_NEW, UPDATE_GOALS_NEW } from "./queries";
import AuthContext from "../../../../../context/auth-context";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";
import { flattenObj } from "../../../../../components/utils/responseFlatten";

interface Operation {
     id: string;
     type: "create" | "edit";
}

function CreateGoal(props: any, ref: any) {
     const last = window.location.pathname.split("/").pop();
     const auth = useContext(AuthContext);
     const GoalSchema: { [name: string]: any } = require("./forms/goal.json");
     const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);
     const [createGoal]: any = useMutation(ADD_GOAL_NEW, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
          },
     });
     const [editMessage]: any = useMutation(UPDATE_GOALS_NEW, {
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

     function FillDetails(data: any) {
          const flattenData = flattenObj({...data});
          const details: any = {};
          const msg = flattenData.userGoals;
          const o = { ...operation };
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

     useQuery(GET_GOALS_DETAILS_NEW, {
          variables: { id: operation.id },
          skip: !operation.id,
          onCompleted: (e: any) => {
               FillDetails(e);
          },
     });

     function CreateGoal(frm: any) {
          const assignedByArray: any = [];
          assignedByArray.push(auth.userid);

          createGoal({
               variables: {
                    goals: frm.packagesearch.split(","),
                    assignedBy: assignedByArray,
                    start: frm.startdate,
                    end: frm.enddate,
                    users_permissions_user: last,
               },
          });
     }
     function EditMessage(frm: any) {
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
          if (frm) frm.user_permissions_user = auth.userid;
          if (frm.name === "edit" || frm.name === "view") {
               if (frm.name === "edit") {
                    EditMessage(frm);
               }
          } else {
               CreateGoal(frm);
          }
     }
     return (
          <>
               <ModalView
                    name={operation.type}
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={GoalSchema}
                    formSubmit={(frm: any) => {
                         OnSubmit(frm);
                    }}
                    formData={messageDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
               />
          </>
     );
}

export default React.forwardRef(CreateGoal);
