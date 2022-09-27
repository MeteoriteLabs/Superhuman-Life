import React, { useImperativeHandle, useState, useContext, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../../components/modal";
import {
     FETCH_USER_PROFILE_DATA,
     CREATE_EDUCATION_DETAILS,
     UPDATE_USER_PROFILE_DATA,
     UPDATE_EDUCATION_DETAILS
} from "../../queries/queries";
import AuthContext from "../../../../context/auth-context";
import { Subject } from "rxjs";
import { schema, widgets } from "../../profileSchema";
import { flattenObj } from "../../../../components/utils/responseFlatten";

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create" | "edit";
}

// const emptyEducationState = {
//      Institute_Name: '',
//      Specialization: '',
//      Type_of_degree: '',
//      Year: ''
// };

function CreateEducation(props: any, ref: any) {
     const educationJson: { [name: string]: any } = require("./Education.json");
     const [operation, setOperation] = useState<Operation>({} as Operation);
     const [educationID, setEducationID] = useState<any>([]);
     const [educationDetails, setEducationDetails] = useState<any>([]);
     const auth = useContext(AuthContext);
     const [prefill, setPrefill] = useState<any>([]);

     const fetch = useQuery(FETCH_USER_PROFILE_DATA, {
          variables: { id: auth.userid },
          skip: (operation.type === 'create'),
          onCompleted: (r: any) => {
               const flattenData = flattenObj({ ...r });

               CloseForm();
               setPrefill(flattenData.usersPermissionsUser.educational_details);

               setEducationID(r.usersPermissionsUser.data.attributes.educational_details.data && r.usersPermissionsUser.data.attributes.educational_details.data.length ? r.usersPermissionsUser.data.attributes.educational_details.data.map(
                    (eduId: any) => eduId.id
               ) : null
               );
          },

     });

     const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
          onCompleted: (r: any) => { props.callback(); fetch.refetch(); },
     });

     const [updateEducationalDetail] = useMutation(UPDATE_EDUCATION_DETAILS, {
          onCompleted: (r: any) => { modalTrigger.next(false); props.callback(); fetch.refetch(); },
     });

     const [createEducation] = useMutation(CREATE_EDUCATION_DETAILS, {
          onCompleted: (r: any) => {
               modalTrigger.next(false);
               props.callback();
               fetch.refetch();

               // concatenate previously stored education details IDs with currently added educational details ID
               let contatenatedEducationIdArray = educationID && educationID.length ? educationID.concat([r.createEducationalDetail.data.id]) : [r.createEducationalDetail.data.id];

               updateProfile({
                    variables: {
                         id: auth.userid,
                         data: {
                              educational_details: contatenatedEducationIdArray
                         },
                    },
               });
          },
     });

     // Modal trigger
     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);
               modalTrigger.next(true);
          },
     }));

     useEffect(() => {
          let data = prefill && prefill.length ? prefill.filter((currValue: any) => currValue.id === operation.id) : null;
          let details: any = {};
          details.Institute_Name = data && data.length ? data[0].Institute_Name : '';
          details.Type_of_degree = data && data.length ? data[0].Type_of_degree : '';
          details.Specialization = data && data.length ? data[0].Specialization : '';
          details.Year = data && data.length ? data[0].Year : '';

          setEducationDetails(details);

     }, [operation.id, prefill])

     // Close form after update    
     function CloseForm() {
          if (['edit'].indexOf(operation.type) > -1)
               modalTrigger.next(false);
     }

     // Create Education Details
     function CreateUserEducation(frm: any) {
          createEducation({
               variables: {
                    data: {
                         Institute_Name: frm.Institute_Name,
                         Specialization: frm.Specialization,
                         Type_of_degree: frm.Type_of_degree,
                         Year: frm.Year,
                    }
               },
          });
     }

     // Update Education Details
     function UpdateUserEducation(frm: any) {
          updateEducationalDetail({
               variables: {
                    id: operation.id,
                    data: {
                         Institute_Name: frm.Institute_Name,
                         Specialization: frm.Specialization,
                         Type_of_degree: frm.Type_of_degree,
                         Year: frm.Year,
                    }
               },
          });
     }

     function OnSubmit(frm: any) {
          switch (operation.type) {
               case "create":
                    CreateUserEducation(frm);
                    break;
               case "edit":
                    UpdateUserEducation(frm);
                    break;
          }
     }

     return (
          <ModalView
               name={operation.type === 'create' ? "Create New Education Detail" : "Edit Education Details"}
               isStepper={false}
               formUISchema={schema}
               formSchema={educationJson}
               showing={operation.modal_status}
               formSubmit={(frm: any) => {
                    OnSubmit(frm);
               }}
               widgets={widgets}
               modalTrigger={modalTrigger}
               type={operation.type}
               formData={operation.type === 'create' ? {} : educationDetails}
          />
     );
}

export default React.forwardRef(CreateEducation);
