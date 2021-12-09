import React, {
  useContext,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from "react";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import ModalView from "../../components/modal";
import StatusModal from "../../components/StatusModal/StatusModal";
import AuthContext from "../../context/auth-context";
import { Subject } from "rxjs";
import {
  CREATE_WEBPAGE_DETAILS,
  FETCH_WEBSITE_SCHEMA_AND_FORM_JSON,
  FETCH_WEBSITE_DATA,
  FETCH_DATA_FORM,
  FETCH_TEMPLATE_SCHEMA_FORM,
  UPDATE_WEBSITE_DATA,
  UPDATE_WEBSITE_DATA_TO_EMPTY,
} from "./queries";

interface Operation {
  id: string;
  type: "create" | "edit" | "view" | "toggle-status" | "delete" | "select";
  current_status: boolean;
  template_id: string;
}

interface WebsiteData {
  users_permissions_user: string;
  form_data: {};
  website_template: string;
}

function CreateWebpageDetails(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const [webPagedetails, setWebPageDetails] = useState<any>({});

  const [schemaData, setSchemaData] = useState<any>(null);
  const [formJsonData, setFormJsonData] = useState<any>(null);
  const [stepperValues, setStepperValues] = useState<any>([]);
  const [websiteTemplateId, setWebsiteTemplateId] = useState<string>("");
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [websiteDataRecordId, setWebsiteDataRecordId] = useState<any>();

  const { templateId, setTemplateName, setWebsiteData } = props;

  const modalTrigger = new Subject();

  console.log(websiteTemplateId);
  console.log(templateId);

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);
      // console.log(msg.template_id);
      console.log(msg);
      fetchTemplate();
      //render form if no message id

      if (msg && !msg.id) modalTrigger.next(true);
    },
  }));

  useQuery(FETCH_WEBSITE_DATA, {
    variables: { id: auth.userid },
    onCompleted: (r: any) => {
      console.log(r);
      console.log("Fetching website data");
      if (r.websiteData[0] != undefined) {
        setSchemaData(r.websiteData[0].website_template.schema_json);
        setStepperValues(r.websiteData[0].website_template.Stepper_Title);
        setFormJsonData(r.websiteData[0].website_template.form_json);
        setWebsiteDataRecordId(r.websiteData[0].id);
        setWebsiteTemplateId(r.websiteData[0].website_template.id);
        //setWebsiteData(r.websiteData[0]);
      } else {
        return;
      }
    },
  });

  const [fetchTemplate] = useLazyQuery(FETCH_TEMPLATE_SCHEMA_FORM, {
    variables: { id: templateId },
    onCompleted: (r: any) => {
      // debugger;
      setSchemaData(r.websiteTemplate.schema_json);
      setFormJsonData(r.websiteTemplate.form_json);
      setTemplateName(r.websiteTemplate.template_name);
      setStepperValues(r.websiteTemplate.Stepper_Title);
    },
  });

  // console.log(r.websiteTemplate.form_json);
  // const [createExercise] = useMutation(CREATE_EXERCISE, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
  // const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
  // const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

  const [createDetails] = useMutation(CREATE_WEBPAGE_DETAILS, {
    onCompleted: (r: any) => {
      console.log(r);

      modalTrigger.next(false);
    },
  });

  const [updateDetails] = useMutation(UPDATE_WEBSITE_DATA, {
    onCompleted: (r: any) => {
      // debugger;
      console.log(r);

      modalTrigger.next(false);
    },
  });
  const [formDataToEmpty] = useMutation(UPDATE_WEBSITE_DATA_TO_EMPTY, {
    onCompleted: (r: any) => {
      console.log(r);

      //modalTrigger.next(false);
    },
  });

  function FillDetails(data: any) {
    //console.log(data.websiteData[0].form_data.data.address);
    //debugger;
    console.log(data);
    if (data.websiteData.length != 0) {
      // let details: any = {};
      let msg = { ...data.websiteData[0].form_data.data };
      msg.website_template = templateId;
      // details.brand_name = msg.brand_name;
      // details.email = msg.email;
      // details.about_text = msg.about_text;
      // details.action_button_text = msg.action_button_text;
      // details.phone = msg.phone;
      // details.users_permissions_user = data.websiteData[0].id;
      setWebPageDetails(msg);
    }

    // console.log(details);

    //if message exists - show form only for edit and view
    if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
  }

  function FetchData() {
    // useQuery(FETCH_DATA, { variables: { id: operation.id }, onCompleted: (e: any) => { FillDetails(e) } });
    useQuery(FETCH_DATA_FORM, {
      variables: { id: auth.userid },
      onCompleted: (e: any) => {
        FillDetails(e);
      },
    });
  }

  function CreateWebpage(data: any) {
    //console.log(frm);
    debugger;
    createDetails({
      variables: {
        user: data.users_permissions_user,
        template_id: data.website_template,
        frm: { data: data.form_data },
      },
    });
  }

  function EditWebpage(data: any) {
    console.log("edit message");

    // debugger;
    updateDetails({
      variables: {
        record_id: websiteDataRecordId,
        user: data.users_permissions_user,
        template_id: templateId,
        frm: { data: data.form_data },
      },
    });

    //editDetails({ variables: frm });
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
    //bind user id

    const data: WebsiteData = {
      users_permissions_user: auth.userid,
      form_data: frm,
      website_template: templateId,
    };

    if (frm) frm.users_permissions_user = auth.userid;

    console.log(data);

    switch (operation.type) {
      case "create":
        CreateWebpage(data);

        break;
      case "edit":
        EditWebpage(data);
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

  const TestThings = () => {
    formDataToEmpty({
      variables: {
        record_id: websiteDataRecordId,
        user: auth.userid,
        template_id: websiteTemplateId,
        frm: {},
      },
    });
  };
  // if (templateId != undefined) TestThings();
  FetchData();

  return (
    <>
      {/* {render && */}
      {schemaData && formJsonData && (
        <ModalView
          name={name}
          isStepper={true}
          stepperValues={stepperValues}
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
      )}
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
