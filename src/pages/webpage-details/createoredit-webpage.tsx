import React, { useContext, useImperativeHandle, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../components/modal";
import StatusModal from "../../components/StatusModal/StatusModal";
import AuthContext from "../../context/auth-context";
import { Subject } from "rxjs";
import {
  CREATE_WEBPAGE_DETAILS,
  FETCH_WEBSITE_SCHEMA,
  FETCH_WEBSITE_FORM_JSON,
} from "./queries";

interface Operation {
  id: string;
  type: "create" | "edit" | "view" | "toggle-status" | "delete";
  current_status: boolean;
}

export let tabsDetails: any = {};

function CreateWebpageDetails(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const [webPagedetails, setWebPageDetails] = useState<any>({
    brand_name: "test",
    email: "test@kevin.com",
  });

  const [schemaData, setSchemaData] = useState<any>({});
  const [formJsonData, setFormJsonData] = useState<any>({});
  const [operation, setOperation] = useState<Operation>({} as Operation);

  useQuery(FETCH_WEBSITE_SCHEMA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      setSchemaData(r.websiteData[0].website_template.schema_json);
    },
  });

  useQuery(FETCH_WEBSITE_FORM_JSON, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      setFormJsonData(r.websiteData[0].website_template.form_json);
    },
  });

  // const [createExercise] = useMutation(CREATE_EXERCISE, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
  // const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
  // const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      //render form if no message id
      if (msg && !msg.id) modalTrigger.next(true);
    },
  }));

  const [createDetails] = useMutation(CREATE_WEBPAGE_DETAILS, {
    onCompleted: (r: any) => {
      console.log(r);
      modalTrigger.next(false);
    },
  });

  // const [editDetails] = useMutation(UPDATE_WEBPAGE_DETAILS, {
  //   variables: { id: operation.id },
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
  //FillDetails("edit");

  // function FetchData() {
  //   // useQuery(FETCH_DATA, { variables: { id: operation.id }, onCompleted: (e: any) => { FillDetails(e) } });
  // }

  function CreateWebpage(frm: any) {
    createDetails({
      variables: { frm: { data: frm } },
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
    //bind user id

    if (frm) frm.users_permissions_user = auth.userid;

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

  return (
    <>
      {/* {render && */}
      <ModalView
        name={name}
        isStepper={true}
        stepperValues={["Intro Page"]}
        formUISchema={schemaData}
        formSchema={formJsonData}
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
