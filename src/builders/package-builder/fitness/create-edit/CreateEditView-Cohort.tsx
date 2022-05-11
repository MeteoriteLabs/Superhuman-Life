import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "./widgets/Modal";
import {CREATE_CHANNEL_PACKAGE, CREATE_BOOKING_CONFIG, DELETE_PACKAGE, UPDATE_PACKAGE_STATUS, UPDATE_CHANNEL_COHORT_PACKAGE} from '../graphQL/mutations';
import {GET_FITNESS_PACKAGE_TYPE, GET_SINGLE_PACKAGE_BY_ID} from '../graphQL/queries';
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from './schema/cohortSchema';
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
}

function CreateEditCohort(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("./json/cohort.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    // const [frmDetails, setFrmDetails] = useState<any>([]);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [statusModalShow, setStatusModalShow] = useState(false);
    // const program_id = window.location.pathname.split('/').pop();
    let frmDetails: any = {};
    
    const [editPackageDetails] = useMutation(UPDATE_CHANNEL_COHORT_PACKAGE, {onCompleted: (data) => {modalTrigger.next(false);}})
    const [updatePackageStatus] = useMutation(UPDATE_PACKAGE_STATUS, {onCompleted: (data) => {setStatusModalShow(false);}});
    const [deletePackage] = useMutation(DELETE_PACKAGE, { refetchQueries: ["GET_TABLEDATA"], onCompleted: (data) => {props.callback();}});
    const [bookingConfig] = useMutation(CREATE_BOOKING_CONFIG, {onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); props.callback();}})
    const [CreateCohortPackage] = useMutation(CREATE_CHANNEL_PACKAGE, { onCompleted: (r: any) => { 
        bookingConfig({
            variables: {
                isAuto: frmDetails.config.acceptBooking === 0 ? false : true,
                id: r.createFitnesspackage.data.id,
                bookings_per_day: frmDetails.config.maxBookingDay,
                bookings_per_month: frmDetails.config.maxBookingMonth
            }
        })
     }})
    // const [CreateProgram] = useMutation(CREATE_PROGRAM, { onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
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

    enum ENUM_FITNESSPACKAGE_MODE {
        Online,
        Offline,
        Hybrid,
        Residential
    }

    enum ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE {
        Accommodation,
        Accommodation_Food
    }

    function FillDetails(data: any) {
        const flattenData = flattenObj({...data});
        let msg: any = flattenData.fitnesspackages[0];
        let booking: any = {};
        let details: any = {};
        let courseDetails = {details: JSON.stringify(msg.Course_details)};
        console.log(msg);
        details.About = msg.aboutpackage;
        details.Benifits = msg.benefits;
        details.packageName = msg.packagename;
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
        details.classSize = msg.classsize;
        details.mode = ENUM_FITNESSPACKAGE_MODE[msg.mode];
        details.residential =  ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE[msg.residential_type];
        details.languages = JSON.stringify(msg.languages);
        details.startDate = moment(msg.Start_date).format('YYYY-MM-DD');
        details.endDate = moment(msg.End_date).format('YYYY-MM-DD');
        // {addressTag: addressTitle, address: singleSelections, mode: mode, residential: residential}
        details.courseDetails = courseDetails;
        details.programDetails = JSON.stringify({addressTag: msg.address === null ? 'At Client Address' : 'At My Address', address: msg.address, mode: ENUM_FITNESSPACKAGE_MODE[msg.mode], residential: ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE[msg.residential_type]});
        debugger;
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

    function createCohort(frm: any) {
        frmDetails = frm;
        frm.programDetails = JSON.parse(frm.programDetails)
        frm.languages = JSON.parse(frm.languages)
        frm.courseDetails.details = JSON.parse(frm.courseDetails.details)
        CreateCohortPackage({
            variables: {
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                packagename: frm.packageName,
                channelinstantBooking: frm.channelinstantBooking,
                expiry_date: moment(frm.expiryDate).toISOString(),
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                fitnesspackagepricing: frm.pricing === "free" ? [{mrp: 'free'}] : JSON.parse(frm.pricing),
                publishing_date: moment(frm.publishingDate).toISOString(),
                tags: frm.tag,
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true,
                classsize: frm.classSize,
                address: frm.programDetails?.addressTag === 'At My Address' ? frm.location.address[0].id : null,
                mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails?.mode],
                residential_type: ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE[frm.programDetails?.residential],
                languages: frm.languages,
                Start_date: moment(frm.startDate).toISOString(),
                End_date: moment(frm.endDate).toISOString(),
                Course_details: frm.courseDetails.details
            }
        })
    }

    function editCohort(frm){
        frmDetails = frm;
        frm.location = JSON.parse(frm.location)
        frm.languages = JSON.parse(frm.languages)
        editPackageDetails({
            variables: {
                id: operation.id,
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                packagename: frm.packageName,
                channelinstantBooking: frm.channelinstantBooking,
                expiry_date: moment(frm.expiryDate).toISOString(),
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                fitnesspackagepricing: frm.pricing === "free" ? [{mrp: 'free'}] : JSON.parse(frm.pricing),
                publishing_date: moment(frm.publishingDate).toISOString(),
                tags: frm.tag,
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true,
                classsize: frm.classSize,
                address: frm.location.address[0].id,
                mode: ENUM_FITNESSPACKAGE_MODE[frm.mode],
                residential_type: ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE[frm.residential],
                languages: frm.languages,
                Start_date: moment(frm.startDate).toISOString(),
                End_date: moment(frm.endDate).toISOString()
            }
        })
    }

    function deleteChannelPackage(id: any){
        deletePackage({variables: {id}});
        setDeleteModalShow(false);
    }

    function updateChannelPackageStatus(id: any, status: any){
        updatePackageStatus({variables: {id: id, Status: status}});
    }


    function OnSubmit(frm: any) {
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                createCohort(frm);
                break;
            case 'edit':
                editCohort(frm);
                break;
            case 'delete':
                setDeleteModalShow(true);
                break;
            case 'toggle-status':
                setStatusModalShow(true);
                break;
        }
    }

    let name = "";
    if(operation.type === 'create'){
        name="New Cohort";
    }else if(operation.type === 'edit'){
        name="Edit";
    }else if(operation.type === 'view'){
        name="View";
    }


    FetchData();

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
                    stepperValues={["Creator", "Details", "Program", "Pricing", "config", "Review"]}
                    widgets={widgets}
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

export default React.forwardRef(CreateEditCohort);
