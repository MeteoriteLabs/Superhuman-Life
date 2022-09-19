import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import { CREATE_CHANNEL_PACKAGE, CREATE_BOOKING_CONFIG, DELETE_PACKAGE, UPDATE_PACKAGE_STATUS, UPDATE_CHANNEL_COHORT_PACKAGE } from '../graphQL/mutations';
import { GET_FITNESS_PACKAGE_TYPE, GET_SINGLE_PACKAGE_BY_ID } from '../graphQL/queries';
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from './channelSchema';
import { schemaView } from './schemaView';
import { Subject } from 'rxjs';
import { flattenObj } from '../../../../components/utils/responseFlatten';
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

function CreateEditChannel(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any; } = require("./channel.json");
    const [programDetails, setProgramDetails] = useState<any>({});
    // const [frmDetails, setFrmDetails] = useState<any>();
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [statusModalShow, setStatusModalShow] = useState(false);
    let frmDetails: any = {};

    const [editPackageDetails] = useMutation(UPDATE_CHANNEL_COHORT_PACKAGE, { onCompleted: (data) => { modalTrigger.next(false); props.callback(); } })
    const [updatePackageStatus] = useMutation(UPDATE_PACKAGE_STATUS, {
        onCompleted: (data) => {
            props.callback();
        }
    });
    const [deletePackage] = useMutation(DELETE_PACKAGE, { refetchQueries: ["GET_TABLEDATA"], onCompleted: (data) => { props.callback() } });
    const [bookingConfig] = useMutation(CREATE_BOOKING_CONFIG, {
        onCompleted: (r: any) => {
            modalTrigger.next(false); props.callback();
        }
    })
    const [CreatePackage] = useMutation(CREATE_CHANNEL_PACKAGE, {
        onCompleted: (r: any) => {
            bookingConfig({
                variables: {
                    isAuto: frmDetails.config.acceptBooking === 0 ? false : true,
                    id: r.createFitnesspackage.data.id,
                    bookings_per_day: frmDetails.config.maxBookingDay,
                    bookings_per_month: frmDetails.config.maxBookingMonth,
                }
            })
        }
    });
    // const [updateProgram] = useMutation(UPDATE_FITNESSPROGRAMS, {onCompleted: (r: any) => { modalTrigger.next(false); } });

    //     const [editExercise] = useMutation(UPDATE_EXERCISE,{variables: {exerciseid: operation.id}, onCompleted: (r: any) => { console.log(r); modalTrigger.next(false); } });
    //     const [deleteExercise] = useMutation(DELETE_EXERCISE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TABLEDATA"] });

    useQuery(GET_FITNESS_PACKAGE_TYPE, {
        onCompleted: (data: any) => {
            const flattenData = flattenObj({ ...data });
            setFitnessPackageTypes(flattenData.fitnessPackageTypes);
        }
    })

    const modalTrigger = new Subject();
    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            schema.startDate = props.startDate;
            schema.duration = props.duration;

            if(msg.type !== 'delete' && msg.type !== 'toggle-status'){
                modalTrigger.next(true);
            }
        }
    }));

    enum ENUM_FITNESSPACKAGE_LEVEL {
        Beginner,
        Intermediate,
        Advanced
    }

    enum ENUM_FITNESSPACKAGE_INTENSITY {
        Low,
        Moderate,
        High
    }

    const PRICING_TABLE_DEFAULT = [{ mrp: null, suggestedPrice: null, voucher: 0, duration: 30, sapienPricing: null }, { mrp: null, suggestedPrice: null, voucher: 0, duration: 90, sapienPricing: null }, { mrp: null, suggestedPrice: null, voucher: 0, duration: 180, sapienPricing: null }, { mrp: null, suggestedPrice: null, voucher: 0, duration: 360, sapienPricing: null }];

    const PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING = [{ mrp: null, suggestedPrice: null, voucher: 0, duration: 1, sapienPricing: null }, { mrp: null, suggestedPrice: null, voucher: 0, duration: 30, sapienPricing: null }, { mrp: null, suggestedPrice: null, voucher: 0, duration: 90, sapienPricing: null }, { mrp: null, suggestedPrice: null, voucher: 0, duration: 180, sapienPricing: null }, { mrp: null, suggestedPrice: null, voucher: 0, duration: 360, sapienPricing: null }];

    function FillDetails(data: any) {
        const flattenData = flattenObj({ ...data });
        let msg: any = flattenData.fitnesspackages[0];
        let booking: any = {};
        let details: any = {};
        
        if(msg.groupinstantbooking){
            for(var i =0; i<msg.fitnesspackagepricing.length; i++){
                PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].mrp = msg.fitnesspackagepricing[i].mrp;
                PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].suggestedPrice = msg.fitnesspackagepricing[i].suggestedPrice;
                PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].voucher = msg.fitnesspackagepricing[i].voucher;
                PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].sapienPricing = msg.fitnesspackagepricing[i].sapienPricing;
            }
        } else {
            for (var j = 0; j < msg.fitnesspackagepricing.length; j++) {
                PRICING_TABLE_DEFAULT[j].mrp = msg.fitnesspackagepricing[j].mrp;
                PRICING_TABLE_DEFAULT[j].suggestedPrice = msg.fitnesspackagepricing[j].suggestedPrice;
                PRICING_TABLE_DEFAULT[j].voucher = msg.fitnesspackagepricing[j].voucher;
                PRICING_TABLE_DEFAULT[j].sapienPricing = msg.fitnesspackagepricing[j].sapienPricing;
            }
        }
        details.About = msg.aboutpackage;
        details.Benifits = msg.benefits;
        details.channelName = msg.packagename;
        details.equipment = msg.equipment_lists
        details.discpline = JSON.stringify(msg.fitnessdisciplines);
        details.channelinstantBooking = JSON.stringify({ "instantBooking": msg.groupinstantbooking, "freeDemo": msg.Is_free_demo });
        details.expiryDate = moment(msg.expirydate).format('YYYY-MM-DD');
        details.level = ENUM_FITNESSPACKAGE_LEVEL[msg.level];
        details.intensity = ENUM_FITNESSPACKAGE_INTENSITY[msg.Intensity];
        details.pricing = msg.fitnesspackagepricing[0]?.mrp === 'free' ? 'free' : JSON.stringify(msg.groupinstantbooking ? PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING : PRICING_TABLE_DEFAULT);
        details.publishingDate = moment(msg.publishing_date).format('YYYY-MM-DD');
        details.tag = msg?.tags === null ? "" : msg.tags;
        details.user_permissions_user = msg.users_permissions_user.id;
        details.visibility = msg.is_private === true ? 1 : 0;
        booking.acceptBooking = msg.booking_config?.isAuto === true ? 1 : 0;
        booking.maxBookingDay = msg.booking_config?.bookingsPerDay;
        booking.maxBookingMonth = msg.booking_config?.BookingsPerMonth;
        details.config = booking;
        details.thumbnail = msg.Thumbnail_ID;
        details.Upload = msg.Upload_ID === null ? { "VideoUrl": msg.video_URL } : { "upload": msg.Upload_ID };
        details.datesConfig = { "expiryDate": msg.expiry_date, "publishingDate": msg.publishing_date };

        setProgramDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    useEffect(() => {
        if (operation.type === 'create') {
            setProgramDetails({});
        }
    }, [operation.type]);

    function FetchData() {
        useQuery(GET_SINGLE_PACKAGE_BY_ID, { variables: { id: operation.id }, skip: (operation.type === 'create'), onCompleted: (e: any) => { FillDetails(e) } });
    }

    function findPackageType(creationType: any) {
        const foundType = fitnessPackageTypes.find((item: any) => item.type === creationType);
        return foundType.id;
    }

    function CreateChannelPackage(frm: any) {
        frmDetails = frm;
        frm.datesConfig = JSON.parse(frm.datesConfig);
        if (frm.equipment) {
            frm.equipment = JSON.parse(frm?.equipment);
        }
        if (frm.discpline) {
            frm.discpline = JSON.parse(frm?.discpline);
        }

        CreatePackage({
            variables: {
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                packagename: frm.channelName,
                channelinstantBooking: JSON.parse(frm.channelinstantBooking).instantBooking,
                Is_free_demo: JSON.parse(frm.channelinstantBooking).freeDemo,
                expiry_date: moment(frm.datesConfig?.expiryDate).toISOString(),
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                Intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
                equipmentList: frm?.equipment?.length > 0 ? frm.equipment.map((item: any) => item.id).join(", ").split(", ") : [],
                fitnessdisciplines: frm?.discpline?.length > 0 ? frm.discpline.map((item: any) => item.id).join(", ").split(", ") : [],
                fitnesspackagepricing: frm.pricing === "free" ? [{ mrp: 'free' }] : JSON.parse(frm.pricing).filter((item: any) => item.mrp !== null),
                publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
                tags: frm?.tag,
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true,
                thumbnail: frm.thumbnail,
                upload: frm.Upload?.upload,
                videoUrl: frm.Upload?.VideoUrl,
            }
        })
    }

    function editChannelPackege(frm: any) {
        frmDetails = frm;
        frm.datesConfig = JSON.parse(frm.datesConfig);
        if (frm.equipment) {
            frm.equipment = JSON.parse(frm?.equipment);
        }
        if (frm.discpline) {
            frm.discpline = JSON.parse(frm?.discpline);
        }
        editPackageDetails({
            variables: {
                id: operation.id,
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                packagename: frm.channelName,
                channelinstantBooking: JSON.parse(frm.channelinstantBooking).instantBooking,
                Is_free_demo: JSON.parse(frm.channelinstantBooking).freeDemo,
                expiry_date: moment(frm.datesConfig?.expiryDate).toISOString(),
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                Intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
                equipmentList: frm?.equipment?.length > 0 ? frm.equipment.map((item: any) => item.id).join(", ").split(", ") : [],
                fitnessdisciplines: frm?.discpline?.length > 0 ? frm.discpline.map((item: any) => item.id).join(", ").split(", ") : [],
                fitnesspackagepricing: frm.pricing === "free" ? [{ mrp: 'free' }] : JSON.parse(frm.pricing).filter((item: any) => item.mrp !== null),
                publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
                tags: frm.tag,
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true,
                thumbnail: frm.thumbnail,
                upload: frm.Upload?.upload,
                videoUrl: frm.Upload?.VideoUrl,
            }
        })
    }

    function deleteChannelPackage(id: any) {
        deletePackage({ variables: { id } });
        setDeleteModalShow(false);
    }

    function updateChannelPackageStatus(id: any, status: any) {
        updatePackageStatus({ variables: { id: id, Status: status } });
        setStatusModalShow(false);
    }

    function OnSubmit(frm: any) {
        //bind user id
        if (frm) {
            frm.user_permissions_user = auth.userid;
        }

        switch (operation.type) {
            case 'create':
                CreateChannelPackage(frm);
                break;
            case 'edit':
                editChannelPackege(frm);
                break;
            case 'toggle-status':
                setStatusModalShow(true);
                break;
            case 'delete':
                setDeleteModalShow(true);
                break;
        }
    }

    FetchData();

    let name = "";
    if (operation.type === 'create') {
        name = "New Live Stream Channel";
    } else if (operation.type === 'edit') {
        name = "Edit";
    } else if (operation.type === 'view') {
        name = "View";
    }

    return (
        <>
            <ModalView
                name={name}
                isStepper={true}
                showErrorList={false}
                formUISchema={operation.type === 'view' ? schemaView : schema}
                formSchema={programSchema}
                formSubmit={name === "View" ? () => { modalTrigger.next(false); } : (frm: any) => { OnSubmit(frm); }}
                formData={programDetails}
                widgets={widgets}
                stepperValues={["Creator", "Details", "Schedule", "Pricing", "Config", "Review"]}
                modalTrigger={modalTrigger}
            />

            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={deleteModalShow}
                centered
            >
                <Modal.Header closeButton onHide={() => { setDeleteModalShow(false) }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Delete Package
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this package</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={() => { setDeleteModalShow(false) }}>No</Button>
                    <Button variant='success' onClick={() => { deleteChannelPackage(operation.id) }}>Yes</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={statusModalShow}
                centered
            >
                <Modal.Header closeButton onHide={() => { setStatusModalShow(false) }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Status
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to update the status of this package?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={() => { setStatusModalShow(false) }}>No</Button>
                    <Button variant='success' onClick={() => { updateChannelPackageStatus(operation.id, operation.current_status) }}>Yes</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default React.forwardRef(CreateEditChannel);