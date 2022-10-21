import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { CREATE_PROGRAM, DELETE_PROGRAM, GET_DATA, UPDATE_PROGRAM } from "./queries";
import AuthContext from "../../../context/auth-context";
import StatusModal from "../../../components/StatusModal/StatusModal";
import { schema, widgets } from './programSchema';
import { schemaView } from './programSchemaForView';
import { Subject } from 'rxjs';
import { flattenObj } from '../../../components/utils/responseFlatten';
import moment from 'moment';
import Toaster from '../../../components/Toaster';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditProgram(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("./program.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    let [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [toastType, setToastType] = useState<string>('');
    const [toastMessage, setToastMessage] = useState<string>('');

    const [createProgram] = useMutation(CREATE_PROGRAM, { 
        onCompleted: (r: any) => { 
            modalTrigger.next(false); 
            props.callback();
            setIsFormSubmitted(!isFormSubmitted); 
            setToastType('success');
            setToastMessage('Program details created successfully'); 
        } ,
        onError: (e: any) => {
            setToastType('error');
            setToastMessage('Program details has not been created'); 
        }
    });
    const [editProgram] = useMutation(UPDATE_PROGRAM, { 
        onCompleted: (r: any) => { 
            modalTrigger.next(false); 
            props.callback();
            setIsFormSubmitted(!isFormSubmitted); 
            setToastType('success');
            setToastMessage('Program details has been updated successfully'); 
        } ,
        onError: (e: any) => {
            setToastType('error');
            setToastMessage('Program details has not been updated');
        }
    });
    const [deleteProgram] = useMutation(DELETE_PROGRAM, { 
        onCompleted: () => { 
            props.callback();
            setIsFormSubmitted(!isFormSubmitted); 
            setToastType('success');
            setToastMessage('Program details has been deleted successfully'); 
        },
        onError: (e: any) => {
            setToastType('error');
            setToastMessage('Program details has not been deleted');
        } 
    });

    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            // render delete modal for delete operation
            if (msg.type === 'delete') {
                setShowDeleteModal(true);
            }

            //restrict form to render on delete operation
            if (msg.type !== 'delete') {
                modalTrigger.next(true);
            }
        }
    }));

    enum ENUM_FITNESSPROGRAM_LEVEL {
        Beginner,
        Intermediate,
        Advanced,
        None
    }

    useEffect(() => {
        if (operation.type === 'create') {
            setProgramDetails({});
        }
    }, [operation.type]);

    function FillDetails(data: any) {
        const flattenData = flattenObj({ ...data });
        let details: any = {};
        let msg = flattenData.fitnessprograms;

        details.programName = msg[0].title;
        details.duration = msg[0].duration_days;
        details.level = ENUM_FITNESSPROGRAM_LEVEL[msg[0].level];
        details.details = msg[0].description;
        details.discipline = msg[0].fitnessdisciplines.map(
            (val: any) => {
                return val;
            }
        );
        setProgramDetails(details);

        //if message exists - show form only for edit and view
        if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit(null);
    }

    function FetchData() {
        useQuery(GET_DATA, { variables: { id: operation.id }, onCompleted: (e: any) => { FillDetails(e) } });
    }

    function CreateProgram(frm: any) {
        const sdate = moment().format("YYYY-MM-DD");
        const edate = moment().add(frm.duration, "days").format("YYYY-MM-DD");

        frm.discipline = JSON.parse(frm.discipline);

        createProgram({
            variables: {
                title: frm.programName,
                fitnessdisciplines: frm.discipline.map((item: any) => { return item.id }).join(',').split(','),
                duration_days: frm.duration,
                level: ENUM_FITNESSPROGRAM_LEVEL[frm.level],
                description: frm.details,
                users_permissions_user: frm.user_permissions_user,
                startdate: sdate,
                enddate: edate
            }
        });
    }

    function EditExercise(frm: any) {
        const sdate = moment().format("YYYY-MM-DD");
        const edate = moment().add(frm.duration, "days").format("YYYY-MM-DD");
        frm.discipline = JSON.parse(frm.discipline);
        editProgram({
            variables: {
                programid: operation.id,
                title: frm.programName,
                fitnessdisciplines: frm.discipline.map((item: any) => { return item.id }).join(',').split(','),
                duration_days: frm.duration,
                level: ENUM_FITNESSPROGRAM_LEVEL[frm.level],
                description: frm.details,
                users_permissions_user: frm.user_permissions_user,
                startdate: sdate,
                enddate: edate
            },
        });
    }

    function ViewExercise(frm: any) {
        // console.log('view message');
        //use a variable to set form to disabled/not editable
        // useMutation(UPDATE_EXERCISE, { variables: frm, onCompleted: (d: any) => { console.log(d); } })
    }

    function DeleteExercise(id: any) {
        deleteProgram({ variables: { id: id } });
    }

    function OnSubmit(frm: any) {
        //bind user id
        if (frm)
            frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreateProgram(frm);
                break;
            case 'edit':
                EditExercise(frm);
                break;
            case 'view':
                ViewExercise(frm);
                break;
        }
    }

    let name = "";
    if (operation.type === 'create') {
        name = "Create New Program";
    } else if (operation.type === 'edit') {
        name = "Edit";
    } else if (operation.type === 'view') {
        name = "View";
    }

    FetchData();

    function handleToastCallback(){
        setIsFormSubmitted(false);
    }

    return (
        <>
            {/* Create , Edit and View Modal */}
            <ModalView
                name={name}
                isStepper={false}
                formUISchema={operation.type === 'view' ? schemaView : schema}
                formSchema={programSchema}
                formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                formData={programDetails}
                widgets={widgets}
                modalTrigger={modalTrigger}
                type={operation.type}
            />

            {/* Delete Modal */}
            {showDeleteModal && <StatusModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                modalTitle="Delete"
                modalBody="Do you want to delete this program?"
                buttonLeft="Cancel"
                buttonRight="Yes"
                onClick={() => { DeleteExercise(operation.id) }}
            />}

            {isFormSubmitted ?
                <Toaster handleCallback={handleToastCallback} type={toastType} msg={toastMessage} />
                : null}
        </>
    )
}

export default React.forwardRef(CreateEditProgram);