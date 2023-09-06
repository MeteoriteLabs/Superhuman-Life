import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ModalView from 'components/modal';
import {
    GET_SINGLE_PACKAGE_BY_ID,
    GET_FITNESS_PACKAGE_TYPES,
    GET_INVENTORY
} from '../graphQL/queries';
import {
    CREATE_PACKAGE,
    DELETE_PACKAGE,
    EDIT_PACKAGE,
    UPDATE_PACKAGE_STATUS,
    CREATE_TAG,
    CREATE_NOTIFICATION,
    CREATE_OFFERING_INVENTORY,
    UPDATE_OFFERING_INVENTORY,
    DELETE_OFFERING_INVENTORY
} from '../graphQL/mutations';
import { Modal, Button } from 'react-bootstrap';
import AuthContext from 'context/auth-context';
import { schema, widgets } from './groupSchema';
import { schemaView } from './schemaView';
import { EditSchema } from './groupEditSchema';
import { Subject } from 'rxjs';
import { flattenObj } from 'components/utils/responseFlatten';
import moment from 'moment';
import Toaster from 'components/Toaster';
import {
    youtubeUrlCustomFormats,
    youtubeUrlTransformErrors
} from 'components/utils/ValidationPatterns';
import { OfferingInventory } from '../../interface/offeringInventory';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditPackage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const personalTrainingSchema: Record<string, unknown> = require('./group.json');
    const [groupDetails, setGroupDetails] = useState<any>({});
    const [fitnessTypes, setFitnessType] = useState<any[]>([]);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
    const [deleteValidationModalShow, setDeleteValidationModalShow] = useState<boolean>(false);
    const [statusModalShow, setStatusModalShow] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [isOfferingDeleted, setisOfferingDeleted] = useState<boolean>(false);
    const [isOfferingUpdated, setisOfferingUpdated] = useState<boolean>(false);
    const [offeringInventoryDetails, setOfferingInventoryDetails] = useState<OfferingInventory>(
        {} as OfferingInventory
    );

    let frmDetails: any = {};

    useQuery(GET_FITNESS_PACKAGE_TYPES, {
        variables: { type: 'Group Class' },
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });
            setFitnessType(flattenData.fitnessPackageTypes);
        }
    });

    useQuery(
        GET_INVENTORY,

        {
            variables: {
                changemaker_id: auth.userid,
                fitnesspackageid: operation.id,
                pageSize: props.totalRecords
            },
            skip: !operation.id,
            onCompleted: (response) => {
                const flattenInventoryData = flattenObj({ ...response.offeringInventories });

                if (flattenInventoryData && flattenInventoryData.length)
                    setOfferingInventoryDetails(flattenInventoryData[0]);

                if (
                    operation.type === 'delete' &&
                    flattenInventoryData &&
                    flattenInventoryData.length &&
                    flattenInventoryData[0] &&
                    flattenInventoryData[0].ActiveBookings === 0
                )
                    setDeleteModalShow(true);
                else setDeleteValidationModalShow(true);
            }
        }
    );

    const [createTag] = useMutation(CREATE_TAG, {
        onCompleted: (response) => {
            modalTrigger.next(false);

            props.refetchTags();
            props.refetchOfferings();
            setIsFormSubmitted(!isFormSubmitted);
            window.open(`group/session/scheduler/${response.createTag.data.id}`, '_self');
        }
    });

    const [createGroupNotification] = useMutation(CREATE_NOTIFICATION);

    const [createOfferingInventory] = useMutation(CREATE_OFFERING_INVENTORY);
    const [updateOfferingInventory] = useMutation(UPDATE_OFFERING_INVENTORY);

    const [createPackage] = useMutation(CREATE_PACKAGE, {
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });

            createOfferingInventory({
                variables: {
                    data: {
                        fitnesspackage: flattenData.createFitnesspackage.id,
                        ActiveBookings: 0,
                        ClassSize: flattenData.createFitnesspackage.classsize,
                        ClassAvailability: flattenData.createFitnesspackage.classsize,
                        changemaker_id: auth.userid,
                        InstantBooking: flattenData.createFitnesspackage.groupinstantbooking,
                        ClientBookingDetails: []
                    }
                }
            });

            createGroupNotification({
                variables: {
                    data: {
                        type: 'Offerings',
                        Title: 'New offering',
                        OnClickRoute: '/offerings',
                        users_permissions_user: auth.userid,
                        Body: `New group offering ${flattenData.createFitnesspackage.packagename} has been added`,
                        DateTime: moment().format(),
                        IsRead: false
                    }
                }
            });

            createTag({
                variables: {
                    id: flattenData.createFitnesspackage.id,
                    tagName: flattenData.createFitnesspackage.packagename
                }
            });
        }
    });

    const [editPackage] = useMutation(EDIT_PACKAGE, {
        onCompleted: (data) => {
            modalTrigger.next(false);

            props.refetchTags();
            props.refetchOfferings();
            setisOfferingUpdated(!isOfferingUpdated);

            const flattenData = flattenObj({ ...data });

            updateOfferingInventory({
                variables: {
                    id: offeringInventoryDetails.id,
                    data: {
                        ClassSize: flattenData.updateFitnesspackage.classsize,
                        InstantBooking: flattenData.updateFitnesspackage.groupinstantbooking
                    }
                }
            });
        }
    });

    const [updatePackageStatus] = useMutation(UPDATE_PACKAGE_STATUS, {
        onCompleted: () => {
            props.refetchTags();
            props.refetchOfferings();
            setisOfferingUpdated(!isOfferingUpdated);
        }
    });

    const [deleteOfferingInventory] = useMutation(DELETE_OFFERING_INVENTORY);

    const [deletePackage] = useMutation(DELETE_PACKAGE, {
        onCompleted: () => {
            // delete offering inventory
            deleteOfferingInventory({ variables: { id: offeringInventoryDetails.id } });

            props.refetchTags();
            props.refetchOfferings();
            setisOfferingDeleted(!isOfferingDeleted);
        }
    });

    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            if (msg.type === 'toggle-status') {
                setStatusModalShow(true);
            }

            if (msg.type === 'delete' && offeringInventoryDetails.ActiveBookings !== null) {
                if (offeringInventoryDetails.ActiveBookings === 0) setDeleteModalShow(true);
                else setDeleteValidationModalShow(true);
            }

            // restrict to render form if type is delete ot toggle-status
            if (msg.type !== 'delete' && msg.type !== 'toggle-status') {
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

    enum ENUM_FITNESSPACKAGE_MODE {
        Online,
        Offline,
        Hybrid,
        Online_workout,
        Offline_workout,
        Residential
    }

    enum ENUM_FITNESSPACKAGE_PTCLASSSIZE {
        Solo,
        Couple,
        Family
    }

    const PRICING_TABLE_DEFAULT = [
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 30,
            sapienPricing: null,
            classes: null
        },
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 90,
            sapienPricing: null,
            classes: null
        },
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 180,
            sapienPricing: null,
            classes: null
        },
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 360,
            sapienPricing: null,
            classes: null
        }
    ];

    const PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING = [
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 1,
            sapienPricing: null,
            classes: null
        },
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 30,
            sapienPricing: null,
            classes: null
        },
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 90,
            sapienPricing: null,
            classes: null
        },
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 180,
            sapienPricing: null,
            classes: null
        },
        {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 360,
            sapienPricing: null,
            classes: null
        }
    ];

    function FillDetails(data: any) {
        const flattenedData = flattenObj({ ...data });
        const msg = flattenedData.fitnesspackages[0];

        const details: any = {};

        if (msg.groupinstantbooking) {
            for (let i = 0; i < msg.fitnesspackagepricing.length; i++) {
                PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].mrp = msg.fitnesspackagepricing[i].mrp;
                PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].suggestedPrice =
                    msg.fitnesspackagepricing[i].suggestedPrice;
                PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].voucher =
                    msg.fitnesspackagepricing[i].voucher;
                PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].sapienPricing =
                    msg.fitnesspackagepricing[i].sapienPricing;
            }
        } else {
            for (let j = 0; j < msg.fitnesspackagepricing.length; j++) {
                PRICING_TABLE_DEFAULT[j].mrp = msg.fitnesspackagepricing[j].mrp;
                PRICING_TABLE_DEFAULT[j].suggestedPrice =
                    msg.fitnesspackagepricing[j].suggestedPrice;
                PRICING_TABLE_DEFAULT[j].voucher = msg.fitnesspackagepricing[j].voucher;
                PRICING_TABLE_DEFAULT[j].sapienPricing = msg.fitnesspackagepricing[j].sapienPricing;
            }
        }
        details.About = msg.aboutpackage;
        details.Benifits = msg.benefits;
        details.packagename = msg.packagename;
        details.equipmentList = msg.equipment_lists;
        details.disciplines = msg.fitnessdisciplines;
        details.groupinstantbooking = JSON.stringify({
            instantBooking: msg.groupinstantbooking,
            freeDemo: msg.Is_free_demo
        });
        details.dates = JSON.stringify({
            startDate: moment(msg.Start_date).format('YYYY-MM-DD'),
            endDate: moment(msg.End_date).format('YYYY-MM-DD')
        });
        details.classsize = msg.classsize;
        details.expiryDate = moment(msg.expirydate).format('YYYY-MM-DD');
        details.level = ENUM_FITNESSPACKAGE_LEVEL[msg.level];
        details.intensity = ENUM_FITNESSPACKAGE_INTENSITY[msg.Intensity];
        details.pricingDetail = JSON.stringify(
            msg.groupinstantbooking
                ? PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING
                : PRICING_TABLE_DEFAULT
        );
        details.publishingDate = moment(msg.publishing_date).format('YYYY-MM-DD');
        details.tags = msg?.tags === null ? '' : msg.tags;
        details.user_permissions_user = msg.users_permissions_user.id;
        details.visibility = msg.is_private ? 1 : 0;
        details.programDetails = JSON.stringify({
            addressTag: msg.address === null ? 'At Client Address' : 'At My Address',
            address: [msg.address],
            mode: ENUM_FITNESSPACKAGE_MODE[msg.mode],
            offline: msg.groupoffline,
            online: msg.grouponline,
            rest: msg.restdays
        });
        details.thumbnail = msg.Thumbnail_ID;
        details.VideoUrl = msg.video_URL;
        details.datesConfig = JSON.stringify({
            expiryDate: msg.expiry_date,
            publishingDate: msg.publishing_date
        });
        details.durationOfOffering = msg.SubscriptionDuration
            ? msg.SubscriptionDuration
            : ['1 day', '30 days', '90 days', '180 days', '360 days'];
        details.bookingleadday = msg.bookingleadday;
        details.bookingConfigId = msg.booking_config?.id;
        details.languages = JSON.stringify(msg.languages);
        setGroupDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit(null);
    }
    useEffect(() => {
        if (operation.type === 'create') {
            setGroupDetails({});
        }
    }, [operation.type]);

    function FetchData() {
        useQuery(GET_SINGLE_PACKAGE_BY_ID, {
            variables: { id: operation.id },
            skip: operation.type === 'create' || !operation.id,
            onCompleted: (e: any) => {
                FillDetails(e);
            }
        });
    }

    function calculateDuration(sd, ed) {
        const start = moment(sd);
        const end = moment(ed);
        const duration: number = end.diff(start, 'days');
        return duration;
    }

    function CreatePackage(frm: any) {
        frmDetails = frm;
        frm.equipmentList = JSON.parse(frm.equipmentList)
            .map((x: any) => x.id)
            .join(',')
            .split(',');
        frm.disciplines = JSON.parse(frm.disciplines)
            .map((x: any) => x.id)
            .join(',')
            .split(',');
        frm.programDetails = JSON.parse(frm.programDetails);
        frm.datesConfig = frm.datesConfig
            ? JSON.parse(frm.datesConfig)
            : {
                  publishingDate: `${moment().add(1, 'days').format('YYYY-MM-DDTHH:mm')}`,
                  expiry_date: `${moment().add({ days: 1, year: 1 }).format('YYYY-MM-DDTHH:mm')}`
              };
        frm.groupinstantbooking = JSON.parse(frm.groupinstantbooking);
        frm.languages = JSON.parse(frm.languages);

        frm.dates = frm.dates
            ? JSON.parse(frm.dates)
            : {
                  startDate: `${moment().add(1, 'days').format('YYYY-MM-DD')}`,
                  endDate: `${moment(frm.dates.startDate).add(360, 'days')}`
              };

        createPackage({
            variables: {
                Industry: props.industry.industry.id,
                SubscriptionDuration: frm.durationOfOffering,
                packagename: frm.packagename,
                tags: frm?.tags,
                level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails.mode],
                address: frm.programDetails?.address[0]?.id,
                disciplines: frm.disciplines,
                duration:
                    frm.dates.startDate === frm.dates.endDate
                        ? 1
                        : calculateDuration(frm.dates.startDate, frm.dates.endDate),
                groupinstantbooking: frm.groupinstantbooking.instantBooking,
                Is_free_demo: frm.groupinstantbooking.freeDemo,
                groupoffline: frm.programDetails?.offline,
                grouponline: frm.programDetails?.online,
                classsize: frm.classsize,
                restdays: frm.programDetails?.rest,
                is_private: frm.visibility === 1 ? true : false,
                fitness_package_type: fitnessTypes[0].id,
                fitnesspackagepricing: JSON.parse(frm.pricingDetail).filter(
                    (item: any) => item.mrp !== null
                ),
                ptclasssize: ENUM_FITNESSPACKAGE_PTCLASSSIZE[frm.classSize],
                users_permissions_user: frm.user_permissions_user,
                publishing_date: moment.utc(frm.datesConfig?.publishingDate).local().format(),
                expiry_date: moment.utc(frm.datesConfig?.expiryDate).local().format(),
                thumbnail: frm.thumbnail,
                equipmentList: frm.equipmentList,
                videoUrl: frm?.VideoUrl,
                languages: frm.languages
                    .map((item: any) => item.id)
                    .join(', ')
                    .split(', '),
                Start_date: moment.utc(frm.dates.startDate).local().format(),
                End_date: moment.utc(frm.dates.startDate).add(360, 'days').local().format()
            }
        });
    }

    function EditPackage(frm: any) {
        frmDetails = frm;

        frm.equipmentList = JSON.parse(frm.equipmentList)
            .map((x: any) => x.id)
            .join(',')
            .split(',');
        frm.disciplines = JSON.parse(frm.disciplines)
            .map((x: any) => x.id)
            .join(',')
            .split(',');
        frm.programDetails = JSON.parse(frm.programDetails);
        frm.datesConfig = JSON.parse(frm.datesConfig);
        frm.groupinstantbooking = JSON.parse(frm.groupinstantbooking);
        frm.languages = JSON.parse(frm.languages);
        frm.dates = JSON.parse(frm.dates);

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
                address: frm.programDetails?.address[0]?.id,
                disciplines: frm.disciplines,
                duration:
                    frm.dates.startDate === frm.dates.endDate
                        ? 1
                        : calculateDuration(frm.dates.startDate, frm.dates.endDate),
                groupinstantbooking: frm.groupinstantbooking.instantBooking,
                Is_free_demo: frm.groupinstantbooking.freeDemo,
                groupoffline: frm.programDetails?.offline,
                grouponline: frm.programDetails?.online,
                classsize: frm.classsize,
                is_private: frm.visibility === 1 ? true : false,
                restdays: frm.programDetails?.rest,
                fitness_package_type: fitnessTypes[0].id,
                fitnesspackagepricing: JSON.parse(frm.pricingDetail).filter(
                    (item: any) => item.mrp !== null
                ),
                users_permissions_user: frm.user_permissions_user,
                publishing_date: moment.utc(frm.datesConfig?.publishingDate).local().format(),
                expiry_date: moment.utc(frm.datesConfig?.expiryDate).local().format(),
                thumbnail: frm.thumbnail,

                equipmentList: frm.equipmentList,
                videoUrl: frm?.VideoUrl,
                languages: frm.languages
                    .map((item: any) => item.id)
                    .join(', ')
                    .split(', '),
                SubscriptionDuration: frm.durationOfOffering,
                Start_date: moment.utc(frm.dates.startDate).local().format(),
                End_date: moment.utc(frm.dates.startDate).add(360, 'days').local().format()
            }
        });
    }

    function deleteChannelPackage(id: string) {
        deletePackage({ variables: { id } });
        setDeleteModalShow(false);
    }

    function updateChannelPackageStatus(id: string, status: boolean) {
        updatePackageStatus({ variables: { id: id, Status: status } });
        setStatusModalShow(false);
    }

    function OnSubmit(frm: any) {
        //bind user id
        if (frm) frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreatePackage(frm);
                break;
            case 'edit':
                EditPackage(frm);
                break;
            case 'toggle-status':
                setStatusModalShow(true);
                break;
            case 'delete':
                if (offeringInventoryDetails.ActiveBookings === 0) setDeleteModalShow(true);
                else setDeleteValidationModalShow(true);
                break;
        }
    }

    let name = '';
    if (operation.type === 'create') {
        name = 'Group Offering';
    } else if (operation.type === 'edit') {
        name = `Edit ${groupDetails.packagename}`;
    } else if (operation.type === 'view') {
        name = `Viewing ${groupDetails.packagename}`;
    }

    FetchData();

    return (
        <>
            <ModalView
                type={operation.type}
                customFormats={youtubeUrlCustomFormats}
                transformErrors={youtubeUrlTransformErrors}
                name={name}
                isStepper={true}
                showErrorList={false}
                formUISchema={
                    operation.type === 'view'
                        ? schemaView
                        : operation.type === 'edit'
                        ? EditSchema
                        : schema
                }
                stepperValues={['Creator', 'Details', 'Program', 'Schedule', 'Pricing', 'Config']}
                formSchema={personalTrainingSchema}
                formSubmit={
                    name === 'View'
                        ? () => {
                              modalTrigger.next(false);
                          }
                        : (form: any) => {
                              OnSubmit(form);
                          }
                }
                formData={groupDetails}
                widgets={widgets}
                modalTrigger={modalTrigger}
                actionType={operation.type}
            />

            {/* Delete modal validation (if classAvailability is greater than zero show this dailouge box) */}
            {offeringInventoryDetails && offeringInventoryDetails.ActiveBookings > 0 && operation.type === 'delete' ? (
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    show={deleteValidationModalShow}
                    centered
                >
                    <Modal.Header
                        closeButton
                        onHide={() => {
                            setDeleteValidationModalShow(false);
                        }}
                    >
                        <Modal.Title id="contained-modal-title-vcenter">
                            Oops!! Can&apos;t delete this Package
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Oops !! You are having <strong>active clients</strong> for this offering
                            , So, you can&apos;t delete it.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="success"
                            onClick={() => {
                                setDeleteValidationModalShow(false);
                            }}
                        >
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : null}

            {/* Delete Package modal */}
            {offeringInventoryDetails && offeringInventoryDetails.ActiveBookings === 0 ? (
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    show={deleteModalShow}
                    centered
                >
                    <Modal.Header
                        closeButton
                        onHide={() => {
                            setDeleteModalShow(false);
                        }}
                    >
                        <Modal.Title id="contained-modal-title-vcenter">Delete Package</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this package</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setDeleteModalShow(false);
                            }}
                        >
                            No
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => {
                                deleteChannelPackage(operation.id);
                            }}
                        >
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            ) : null}

            {/* Change Status Modal */}
            <Modal
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={statusModalShow}
                centered
            >
                <Modal.Header
                    closeButton
                    onHide={() => {
                        setStatusModalShow(false);
                    }}
                >
                    <Modal.Title id="contained-modal-title-vcenter">Update Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to update the status of this package?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setStatusModalShow(false);
                        }}
                    >
                        No
                    </Button>
                    <Button
                        variant="success"
                        onClick={() => {
                            updateChannelPackageStatus(operation.id, operation.current_status);
                        }}
                    >
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            {isFormSubmitted ? (
                <Toaster
                    handleCallback={() => setIsFormSubmitted(false)}
                    type="success"
                    msg="Offering has been Created successfully"
                />
            ) : null}

            {isOfferingDeleted ? (
                <Toaster
                    handleCallback={() => setisOfferingDeleted(!isOfferingDeleted)}
                    type="success"
                    msg="Offering has been deleted successfully"
                />
            ) : null}

            {isOfferingUpdated ? (
                <Toaster
                    handleCallback={() => setisOfferingUpdated(!isOfferingUpdated)}
                    type="success"
                    msg="Offering has been updated successfully"
                />
            ) : null}
        </>
    );
}

export default React.forwardRef(CreateEditPackage);
