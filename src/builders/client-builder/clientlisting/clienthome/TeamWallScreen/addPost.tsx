import React, { useImperativeHandle, useState, useContext } from "react";
import { useMutation } from "@apollo/client";
import ModalView from "../../../../../components/modal";
import { ADD_RATING, ADD_NOTE } from "./queries";
import AuthContext from "../../../../../context/auth-context";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";

interface Operation {
     id: string;
     type: "create";
}

function CreatePosts(props: any, ref: any) {
     //const last = window.location.pathname.split("/").pop();
     const auth = useContext(AuthContext);

     const Schema: { [name: string]: any } = require("./post.json");
     //const uiSchema: {} = require("./schema.tsx");
     //const [messageDetails, setMessageDetails] = useState<any>({});
     const [operation, setOperation] = useState<Operation>({} as Operation);
     //console.log(operation.id);
     const [createRating] = useMutation(ADD_RATING, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
          },
     });
     const [createNote] = useMutation(ADD_NOTE, {
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

     function CreatePost(frm: any) {
          console.log(frm);
          let searchid: any = frm.packagesearch.split(",");
          let widget: any = JSON.parse(frm.widget);
          console.log(searchid[0]);
          console.log(widget.rpm);
          if (widget.rpm > 0) {
               createRating({
                    variables: {
                         type: "rpm",
                         resource_type: "workout",
                         resource_id: searchid[0],
                         rating: widget.rpm,
                         max_rating: widget.rpm_max,
                         rating_scale_id: widget.rpm_id,
                         user_permissions_user: auth.userid,
                    },
               });
          }
          if (widget.mood > 0) {
               createRating({
                    variables: {
                         type: "mood",
                         resource_type: "workout",
                         resource_id: searchid[0],
                         rating: widget.mood,
                         max_rating: widget.mood_max,
                         rating_scale_id: widget.mood_id,
                         user_permissions_user: auth.userid,
                    },
               });
          }
          if (widget.note) {
               createNote({
                    variables: {
                         type: "workout",
                         resource_id: searchid[0],
                         user_permissions_user: auth.userid,
                         note: widget.note,
                    },
               });
          }
     }

     function OnSubmit(frm: any) {
          switch (operation.type) {
               case "create":
                    CreatePost(frm);
                    break;
          }
     }

     return (
          <>
               {operation.type === "create" && (
                    <ModalView
                         name="Create Post"
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

export default React.forwardRef(CreatePosts);
