import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ModalView from '../../../../components/modal';
import {
    CREATE_CHANNEL_PACKAGE,
    DELETE_PACKAGE,
    UPDATE_PACKAGE_STATUS,
    UPDATE_CHANNEL_COHORT_PACKAGE,
    CREATE_NOTIFICATION,
    CREATE_OFFERING_INVENTORY,
    UPDATE_OFFERING_INVENTORY,
    CREATE_TAG,
    DELETE_OFFERING_INVENTORY
} from '../graphQL/mutations';
import {
    youtubeUrlCustomFormats,
    youtubeUrlTransformErrors
} from '../../../../components/utils/ValidationPatterns';
import {
    GET_FITNESS_PACKAGE_TYPE,
    GET_SINGLE_PACKAGE_BY_ID,
    GET_INVENTORY
} from '../graphQL/queries';
import AuthContext from '../../../../context/auth-context';
import { schema, widgets } from './eventSchema';
import { schemaView } from './schemaView';
import { Subject } from 'rxjs';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import Toaster from '../../../../components/Toaster';
import { OfferingInventory } from '../../interface/offeringInventory';

interface Operation {
    id: string;
    packageType: 'Cohort' | 'Live Stream Channel';
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditEvent(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: { [name: string]: any } = require('./event.json');
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
    const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
    const [deleteValidationModalShow, setDeleteValidationModalShow] = useState<boolean>(false);
    const [statusModalShow, setStatusModalShow] = useState<boolean>(false);
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [isOffeeringDeleted, setisOffeeringDeleted] = useState<boolean>(false);
    const [isOfferingUpdated, setisOfferingUpdated] = useState<boolean>(false);
    const [offeringInventoryDetails, setOfferingInventoryDetails] = useState<OfferingInventory>(
        {} as OfferingInventory
    );

    let frmDetails: any = {};

    // eslint-disable-next-line
    const { data: inventories, refetch: refetch_inventories } = useQuery(
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

    const [editPackageDetails] = useMutation(UPDATE_CHANNEL_COHORT_PACKAGE, {
        onCompleted: (data) => {
            modalTrigger.next(false);
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
            setStatusModalShow(false);

            props.refetchTags();
            props.refetchOfferings();
            setisOfferingUpdated(!isOfferingUpdated);
        }
    });

    const [createOfferingInventory] = useMutation(CREATE_OFFERING_INVENTORY);
    const [updateOfferingInventory] = useMutation(UPDATE_OFFERING_INVENTORY);
    const [deleteOfferingInventory] = useMutation(DELETE_OFFERING_INVENTORY);

    const [deletePackage] = useMutation(DELETE_PACKAGE, {
        onCompleted: () => {
            //delete offering inventory
            deleteOfferingInventory({
                variables: { id: offeringInventoryDetails.id }
            });

            props.refetchTags();
            props.refetchOfferings();
            setisOffeeringDeleted(!isOffeeringDeleted);
        }
    });

    const [createTag] = useMutation(CREATE_TAG, {
        onCompleted: (response) => {
            modalTrigger.next(false);

            props.refetchTags();
            props.refetchOfferings();
            setIsFormSubmitted(!isFormSubmitted);
            // window.open(`event/session/scheduler/${response.createTag.data.id}`, '_self');
        }
    });

    const [createCohortNotification] = useMutation(CREATE_NOTIFICATION);

    const [CreateCohortPackage] = useMutation(CREATE_CHANNEL_PACKAGE, {
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response });

            createCohortNotification({
                variables: {
                    data: {
                        type: 'Offerings',
                        Title: 'New offering',
                        OnClickRoute: '/offerings',
                        users_permissions_user: auth.userid,
                        Body: `New event offering ${flattenData.createFitnesspackage.packagename} has been added`,
                        DateTime: moment().format(),
                        IsRead: false
                    }
                }
            });

            createOfferingInventory({
                variables: {
                    data: {
                        fitnesspackage: flattenData.createFitnesspackage.id,
                        ActiveBookings: 0,
                        ClassSize: flattenData.createFitnesspackage.classsize,
                        ClassAvailability: flattenData.createFitnesspackage.classsize,
                        changemaker_id: auth.userid,
                        ClientBookingDetails: []
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

    useQuery(GET_FITNESS_PACKAGE_TYPE, {
        onCompleted: (data) => {
            const flattenData = flattenObj({ ...data });
            setFitnessPackageTypes(flattenData.fitnessPackageTypes);
        }
    });

    const modalTrigger = new Subject();
    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            schema.startDate = props.startDate;
            schema.duration = props.duration;

            if (msg.type === 'toggle-status') {
                setStatusModalShow(true);
            }

            if (msg.type === 'delete' && offeringInventoryDetails.ActiveBookings !== null) {
                if (offeringInventoryDetails.ActiveBookings === 0) setDeleteModalShow(true);
                else setDeleteValidationModalShow(true);
            }

            // restrict to render when type is delete or toggle status
            if (msg.type !== 'delete' && msg.type !== 'toggle-status') {
                modalTrigger.next(true);
            }
        }
    }));

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

    function FillDetails(data) {
        const flattenData = flattenObj({ ...data });
        const msg: any = flattenData.fitnesspackages[0];
        const details: any = {};
        const courseDetails = { details: JSON.stringify(msg.Course_details[0]) };
        details.packageType = msg.fitness_package_type.type;
        details.About = msg.aboutpackage;
        details.Benifits = msg.benefits;
        details.packageName = msg.packagename;
        details.channelinstantBooking = msg.groupinstantbooking;
        details.expiryDate = moment(msg.expirydate).format('YYYY-MM-DD');
        // details.level = ENUM_FITNESSPACKAGE_LEVEL[msg.level];
        // details.intensity = ENUM_FITNESSPACKAGE_INTENSITY[msg.Intensity];
        details.equipment = msg.equipment_lists;
        // details.discpline = msg.fitnessdisciplines;
        details.pricing =
            msg.fitnesspackagepricing[0]?.mrp === 'free'
                ? 'free'
                : JSON.stringify(msg.fitnesspackagepricing);
        details.publishingDate = moment(msg.publishing_date).format('YYYY-MM-DD');
        details.tag = msg?.tags === null ? '' : msg.tags;
        details.user_permissions_user = msg.users_permissions_user.id;
        details.visibility = msg.is_private ? 1 : 0;
        details.classSize = msg.classsize;
        details.mode = ENUM_FITNESSPACKAGE_MODE[msg.mode];
        details.residential = msg.residential_type
            ? ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE[msg.residential_type]
            : null;
        details.languages = JSON.stringify(msg.languages);
        details.courseDetails = courseDetails;
        details.programDetails = JSON.stringify({
            addressTag: msg.address === null ? 'At Client Address' : 'At My Address',
            address: [msg.address],
            mode: ENUM_FITNESSPACKAGE_MODE[msg.mode],
            residential: msg.residential_type
                ? ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE[msg.residential_type]
                : null,
            accomodationDetails: msg.Accomdation_details
        });
        details.thumbnail = msg.Thumbnail_ID;
        details.VideoUrl = msg?.video_URL;
        details.datesConfig = JSON.stringify({
            expiryDate: msg.expiry_date,
            publishingDate: msg.publishing_date
        });
        details.dates = JSON.stringify({
            endDate: msg.End_date,
            startDate: msg.Start_date,
            oneDay:
                moment(msg.End_date).format('YYYY-MM-DD') ===
                moment(msg.Start_date).format('YYYY-MM-DD')
        });

        setProgramDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit(null);
    }

    useEffect(() => {
        if (operation.type === 'create') {
            setProgramDetails({});
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

    function findPackageType(creationType: any) {
        const foundType = fitnessPackageTypes.find((item) => item.type === creationType);
        return foundType.id;
    }

    function calculateDuration(sd, ed) {
        const start = moment(sd);
        const end = moment(ed);
        const duration: number = end.diff(start, 'days');
        return duration;
    }

    function createCohort(frm: any) {
        frmDetails = frm;
        frm.programDetails = JSON.parse(frm.programDetails);
        frm.languages = JSON.parse(frm.languages);
        frm.courseDetails.details = JSON.parse(frm.courseDetails.details);
        frm.dates = JSON.parse(frm.dates);
        frm.datesConfig = JSON.parse(frm.datesConfig);
        if (frm.equipment) {
            frm.equipment = JSON.parse(frm?.equipment);
        }
        if (frm.discpline) {
            frm.discpline = JSON.parse(frm?.discpline);
        }
        CreateCohortPackage({
            variables: {
                aboutpackage: frm.About,
                benefits: frm.Benifits,
                packagename: frm.packageName,
                channelinstantBooking: frm.channelinstantBooking,
                expiry_date: moment(frm.datesConfig.expiryDate).toISOString(),
                // level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
                // Intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
                equipmentList:
                    frm?.equipment?.length > 0
                        ? frm.equipment
                              .map((x: any) => x.id)
                              .join(',')
                              .split(',')
                        : [],
                duration:
                    frm.dates.startDate === frm.dates.endDate
                        ? 1
                        : calculateDuration(frm.dates.startDate, frm.dates.endDate),
                // fitnessdisciplines:
                //   frm?.discpline?.length > 0
                //     ? frm.discpline
                //         .map((item: any) => item.id)
                //         .join(', ')
                //         .split(', ')
                //     : [],
                fitnesspackagepricing:
                    frm.pricing === 'free'
                        ? [
                              {
                                  mrp: 'free',
                                  duration: calculateDuration(
                                      frm.dates.publishingDate,
                                      frm.dates.expiryDate
                                  )
                              }
                          ]
                        : JSON.parse(frm.pricing),
                publishing_date: moment(frm.datesConfig.publishingDate).toISOString(),
                tags: frm.tag,
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true,
                classsize: frm.classSize,
                address:
                    frm.programDetails?.addressTag === 'At My Address'
                        ? frm.programDetails?.address[0]?.id
                        : null,
                mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails?.mode],
                residential_type:
                    ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE[frm.programDetails?.residential],
                languages: frm.languages
                    .map((item: any) => item.id)
                    .join(', ')
                    .split(', '),
                Start_date: moment(frm.dates.startDate).toISOString(),
                End_date: moment(frm.dates.startDate).toISOString(),
                Course_details: frm.courseDetails.details,
                thumbnail: frm.thumbnail,
                videoUrl: frm.VideoUrl,
                Accomdation_details: frm.programDetails.accomodationDetails
            }
        });
    }

    function editCohort(frm) {
        frmDetails = frm;
        frm.programDetails = JSON.parse(frm.programDetails);
        frm.languages = JSON.parse(frm.languages);
        frm.courseDetails.details = JSON.parse(frm.courseDetails.details);
        frm.dates = JSON.parse(frm.dates);
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
                packagename: frm.packageName,
                equipmentList:
                    frm?.equipment?.length > 0
                        ? frm.equipment
                              .map((x: any) => x.id)
                              .join(',')
                              .split(',')
                        : [],
                fitnesspackagepricing:
                    frm.pricing === 'free'
                        ? [
                              {
                                  mrp: 'free',
                                  duration: calculateDuration(
                                      frm.dates.publishingDate,
                                      frm.dates.expiryDate
                                  )
                              }
                          ]
                        : JSON.parse(frm.pricing),
                publishing_date: moment(frm.datesConfig.publishingDate).toISOString(),
                expiry_date: moment(frm.datesConfig.expiryDate).toISOString(),
                tags: frm.tag,
                duration:
                    frm.dates.startDate === frm.dates.endDate
                        ? 1
                        : calculateDuration(frm.dates.startDate, frm.dates.endDate),
                users_permissions_user: frm.user_permissions_user,
                fitness_package_type: findPackageType(operation.packageType),
                is_private: frm.visibility === 0 ? false : true,
                classsize: frm.classSize,
                address:
                    frm.programDetails?.addressTag === 'At My Address'
                        ? frm.programDetails?.address[0]?.id
                        : null,
                mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails?.mode],
                residential_type:
                    ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE[frm.programDetails?.residential],
                languages: frm.languages
                    .map((item: any) => item.id)
                    .join(', ')
                    .split(', '),
                startTime: frm.startTime,
                endTime: frm.endTime,
                Start_date: moment(frm.dates.startDate).toISOString(),
                End_date: moment(frm.dates.endDate).toISOString(),
                Course_details: frm.courseDetails.details,
                thumbnail: frm.thumbnail,
                videoUrl: frm.VideoUrl,
                Accomdation_details: frm.programDetails.accomodationDetails
            }
        });
    }

    function deleteChannelPackage(id: any) {
        deletePackage({ variables: { id } });
        setDeleteModalShow(false);
    }

    function updateChannelPackageStatus(id: any, status: any) {
        updatePackageStatus({ variables: { id: id, Status: status } });
        setStatusModalShow(false);
        operation.type = 'create';
    }

    function OnSubmit(frm: any) {
        //bind user id
        if (frm) frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                createCohort(frm);
                break;
            case 'edit':
                editCohort(frm);
                break;
            case 'delete':
                if (offeringInventoryDetails.ActiveBookings === 0) setDeleteModalShow(true);
                else setDeleteValidationModalShow(true);
                break;
            case 'toggle-status':
                setStatusModalShow(true);
                break;
        }
    }

    let name = '';
    if (operation.type === 'create') {
        name = 'Event Offering';
    } else if (operation.type === 'edit') {
        name = `Edit ${programDetails.packageName}`;
    } else if (operation.type === 'view') {
        name = `Viewing ${programDetails.packageName}`;
    }

    FetchData();

    return (
        <>
            <ModalView
                name={name}
                isStepper={true}
                showErrorList={false}
                customFormats={youtubeUrlCustomFormats}
                transformErrors={youtubeUrlTransformErrors}
                formUISchema={operation.type === 'view' ? schemaView : schema}
                formSchema={programSchema}
                formSubmit={
                    name === 'View'
                        ? () => {
                              modalTrigger.next(false);
                          }
                        : (frm: any) => {
                              OnSubmit(frm);
                          }
                }
                formData={programDetails}
                stepperValues={['Creator', 'Details', 'Program', 'Pricing', 'config']}
                widgets={widgets}
                modalTrigger={modalTrigger}
                actionType={operation.type}
            />

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
                    <p>Are you sure you want to delete this package ?</p>
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

            {/* Delete modal */}
            {offeringInventoryDetails && offeringInventoryDetails.ActiveBookings === 0 ? (
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
            ) : null}

            {isFormSubmitted ? (
                <Toaster
                    handleCallback={() => setIsFormSubmitted(false)}
                    type="success"
                    msg="Offering has been Created successfully"
                />
            ) : null}

            {isOffeeringDeleted ? (
                <Toaster
                    handleCallback={() => setisOffeeringDeleted(!isOffeeringDeleted)}
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

export default React.forwardRef(CreateEditEvent);
