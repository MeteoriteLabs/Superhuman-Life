import React, { useContext, useImperativeHandle, useState } from "react";
import { useQuery, useMutation, from } from "@apollo/client";
import ModalView from "../../components/modal";
import StatusModal from "../../components/StatusModal/StatusModal";
import AuthContext from "../../context/auth-context";
import { schema } from "./webpageSchema";
import { Subject } from "rxjs";
import { CREATE_WEBPAGE_DETAILS } from "./queries";

interface Operation {
  id: string;
  type: "create" | "edit" | "view" | "toggle-status" | "delete";
  current_status: boolean;
}

function CreateWebpageDetails(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const webpageSchema: { [name: string]: any } = require("./webpage.json");
  const [webPagedetails, setWebPageDetails] = useState<any>({
    brand_name: "test",
    packagesBackgroundColor: "green",
    title: "title",
  });
  const [operation, setOperation] = useState<Operation>({} as Operation);

  // const [createExercise] = useMutation(CREATE_EXERCISE, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
  // const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
  // const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      if (msg && !msg.id)
        //render form if no message id
        modalTrigger.next(true);
    },
  }));

  // const [createDetails] = useMutation(CREATE_WEBPAGE_DETAILS, {
  //   onCompleted: (r: any) => {
  //     console.log(r);
  //     modalTrigger.next(false);
  //   },
  // });

  function FillDetails(data: any) {
    let details: any = {};
    let msg = data.exercises;
    console.log(details, msg);

    //if message exists - show form only for edit and view
    if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
  }
  FillDetails("edit");

  function FetchData() {
    // useQuery(FETCH_DATA, { variables: { id: operation.id }, onCompleted: (e: any) => { FillDetails(e) } });
  }

  // enum ENUM_EXERCISES_EXERCISELEVEL {
  //   Beginner,
  //   Intermediate,
  //   Advance,
  //   None,
  // }

  function CreateWebpage(frm: any) {
    // console.log(frm);
    // console.log("edit webpage");
    useMutation(CREATE_WEBPAGE_DETAILS, {
      onCompleted: (r: any) => {
        console.log(r);
        modalTrigger.next(false);
      },
      variables: frm,
    });
  }

  function EditWebpage(frm: any) {
    console.log("edit message");
    // useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } });
    // editExercise({variables: frm });
  }

  function ViewWebpage(frm: any) {
    console.log("view message");
    //use a variable to set form to disabled/not editable
    // useMutation(UPDATE_EXERCISE, { variables: frm, onCompleted: (d: any) => { console.log(d); } })
  }

  function DeleteWebpage(id: any) {
    console.log("delete message");
    // deleteExercise({ variables: { id: id }});
  }

  function OnSubmit(frm: any) {
    console.log(frm);
    //debugger;
    //bind user id

    if (frm) frm.user_permissions_user = auth.userid;

    switch (operation.type) {
      case "create":
        CreateWebpage(frm);
        break;
      case "edit":
        EditWebpage(frm);
        break;
      case "view":
        ViewWebpage(frm);
        break;
    }
  }

  let name = "Webpage Details";
  // if (operation.type === "create") {
  //   name = "Create New Exercise";
  // } else if (operation.type === "edit") {
  //   name = "Edit";
  // } else if (operation.type === "view") {
  //   name = "View";
  // }

  // FetchData();

  // console.log(typeof);

  return (
    <>
      {/* {render && */}
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
        formUISchema={schema}
        formSchema={webpageSchema}
        formSubmit={
          name === "View"
            ? () => {
                modalTrigger.next(false);
              }
            : (frm: any) => {
                OnSubmit(frm);
              }
        }
        formData={webPagedetails}
        modalTrigger={modalTrigger}
      />

      {/* } */}
      {operation.type === "delete" && (
        <StatusModal
          modalTitle="Delete"
          EventConnectedDetails={webPagedetails}
          ExistingEventId={operation.id}
          modalBody="Do you want to delete this message?"
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            DeleteWebpage(operation.id);
          }}
        />
      )}
    </>
  );
}

export default React.forwardRef(CreateWebpageDetails);
