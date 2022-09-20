import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { GET_SINGLE_PACKAGE_BY_ID, GET_FITNESS_PACKAGE_TYPES, ADD_SUGGESTION_NEW } from '../graphQL/queries';
import { CREATE_PACKAGE, DELETE_PACKAGE, EDIT_PACKAGE, UPDATE_PACKAGE_STATUS, CREATE_BOOKING_CONFIG, UPDATE_BOOKING_CONFIG } from '../graphQL/mutations';
import { Modal, Button} from 'react-bootstrap';
import AuthContext from "../../../../context/auth-context";
// import StatusModal from "../../../../components/StatusModal/exerciseStatusModal";
import { schema, widgets } from './classicSchema';
import { schemaView } from './schemaView';
import {Subject} from 'rxjs';
import {flattenObj} from '../../../../components/utils/responseFlatten';
import moment from 'moment';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditPackage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const personalTrainingSchema: { [name: string]: any; } = require("./classic.json");
    const [classicDetails, setClassicDetails] = useState<any>({});
    const [fitnessTypes, setFitnessType] = useState<any[]>([]);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [statusModalShow, setStatusModalShow] = useState(false);

    let frmDetails: any = {};

    console.log(operation.type);

    useQuery(GET_FITNESS_PACKAGE_TYPES, {
        variables: {type: "Classic Class"},
        onCompleted: (r: any) => {
            const flattenData = flattenObj({...r});
            setFitnessType(flattenData.fitnessPackageTypes);
        }
    });

    const [bookingConfig] = useMutation(CREATE_BOOKING_CONFIG, {onCompleted: (r: any) => { 
        console.log(r); modalTrigger.next(false); props.callback();
    }});

    const [createUserPackageSuggestion] = useMutation(ADD_SUGGESTION_NEW, {onCompleted: (data) => {
        modalTrigger.next(false);
        props.callback();
    }});

    const [updateBookingConfig] = useMutation(UPDATE_BOOKING_CONFIG, {onCompleted: (r: any) => {
        console.log(r); modalTrigger.next(false); props.callback();
    }});

    const [createPackage] = useMutation(CREATE_PACKAGE, { onCompleted: (r: any) => { 
        // modalTrigger.next(false); props.callback();
        if(window.location.href.split('/')[3] === 'client'){
            createUserPackageSuggestion({
                variables: {
                    id:  window.location.href.split('/').pop(),
                    fitnesspackage: r.createFitnesspackage.data.id, 
                }
            })
        }else {
            const val = JSON.parse(frmDetails.config.bookingConfig);
            bookingConfig({
                variables: {
                    isAuto: val.config === "Auto" ? true : false,
                    id: r.createFitnesspackage.data.id,
                    bookings_per_day: val.bookings,
                    is_Fillmyslots: val.fillSchedule
                }
            });
        }
    }});
    const [editPackage] = useMutation(EDIT_PACKAGE,{onCompleted: (r: any) => { 
        const val = JSON.parse(frmDetails.config.bookingConfig);
        updateBookingConfig({
            variables: {
                isAuto: val.config === "Auto" ? true : false,
                id: frmDetails.bookingConfigId,
                bookings_per_day: val.bookings,
                is_Fillmyslots: val.fillSchedule
            }
        });
    }});

    const [updatePackageStatus] = useMutation(UPDATE_PACKAGE_STATUS, {onCompleted: (data) => {
        props.callback();
    }});
    const [deletePackage] = useMutation(DELETE_PACKAGE, { refetchQueries: ["GET_TABLEDATA"], onCompleted: (data) => {props.callback()}});

    const modalTrigger =  new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            // if (msg && !msg.id) //render form if no message id
            if(msg.type !== 'delete' && msg.type !== 'toggle-status'){
                modalTrigger.next(true);
            }
        }
    }));

    // console.log(exerciseDetails);

    enum ENUM_FITNESSPACKAGE_LEVEL {
        Beginner,
        Intermediate,
        Advanced,
        No_Level
    }
    enum ENUM_FITNESSPACKAGE_INTENSITY {
        Low,
        Moderate,
        High
    }

    enum ENUM_FITNESSPACKAGE_MODE {
        Online,
        Offline,
        Hybrid,
        Online_workout,
        Offline_workout,
        Residential
    }

    const PRICING_TABLE_DEFAULT = [{mrp: null, suggestedPrice: null, voucher: 0, duration: 1, sapienPricing: null}];

    function FillDetails(data: any) {
        const flattenedData = flattenObj({...data});
        console.log(flattenedData);
        let msg = flattenedData.fitnesspackages[0];
        let bookingConfig: any = {};
        let details: any = {};
        console.log(msg);
        for(var i =0; i<msg.fitnesspackagepricing.length; i++){
            PRICING_TABLE_DEFAULT[i].mrp = msg.fitnesspackagepricing[i].mrp;
            PRICING_TABLE_DEFAULT[i].suggestedPrice = msg.fitnesspackagepricing[i].suggestedPrice;
            PRICING_TABLE_DEFAULT[i].voucher = msg.fitnesspackagepricing[i].voucher;
            PRICING_TABLE_DEFAULT[i].sapienPricing = msg.fitnesspackagepricing[i].sapienPricing;
            PRICING_TABLE_DEFAULT[i].duration = msg.recordedclasses;
        }
        details.About = msg.aboutpackage;
        details.Benifits = msg.benefits;
        details.packagename = msg.packagename;
        details.equipmentList = msg.equipment_lists
        details.disciplines = msg.fitnessdisciplines
        details.channelinstantBooking = msg.groupinstantbooking;
        details.expiryDate = moment(msg.expirydate).format('YYYY-MM-DD');
        details.level = ENUM_FITNESSPACKAGE_LEVEL[msg.level];
        details.intensity = ENUM_FITNESSPACKAGE_INTENSITY[msg.Intensity];
        details.pricingDetail = msg.fitnesspackagepricing[0]?.mrp === 'free' ? 'free' : JSON.stringify(PRICING_TABLE_DEFAULT);
        details.publishingDate = moment(msg.publishing_date).format('YYYY-MM-DD');
        details.tags = msg?.tags === null ? "" : msg.tags;
        details.user_permissions_user = msg.users_permissions_user.id;
        details.visibility = msg.is_private === true ? 1 : 0;
        bookingConfig.config = msg.booking_config?.isAuto === true ? "Auto" : "Manual";
        bookingConfig.bookings = msg.booking_config?.bookingsPerDay;
        bookingConfig.fillSchedule = msg.booking_config?.is_Fillmyslots;
        details.config = {bookingConfig: JSON.stringify(bookingConfig)};
        details.programDetails = JSON.stringify({ duration: msg.duration, online: msg.recordedclasses, rest: msg.restdays});
        details.thumbnail = msg.Thumbnail_ID;
        details.Upload = msg.Upload_ID === null ? {"VideoUrl": msg.video_URL} : {"upload": msg.Upload_ID};
        details.datesConfig = JSON.stringify({"expiryDate": msg.expiry_date, "publishingDate": msg.publishing_date});
        details.bookingleadday = msg.bookingleadday;
        details.bookingConfigId = msg.booking_config?.id;
        details.languages = JSON.stringify(msg.languages);
        setClassicDetails (details);
        // console.log(exerciseDetails);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    console.log(operation.type);

    useEffect(() => {
        if(operation.type === 'create'){
            setClassicDetails({});
        }
    }, [operation.type]);

    function FetchData() {
        console.log('Fetch Data');
        useQuery(GET_SINGLE_PACKAGE_BY_ID, { variables: { id: operation.id }, skip: (operation.type === 'create'),onCompleted: (e: any) => { FillDetails(e) } });
    }

    function CreatePackage(frm: any) {
        frmDetails = frm;
        frm.equipmentList = JSON.parse(frm.equipmentList).map((x: any) => x.id).join(',').split(',');
        frm.disciplines = JSON.parse(frm.disciplines).map((x: any) => x.id).join(', ').split(', ');
        frm.programDetails = JSON.parse(frm.programDetails)
        frm.datesConfig = JSON.parse(frm.datesConfig)
        frm.languages = JSON.parse(frm.languages)

        createPackage({
            variables: {
                packagename: frm.packagename,
                tags: frm?.tags,
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails.mode],
                disciplines: frm.disciplines,
                duration: frm.programDetails?.duration,
                recordedclasses: frm.programDetails?.onlineClasses,
                restdays: frm.programDetails?.rest,
                is_private: frm.visibility === 1 ? true : false,
                bookingleadday: frm.bookingleaddat,
                fitness_package_type: fitnessTypes[0].id,
                fitnesspackagepricing: frm.pricingDetail === "free" ? [{mrp: 'free', duration: frm.programDetails.duration}] : JSON.parse(frm.pricingDetail),
                users_permissions_user: frm.user_permissions_user,
                publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
                expiry_date: moment(frm.datesConfig?.expiry_date).toISOString(),
                thumbnail: frm.thumbnail,
                upload: frm?.Upload?.upload,
                equipmentList: frm.equipmentList,
                videoUrl: frm?.Upload?.VideoUrl,
                languages: frm.languages.map((item: any) => item.id).join(", ").split(", "),
            }
        });
    }

    function EditPackage(frm: any) {
        frmDetails = frm;
        console.log('edit message', frm);
        frm.equipmentList = JSON.parse(frm.equipmentList).map((x: any) => x.id).join(',').split(',');
        frm.disciplines = JSON.parse(frm.disciplines).map((x: any) => x.id).join(', ').split(', ');
        frm.programDetails = JSON.parse(frm.programDetails)
        frm.datesConfig = JSON.parse(frm.datesConfig)
        frm.languages = JSON.parse(frm.languages)

        editPackage({
            variables: {
                id: operation.id,
                packagename: frm.packagename,
                tags: frm?.tags,
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails.mode],
                disciplines: frm.disciplines,
                duration: frm.programDetails?.duration,
                recordedclasses: frm.programDetails?.onlineClasses,
                restdays: frm.programDetails?.rest,
                is_private: frm.visibility === 1 ? true : false,
                bookingleadday: frm.bookingleaddat,
                fitness_package_type: fitnessTypes[0].id,
                fitnesspackagepricing: frm.pricingDetail === "free" ? [{mrp: 'free', duration: frm.programDetails.duration}] : JSON.parse(frm.pricingDetail),
                users_permissions_user: frm.user_permissions_user,
                publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
                expiry_date: moment(frm.datesConfig?.expiry_date).toISOString(),
                thumbnail: frm.thumbnail,
                upload: frm?.Upload?.upload,
                equipmentList: frm.equipmentList,
                videoUrl: frm?.Upload?.VideoUrl,
                languages: frm.languages.map((item: any) => item.id).join(", ").split(", "),
            }
        })
    }

    function ViewPackage(frm: any) {
        console.log('view message');
        //use a variable to set form to disabled/not editable
     //    useMutation(UPDATE_EXERCISE, { variables: frm, onCompleted: (d: any) => { console.log(d); } })
    }

    function deleteChannelPackage(id: any){
        deletePackage({variables: {id}});
        setDeleteModalShow(false);
    }

    function updateChannelPackageStatus(id: any, status: any){
        updatePackageStatus({variables: {id: id, Status: status}});
        setStatusModalShow(false);
        operation.type = 'create';
    }


    function OnSubmit(frm: any) {
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreatePackage(frm);
                break;
            case 'edit':
                EditPackage(frm);
                break;
            case 'view':
                ViewPackage(frm);
                break;
            case 'toggle-status':
                setStatusModalShow(true);
                break;
            case 'delete':
                setDeleteModalShow(true);
                break;
        }
    }

    let name = "";
    if(operation.type === 'create'){
        name="Create Classic Class";
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
                    showErrorList={false}
                    formUISchema={operation.type === 'view' ? schemaView : schema}
                    stepperValues={["Creator", "Details", "Program", "Pricing", "Config","Preview"]}
                    formSchema={personalTrainingSchema}
                    formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                    formData={classicDetails}
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

export default React.forwardRef(CreateEditPackage);