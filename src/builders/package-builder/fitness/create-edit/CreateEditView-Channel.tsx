import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "./widgets/Modal";
import {CREATE_CHANNEL_PACKAGE, CREATE_BOOKING_CONFIG, DELETE_PACKAGE, UPDATE_PACKAGE_STATUS, UPDATE_CHANNEL_COHORT_PACKAGE, CREATE_CHANNEL_TAG} from '../graphQL/mutations';
import {GET_FITNESS_PACKAGE_TYPE, GET_SINGLE_PACKAGE_BY_ID} from '../graphQL/queries';
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from './schema/channelSchema';
import {Subject} from 'rxjs';
import {flattenObj} from '../../../../components/utils/responseFlatten';
import moment from 'moment';
// import {AvailabilityCheck} from '../../../program-builder/program-template/availabilityCheck';
import { Modal, Button } from 'react-bootstrap';
// import StatusModal from "../../../../components/StatusModal/exerciseStatusModal";

interface Operation {
    id: string;
    packageType: 'Cohort' | 'Live Stream Channel',
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
    // callback: Function;
}

function CreateEditChannel(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("./json/channel.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    // const [frmDetails, setFrmDetails] = useState<any>();
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [statusModalShow, setStatusModalShow] = useState(false);
    let frmDetails: any = {};
    let newPackageId: any;

    const [editPackageDetails] = useMutation(UPDATE_CHANNEL_COHORT_PACKAGE, {onCompleted: (data) => {modalTrigger.next(false);}})
    const [updatePackageStatus] = useMutation(UPDATE_PACKAGE_STATUS, {onCompleted: (data) => {}});
    const [deletePackage] = useMutation(DELETE_PACKAGE, { refetchQueries: ["GET_TABLEDATA"], onCompleted: (data) => {props.callback()}});
    const [createChannelTag] = useMutation(CREATE_CHANNEL_TAG, {onCompleted: (r: any) => {console.log(r); modalTrigger.next(false); props.callback();}});
    const [bookingConfig] = useMutation(CREATE_BOOKING_CONFIG, {onCompleted: (r: any) => { 
        createChannelTag({
            variables: {
                tagName: frmDetails.channelName,
                packageId: newPackageId
            }
        })
     }})
    const [CreatePackage] = useMutation(CREATE_CHANNEL_PACKAGE, { onCompleted: (r: any) => {
        newPackageId = r.createFitnesspackage.data.id;
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

    enum ENUM_FITNESSPACKAGE_LEVEL {
        Beginner,
        Intermediate,
        Advanced
    }

    function FillDetails(data: any) {
        const flattenData = flattenObj({...data});
        let msg: any = flattenData.fitnesspackages[0];
        console.log(msg);
        let booking: any = {};
        let details: any = {};
        details.About = msg.aboutpackage;
        details.Benifits = msg.benefits;
        details.channelName = msg.packagename;
        details.channelinstantBooking = msg.groupinstantbooking;
        details.expiryDate = moment(msg.expirydate).format('YYYY-MM-DD');
        details.level = ENUM_FITNESSPACKAGE_LEVEL[msg.level];
        details.pricing = msg.fitnesspackagepricing[0]?.mrp === 'free' ? 'free' : JSON.stringify(msg.fitnesspackagepricing);
        details.publishingDate = moment(msg.publishing_date).format('YYYY-MM-DD');
        details.tag = msg.tags;
        details.user_permissions_user = msg.users_permissions_user.id;
        details.visibility = msg.is_private === true ? 1 : 0;
        booking.acceptBooking = msg.booking_config.isAuto === true ? 1 : 0;
        booking.maxBookingDay = msg.booking_config.bookingsPerDay;
        booking.maxBookingMonth = msg.booking_config.BookingsPerMonth;
        details.config = booking;
        // details.visibility = 
        // let msg = data;
        // console.log(msg);
        setProgramDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    function FetchData() {
        useQuery(GET_SINGLE_PACKAGE_BY_ID, { variables: { id: operation.id }, skip: (operation.type === 'create'), onCompleted: (e: any) => { FillDetails(e) } });
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
                benefits: frm.Benifits,
                packagename: frm.channelName,
                channelinstantBooking: frm.channelinstantBooking,
                expiry_date: moment(frm.expiryDate).toISOString(),
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                fitnesspackagepricing: frm.pricing === "free" ? [{mrp: 'free'}] : JSON.parse(frm.pricing),
                publishing_date: moment(frm.publishingDate).toISOString(),
                tags: frm.tag,
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true
            }
        })
    }

    function editChannelPackege(frm: any){
        frmDetails = frm;
        frm.location = JSON.parse(frm.location)
        frm.languages = JSON.parse(frm.languages)
        editPackageDetails({
            variables: {
                id: operation.id,
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                packagename: frm.channelName,
                channelinstantBooking: frm.channelinstantBooking,
                expiry_date: moment(frm.expiryDate).toISOString(),
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                fitnesspackagepricing: frm.pricing === "free" ? [{mrp: 'free'}] : JSON.parse(frm.pricing),
                publishing_date: moment(frm.publishingDate).toISOString(),
                tags: frm.tag,
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true
            }
        })
    }

    function deleteChannelPackage(id: any){
        deletePackage({variables: {id}});
        setDeleteModalShow(false);
    }

    function updateChannelPackageStatus(id: any, status: any){
        updatePackageStatus({variables: {id: id, Status: status}});
        setStatusModalShow(false);
    }

    function OnSubmit(frm: any) {
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreateChannelPackage(frm);
                break;
            case 'edit':
                editChannelPackege(frm);
                break;
            case 'delete':
                setDeleteModalShow(true);
                break;
        }
    }

    FetchData();

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
            <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    show={deleteModalShow}
                    centered
                    >
                    <Modal.Header closeButton onHide={() => {setDeleteModalShow(false)}}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Delete Package
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this package</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='danger' onClick={() => {setDeleteModalShow(false)}}>No</Button>
                        <Button variant='success' onClick={() => {deleteChannelPackage(operation.id)}}>Yes</Button>
                    </Modal.Footer>
                    </Modal>

                    <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    show={statusModalShow}
                    centered
                    >
                    <Modal.Header closeButton onHide={() => {setStatusModalShow(false)}}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Update Status
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to update the status of this package?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='danger' onClick={() => {setStatusModalShow(false)}}>No</Button>
                        <Button variant='success' onClick={() => {updateChannelPackageStatus(operation.id, operation.current_status)}}>Yes</Button>
                    </Modal.Footer>
                    </Modal>
        </>
    )
}

export default React.forwardRef(CreateEditChannel);