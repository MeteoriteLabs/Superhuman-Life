import React, { useImperativeHandle, useState, useContext } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../../../components/modal";
import {
     ADD_RATING,
     ADD_NOTE,
     DELETE_COMMENT,
     DELETE_NOTE,
     GET_NOTES_BYID,
     DELETE_RATING,
     GET_RATING_NOTES_BYID,
} from "./queries";
import AuthContext from "../../../../../context/auth-context";
import { Subject } from "rxjs";
import { schema, widgets } from "./schema";
import StatusModal from "../../../../../components/StatusModal/StatusModal";

interface Operation {
     id: string;
     type: "create" | "deleteNote" | "deleteComment" | "editNote";
     comments: any;
     resourceid: any;
}

function CreatePosts(props: any, ref: any) {
     const last = window.location.pathname.split("/").pop();
     const auth = useContext(AuthContext);

     const Schema: { [name: string]: any } = require("./post.json");
     //const uiSchema: {} = require("./schema.tsx");
     const [messageDetails, setMessageDetails] = useState<any>({});

     const [deletion, setDeletion] = useState<any>(null);
     // const [resourceid, setresourceid] = useState<any>(null);

     const [operation, setOperation] = useState<Operation>({} as Operation);

     // const GET_GOALLIST = gql`
     //      query TagListQuery($id: ID) {
     //           workouts(sort: "updatedAt", where: { id: $id }) {
     //                id
     //                workouttitle
     //           }
     //      }
     // `;

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
     const [deleteNote] = useMutation(DELETE_NOTE, {});
     const [deleteComment] = useMutation(DELETE_COMMENT, {});
     const [deleteRating] = useMutation(DELETE_RATING, {});

     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               if (msg && !msg.id) {
                    modalTrigger.next(true);
               }
          },
     }));
     useQuery(GET_NOTES_BYID, {
          variables: { id: operation.id },
          skip: !operation.id || operation.type === "deleteNote" || operation.type === "deleteComment",
          onCompleted: (e: any) => {
               FillDetails(e);
          },
     });

     function FillDetails(data: any) {
          let details: any = {};
          let msg = data.feedbackNotes[0];
          //console.log(msg.resource_id);
          // setresourceid(msg.resource_id);

          let o = { ...operation };
          details.name = o.type.toLowerCase();
          //console.log(o.type);
          console.log(msg);

          details.packagesearch = msg.resource_id;

          //details.messageid = msg.id;

          console.log(details);

          setMessageDetails(details);
          setOperation({} as Operation);

          if (["editNote"].indexOf(operation.type) > -1) modalTrigger.next(true);
          else OnSubmit(null);
     }

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
                         clientid: last,
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
                         clientid: last,
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
                         clientid: last,
                    },
               });
          }
     }

     // useQuery(GET_RATING_NOTES_BYID, {
     //      variables: { id: operation.id },
     //      onCompleted: (e: any) => {
     //           FillDetails(e);
     //      },
     // });

     useQuery(GET_RATING_NOTES_BYID, {
          variables: { id: operation.resourceid, clientid: last },
          skip: !operation.id || operation.type === "deleteComment" || operation.type === "editNote",
          onCompleted: (e: any) => {
               DeleteRatings(e);
          },
     });

     function DeleteRatings(e: any) {
          console.log(e);
          setDeletion(e);
          //console.log(deletion);
     }

     function DeleteNotesRatingPermanent() {
          console.log(deletion.ratings.length);
          for (let i = 0; i < deletion.ratings.length; i++) {
               console.log(deletion.ratings[i].id);
               deleteRating({ variables: { id: deletion.ratings[i].id } });
          }
     }

     function DeleteNote(id: any, comments: any) {
          //FetchRating(resourceid);
          //FetchRating({ id: resourceid });
          //setDeletion(true);
          deleteNote({ variables: { id: id } });

          for (let i = 0; i < comments.length; i++) {
               deleteComment({ variables: { id: comments[i].id } });
          }
     }
     function DeleteComment(id: any) {
          deleteComment({ variables: { id: id } });
     }

     function EditNote(frm: any) {
          console.log(frm);
     }

     // function OnSubmit(frm: any) {
     //      switch (operation.type) {
     //           case "create":
     //                CreatePost(frm);
     //                break;
     //      }
     // }
     function OnSubmit(frm: any) {
          console.log(frm);
          if (frm) frm.user_permissions_user = auth.userid;
          if (frm.name === "editnote") {
               if (frm.name === "editnote") {
                    EditNote(frm);
               }
               // if (frm.name === "view") {
               //      modalTrigger.next(false);
               // }
          } else {
               CreatePost(frm);
          }
     }
     return (
          <>
               <ModalView
                    name={operation.type}
                    isStepper={false}
                    formUISchema={schema}
                    formSchema={Schema}
                    //showing={operation.modal_status}
                    formSubmit={(frm: any) => {
                         OnSubmit(frm);
                    }}
                    formData={messageDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
               />
               {operation.type === "deleteNote" && (
                    <StatusModal
                         modalTitle="Delete"
                         modalBody="Do you want to delete this Feedback?"
                         buttonLeft="Cancel"
                         buttonRight="Yes"
                         onClick={() => {
                              DeleteNote(operation.id, operation.comments);
                              DeleteNotesRatingPermanent();
                         }}
                    />
               )}
               {operation.type === "deleteComment" && (
                    <StatusModal
                         modalTitle="Delete"
                         modalBody="Do you want to delete this Comment?"
                         buttonLeft="Cancel"
                         buttonRight="Yes"
                         onClick={() => {
                              DeleteComment(operation.id);
                         }}
                    />
               )}
          </>
     );
}

export default React.forwardRef(CreatePosts);
