import React, { useImperativeHandle, useState, useContext, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../../components/modal";
import {
     FETCH_USER_PROFILE_DATA,
     CREATE_EDUCATION_DETAILS,
     UPDATE_USER_PROFILE_DATA,
     UPDATE_EDUCATION_DETAILS,
     DELETE_EDUCATION_DETAILS,
     FETCH_USERS_PROFILE_DATA,
} from "../../queries/queries";
import AuthContext from "../../../../context/auth-context";
import { Subject } from "rxjs";
import { schema, widgets } from "../../profileSchema";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import StatusModal from "../../../../components/StatusModal/StatusModal";
import Toaster from '../../../../components/Toaster';
import { yearCustomFormats, yearTransformErrors } from "../../../../components/utils/ValidationPatterns";

interface Operation {
     id: string;
     modal_status: boolean;
     type: "create" | "edit" | "delete";
}

interface BasicEducationDetails {
     Institute_Name: string;
     Type_of_degree: string;
     Specialization: string;
     Year: string; 
}

function CreateEducation(props: any, ref: any) {
     const educationJson: unknown = require("./Education.json");
     const [operation, setOperation] = useState<Operation>({} as Operation);
     const [educationID, setEducationID] = useState<any>([]);
     const [educationDetails, setEducationDetails] = useState({} as BasicEducationDetails);
     const auth = useContext(AuthContext);
     const [prefill, setPrefill] = useState<any>([]);
     const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
     const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
     const [isEducationDeleted, setIsEducationDeleted] = useState<boolean>(false);
     const [isEducationUpdated, setIsEducationUpdated] = useState<boolean>(false);

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
          onCompleted: (r: any) => { props.callback(); fetch.refetch(); }, refetchQueries: [FETCH_USERS_PROFILE_DATA]
     });

     const [updateEducationalDetail] = useMutation(UPDATE_EDUCATION_DETAILS, {
          onCompleted: (r: any) => { modalTrigger.next(false); props.callback(); fetch.refetch(); setIsEducationUpdated(!isEducationUpdated); }
     });

     const [deleteEducationData] = useMutation(DELETE_EDUCATION_DETAILS, {
          onCompleted: (data: any) => { fetch.refetch(); setIsEducationDeleted(!isEducationDeleted); }, refetchQueries: [FETCH_USERS_PROFILE_DATA]
     });

     const [createEducation] = useMutation(CREATE_EDUCATION_DETAILS, {
          onCompleted: (r: any) => {
               setIsFormSubmitted(!isFormSubmitted);
               modalTrigger.next(false);

               fetch.refetch();

               // concatenate previously stored education details IDs with currently added educational details ID
               const contatenatedEducationIdArray = educationID && educationID.length ? educationID.concat([r.createEducationalDetail.data.id]) : [r.createEducationalDetail.data.id];

               updateProfile({
                    variables: {
                         id: auth.userid,
                         data: {
                              educational_details: contatenatedEducationIdArray
                         },
                    },
               });
          }
     });

     // Modal trigger
     const modalTrigger = new Subject();

     useImperativeHandle(ref, () => ({
          TriggerForm: (msg: Operation) => {
               setOperation(msg);

               //show delete modal
               if (msg.type === 'delete') {
                    setShowDeleteModal(true);
               }

               //restrict form to render on delete
               if (msg.type !== 'delete') {
                    modalTrigger.next(true);
               }
          },
     }));

     useEffect(() => {
          const data = prefill && prefill.length ? prefill.find((currValue: any) => currValue.id === operation.id) : null;
          const details = {} as BasicEducationDetails;
          details.Institute_Name = data ? data.Institute_Name : '';
          details.Type_of_degree = data ? data.Type_of_degree : '';
          details.Specialization = data ? data.Specialization : '';
          details.Year = data ? data.Year : '';

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
               }
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

     function DeleteEducation(id: any) {
          deleteEducationData({ variables: { id: id } });
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
          <>
               {/* Create and Edit Modal */}
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
                    showErrorList={false}
                    customFormats={yearCustomFormats}
                    transformErrors={yearTransformErrors}
               />

               {/* Delete Modal */}
               {showDeleteModal && <StatusModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    modalTitle="Delete"
                    modalBody="Do you want to delete this education detail?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => { DeleteEducation(operation.id) }}
               />
               }

               {/* success toaster notification */}
               {isFormSubmitted ?
                    <Toaster handleCallback={() => setIsFormSubmitted(!isFormSubmitted)} type="success" msg="New education detail has been added" />
                    : null}

               {isEducationDeleted ?
                    <Toaster handleCallback={() => setIsEducationDeleted(!isEducationDeleted)} type="success" msg="Education Detail has been deleted successfully" />
                    : null}

               {isEducationUpdated ?
                    <Toaster handleCallback={() => setIsEducationUpdated(!isEducationUpdated)} type="success" msg="Education Detail has been updated successfully" />
                    : null}
          </>
     );
}

export default React.forwardRef(CreateEducation);
