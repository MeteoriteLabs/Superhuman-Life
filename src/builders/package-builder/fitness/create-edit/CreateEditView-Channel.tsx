import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import {CREATE_CHANNEL_PACKAGE, CREATE_BOOKING_CONFIG} from '../graphQL/mutations';
import {GET_FITNESS_PACKAGE_TYPE} from '../graphQL/queries';
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from './schema/channelSchema';
import {Subject} from 'rxjs';
import {flattenObj} from '../../../../components/utils/responseFlatten';
import moment from 'moment';
import {AvailabilityCheck} from '../../../program-builder/program-template/availabilityCheck';
import { Modal, Button } from 'react-bootstrap';

interface Operation {
    id: string;
    packageType: 'Cohort' | 'Live Stream Channel',
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditChannel(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("./json/channel.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    // const [frmDetails, setFrmDetails] = useState<any>();
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
    let frmDetails: any = {};

    const [bookingConfig] = useMutation(CREATE_BOOKING_CONFIG, {onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); }})
    const [CreatePackage] = useMutation(CREATE_CHANNEL_PACKAGE, { onCompleted: (r: any) => {
        bookingConfig({
            variables: {
                isAuto: frmDetails.config.acceptBooking === 0 ? false : true,
                id: r.createFitnesspackage.data.id,
                bookings_per_day: frmDetails.config.maxBookingDay,
                bookings_per_month: frmDetails.config.maxBookingMonth
            }
        })
     } });
    // const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, {onCompleted: (r: any) => { modalTrigger.next(false); } });
    
    //     const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
//     const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

    useQuery(GET_FITNESS_PACKAGE_TYPE, {onCompleted: (data: any) => {
        const flattenData = flattenObj({...data});
        setFitnessPackageTypes(flattenData.fitnessPackageTypes);
    }})

    const modalTrigger =  new Subject();
    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            schema.startDate = props.startDate;
            schema.duration = props.duration;

            if (msg && !msg.id) //render form if no message id
                modalTrigger.next(true);
        }
    }));

    function FillDetails(data: any) {
        let details: any = {};
        // let msg = data;
        // console.log(msg);
        setProgramDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    enum ENUM_FITNESSPACKAGE_LEVEL {
        Beginner,
        Intermediate,
        Advanced
    }

    function findPackageType(creationType: any){
        const foundType = fitnessPackageTypes.find((item: any) => item.type === creationType);
        return foundType.id;
    }


    function CreateChannelPackage(frm: any) {
        frmDetails = frm;
        CreatePackage({
            variables: {
                aboutpackage: frm.About,
                benefits: frm.Benefits,
                packagename: frm.channelName,
                channelinstantBooking: frm.channelinstantBooking,
                expiry_date: moment(frm.expiryDate).toISOString(),
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                fitnesspackagepricing: frm.pricing === "free" ? [{pricing: 'free'}] : JSON.stringify(frm.pricing),
                publishing_date: moment(frm.publishingDate).toISOString(),
                tags: frm.tag,
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true
            }
        })
    }

    function OnSubmit(frm: any) {
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        console.log(operation.packageType);

        switch (operation.type) {
            case 'create':
                CreateChannelPackage(frm);
                break;
        }
    }

    let name = "";
    if(operation.type === 'create'){
        name="New Live Stream Channel";
    }else if(operation.type === 'edit'){
        name="Edit";
    }else if(operation.type === 'view'){
        name="View";
    }


    return (
        <>
            {/* {render && */}
                <ModalView
                    name={name}
                    isStepper={true}
                    formUISchema={schema}
                    formSchema={programSchema}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={programDetails}
                    widgets={widgets}
                    stepperValues={["Creator", "Details", "Schedule", "Pricing", "Config", "Review"]}
                    modalTrigger={modalTrigger}
                />
                
            {/* } */}  
        </>
    )
}

export default React.forwardRef(CreateEditChannel);