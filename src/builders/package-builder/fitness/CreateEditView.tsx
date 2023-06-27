import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import AuthContext from '../../../context/auth-context';
import FitnessClasses from './widgetCustom/FitnessClasses/FitnessClasses';
import FitnessRestday from './widgetCustom/FitnessRestday';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SINGLE_PACKAGE_BY_ID, GET_FITNESS_PACKAGE_TYPE } from './graphQL/queries';
import ModalPreview from './widgetCustom/Preview/FitnessPreview';
import './CreateEditView.css';
import {
    CREATE_PACKAGE,
    DELETE_PACKAGE,
    EDIT_PACKAGE,
    UPDATE_PACKAGE_PRIVATE
} from './graphQL/mutations';
import StatusModal from '../../../components/StatusModal/StatusModal';
import FitnessMultiSelect from './widgetCustom/FitnessMultiSelect';
import EquipmentListSelect from '../../../components/customWidgets/equipmentListSelect';
import FitnessAddress from './widgetCustom/FitnessAddress';
import FitnessPricingTable from './widgetCustom/tableComponent/FitnessPricingTable';
import FitnessDuration from './widgetCustom/FitnessDuration';
import FitnessMode from './widgetCustom/FitnessMode/FitnessMode';
import BookingLeadday from './widgetCustom/FitnessBooking/BookingLeadday';
import BookingLeadTime from './widgetCustom/FitnessBooking/BookingLeadTime';
import { Subject } from 'rxjs';
import CreateFitnessPackageModal from '../../../components/CreateFitnessPackageModal/CreateFitnessPackageModal';
import Upload from '../../../components/upload/upload';
import { flattenObj } from '../../../components/utils/responseFlatten';

interface Operation {
    id: string;
    actionType: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    type: 'One-On-One' | 'Group Class' | 'Custom Fitness' | 'Classic Class';
    current_status: boolean;
}

function CreateEditView(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [userData, setUserData] = useState<any>('');
    const [packageTypeName, setPackageTypeName] = useState<string | null>('personal-training');
    const [actionName, setActionName] = useState<string>('');
    const [formData, setFormData] = useState<any>();
    const [sapienFitnessPackageTypes, setSapienFitnessPackageTypes] = useState<any>([]);
    const ptSchema = require('./personal-training/personal-training.json');
    const groupSchema = require('./group/group.json');
    const classicSchema = require('./classic/classic.json');
    const customSchema = require('./custom/custom.json');
    const jsonSchema = require(`./${packageTypeName}/${packageTypeName}.json`);
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [bookingsConfigInfo, setBookingsConfigInfo] = useState<any[]>([]);

    const modalTrigger = new Subject();

    useEffect(() => {
        const { actionType, type } = operation;

        if (type === 'One-On-One') {
            setPackageTypeName('personal-training');
        } else if (type === 'Group Class') {
            setPackageTypeName('group');
        } else if (type === 'Classic Class') {
            setPackageTypeName('classic');
        } else if (type === 'Custom Fitness') {
            setPackageTypeName('custom');
        }

        if (actionType === 'create') {
            setActionName('Create New');
        } else if (actionType === 'edit') {
            setActionName('Edit');
        } else if (actionType === 'view') {
            setActionName('View');
        }
    }, [operation]);

    let fitness_package_type: string | undefined = '';
    if (operation.actionType === 'view' || operation.actionType === 'edit') {
        fitness_package_type = formData?.fitness_package_type.type;
    } else if (operation.actionType === 'create') {
        if (operation.type === 'One-On-One') {
            fitness_package_type = 'One-On-One';
        } else if (operation.type === 'Group Class') {
            fitness_package_type = 'Group Class';
        } else if (operation.type === 'Custom Fitness') {
            fitness_package_type = 'Custom Fitness';
        } else if (operation.type === 'Classic Class') {
            fitness_package_type = 'Classic Class';
        }
    }

    const widgets = {};

    const pricingDetailRef = useRef<{ getFitnessPackagePricing?: any }>({});

    const uiSchema: any = {
        disciplines: {
            'ui:widget': (props) => (
                <FitnessMultiSelect widgetProps={props} actionType={operation.actionType} />
            )
        },
        equipmentList: {
            'ui:widget': (props: { onChange: () => void; value: string }) => (
                <EquipmentListSelect onChange={props.onChange} value={props.value} />
            )
        },
        address: {
            'ui:widget': (props: any) => (
                <FitnessAddress
                    actionType={operation.actionType}
                    widgetProps={props}
                    PTProps={ptSchema[3]}
                />
            )
        },
        mode: {
            'ui:widget': (props) => (
                <FitnessMode
                    widgetProps={props}
                    PTProps={ptSchema[3]}
                    groupProps={groupSchema[3]}
                    type={operation.type}
                    actionType={operation.actionType}
                    userData={userData}
                />
            )
        },
        duration: {
            'ui:widget': (props) => (
                <FitnessDuration
                    type={operation.type}
                    actionType={operation.actionType}
                    userData={userData}
                    widgetProps={props}
                />
            )
        },

        ptonline: {
            'ui:widget': (props) => (
                <FitnessClasses
                    packageTypeName={packageTypeName}
                    actionType={operation.actionType}
                    PTProps={ptSchema[3]}
                    groupProps={groupSchema[3]}
                    classicProps={classicSchema[3]}
                    customProps={customSchema[3]}
                    widgetProps={props}
                    userData={userData}
                />
            )
        },

        ptoffline: {
            'ui:widget': (props) => (
                <FitnessClasses
                    packageTypeName={packageTypeName}
                    actionType={operation.actionType}
                    PTProps={ptSchema[3]}
                    groupProps={groupSchema[3]}
                    classicProps={classicSchema[3]}
                    customProps={customSchema[3]}
                    widgetProps={props}
                    userData={userData}
                />
            )
        },

        grouponline: {
            'ui:widget': (props) => (
                <FitnessClasses
                    packageTypeName={packageTypeName}
                    actionType={operation.actionType}
                    PTProps={ptSchema[3]}
                    groupProps={groupSchema[3]}
                    classicProps={classicSchema[3]}
                    customProps={customSchema[3]}
                    widgetProps={props}
                    userData={userData}
                />
            )
        },

        groupoffline: {
            'ui:widget': (props) => (
                <FitnessClasses
                    packageTypeName={packageTypeName}
                    actionType={operation.actionType}
                    PTProps={ptSchema[3]}
                    groupProps={groupSchema[3]}
                    classicProps={classicSchema[3]}
                    customProps={customSchema[3]}
                    widgetProps={props}
                    userData={userData}
                />
            )
        },

        recordedclasses: {
            'ui:widget': (props) => (
                <FitnessClasses
                    packageTypeName={packageTypeName}
                    actionType={operation.actionType}
                    PTProps={ptSchema[3]}
                    groupProps={groupSchema[3]}
                    classicProps={classicSchema[3]}
                    customProps={customSchema[3]}
                    widgetProps={props}
                    userData={userData}
                />
            )
        },

        restdays: {
            'ui:widget': (props: any) => (
                <FitnessRestday
                    actionType={operation.actionType}
                    classicProps={classicSchema[3]}
                    PTProps={ptSchema[3]}
                    groupProps={groupSchema[3]}
                    customProps={customSchema[3]}
                    widgetProps={props}
                    userData={userData}
                    type={operation.type}
                />
            )
        },

        bookingleadday: {
            'ui:widget': (props: any) => (
                <BookingLeadday
                    widgetProps={props}
                    actionType={operation.actionType}
                    userData={userData}
                />
            )
        },

        bookingleadtime: {
            'ui:widget': (props: any) => (
                <BookingLeadTime
                    widgetProps={props}
                    actionType={operation.actionType}
                    userData={userData}
                />
            )
        },

        level: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        is_private: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },

        aboutpackage: {
            'ui:widget': 'textarea',
            'ui:autofocus': true,
            'ui:options': {
                rows: 3
            }
        },
        benefits: {
            'ui:widget': 'textarea',
            'ui:options': {
                rows: 3
            }
        },

        ptclasssize: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },

        thumbnail: {
            'ui:widget': (props: any) => {
                return (
                    <Upload
                        allowImage={true}
                        allowVideo={false}
                        onChange={props.onChange}
                        value={props.value}
                        title={'Thumbnail'}
                    />
                );
            }
        },

        upload: {
            'ui:widget': (props: any) => {
                return (
                    <Upload
                        allowImage={true}
                        allowVideo={true}
                        onChange={props.onChange}
                        value={props.value}
                        title={'upload picture or video'}
                    />
                );
            }
        },

        introvideourl: {
            'ui:placeholder': 'http://'
        },

        groupinstantbooking: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },

        type: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },

        pricingDetail: {
            'ui:widget': (props) => (
                <FitnessPricingTable
                    userData={userData}
                    setUserData={setUserData}
                    type={operation.type}
                    packageTypeName={packageTypeName}
                    actionType={operation.actionType}
                    pricingDetailRef={pricingDetailRef}
                    widgetProps={props}
                    formData={formData}
                    auth={auth}
                />
            )
        },

        carousel: {
            'ui:widget': () => (
                <ModalPreview
                    userData={userData}
                    type={operation.type}
                    actionType={operation.actionType}
                    packageType={packageTypeName}
                    fitnesspackagepricing={pricingDetailRef.current.getFitnessPackagePricing?.()}
                />
            )
        }
    };

    const FetchData = () => {
        useQuery(GET_FITNESS_PACKAGE_TYPE, {
            onCompleted: (data) => {
                const flattedData = flattenObj({ ...data });
                setSapienFitnessPackageTypes(flattedData.fitnessPackageTypes);
            }
        });

        useQuery(GET_SINGLE_PACKAGE_BY_ID, {
            variables: {
                id: operation.id
            },
            onCompleted: (dataPackage: any) => {
                FillDetails(dataPackage);
            },
            skip: !operation.id || operation.actionType === 'delete'
        });
    };

    FetchData();

    const FillDetails = (dataPackage: any) => {
        const flattedData = flattenObj({ ...dataPackage });
        const packageDetail = flattedData.fitnesspackages[0];

        // let {
        //   id,
        //   packagename,
        //   tags,
        //   disciplines,
        //   fitness_package_type,
        //   aboutpackage,
        //   benefits,
        //   level,
        //   mode,
        //   ptoffline,
        //   ptonline,
        //   grouponline,
        //   groupoffline,
        //   recordedclasses,
        //   restdays,
        //   fitnesspackagepricing,
        //   bookingleadday,
        //   bookingleadtime,
        //   duration,
        //   groupstarttime,
        //   groupendtime,
        //   groupinstantbooking,
        //   address,
        //   ptclasssize,
        //   classsize,
        //   groupdays,
        //   introvideourl,
        //   is_private,
        //   Upload_ID,
        //   Thumbnail_ID,
        //   equipment_lists,
        // } = packageDetail;

        // if (mode === "Offline_workout") {
        //   mode = "Offline Workout";
        // } else if (mode === "Online_workout") {
        //   mode = "Online Workout";
        // }

        // if (bookingleadtime) {
        //   bookingleadday = 0;
        // } else if (bookingleadday) {
        //   bookingleadtime = "";
        // }

        // const updateFormData = updateform.createUpdateForm(
        //   id,
        //   packagename,
        //   tags,
        //   disciplines,
        //   fitness_package_type,
        //   aboutpackage,
        //   benefits,
        //   level,
        //   mode,
        //   ptoffline,
        //   ptonline,
        //   grouponline,
        //   groupoffline,
        //   recordedclasses,
        //   restdays,
        //   fitnesspackagepricing,
        //   bookingleadday,
        //   bookingleadtime,
        //   duration,
        //   groupstarttime,
        //   groupendtime,
        //   groupinstantbooking,
        //   address,
        //   ptclasssize,
        //   classsize,
        //   groupdays,
        //   introvideourl,
        //   is_private,
        //   Upload_ID,
        //   Thumbnail_ID,
        //   equipment_lists
        // );

        // setFormData(updateFormData);

        // if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.actionType) > -1) {
            modalTrigger.next(true);
        } else {
            OnSubmit(null);
        }
    };

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            handleSubmitName(msg.actionType);

            if (msg.actionType === 'toggle-status') {
                setShowStatusModal(true);
            }

            if (msg.actionType === 'delete') {
                setShowDeleteModal(true);
            }

            if (msg.actionType !== 'delete' && msg.actionType !== 'toggle-status') {
                modalTrigger.next(true);
            }
        }
    }));

    const [createPackage] = useMutation(CREATE_PACKAGE, {
        variables: {
            users_permissions_user: auth.userid
        },
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
        }
    });

    const [deletePackage] = useMutation(DELETE_PACKAGE, {
        onCompleted: () => {
            props.callback();
        }
    });

    const [updateStatus] = useMutation(UPDATE_PACKAGE_PRIVATE, {
        onCompleted: (r: any) => {
            props.callback();
        }
    });

    const [editPackage] = useMutation(EDIT_PACKAGE, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
        }
    });

    const TogglePackageStatus = (id: string, currentStatus: boolean) => {
        updateStatus({
            variables: {
                id,
                is_private: !currentStatus
            }
        });
    };

    function CreatePackage(frm) {
        const fitnessPackageId = sapienFitnessPackageTypes.find(
            (x) => x.type === frm.fitness_package_type
        ).id;
        frm.fitness_package_type = fitnessPackageId;
        frm.equipmentList = JSON.parse(frm.equipmentList)
            .map((x: any) => x.id)
            .join(', ')
            .split(', ');
        createPackage({ variables: frm });
    }

    function EditPackage(frm: any) {
        const fitnessPackageId = sapienFitnessPackageTypes.find(
            (x) => x.type === frm.fitness_package_type
        ).id;
        frm.fitness_package_type = fitnessPackageId;
        frm.equipmentList = JSON.parse(frm.equipmentList)
            .map((x: any) => x.id)
            .join(', ')
            .split(', ');
        editPackage({ variables: frm });
    }

    const DeletePackage = (id: any) => {
        deletePackage({ variables: { id: id } });
    };

    function OnSubmit(frm: any) {
        //bind user id
        if (frm) frm.user_permissions_user = auth.userid;

        switch (operation.actionType) {
            case 'create':
                CreatePackage(frm);
                break;
            case 'edit':
                EditPackage(frm);
                break;
        }
    }

    const handleSubmitName = (actionType: string) => {
        let action = '';
        switch (actionType) {
            case 'create':
                action = 'Create';
                break;

            case 'edit':
                action = 'Update';
                break;

            case 'view':
                action = 'Looks Good';
                break;
        }
        return action;
    };

    return (
        <>
            {
                <CreateFitnessPackageModal
                    modalTrigger={modalTrigger}
                    pricingDetailRef={pricingDetailRef}
                    stepperValues={[
                        'Creator',
                        'Details',
                        'Program',
                        'Schedule',
                        'Pricing',
                        'Preview'
                    ]}
                    fitness_package_type={fitness_package_type}
                    name={actionName}
                    isStepper={true}
                    formUISchema={uiSchema}
                    formSchema={jsonSchema}
                    userData={userData}
                    setUserData={setUserData}
                    formSubmit={(frm: any) => OnSubmit(frm)}
                    widgets={widgets}
                    formData={operation.id && formData}
                    PTProps={ptSchema[3]}
                    groupProps={groupSchema[3]}
                    classicProps={classicSchema[3]}
                    customProps={customSchema[3]}
                    actionType={operation.actionType}
                    operation={operation}
                    setOperation={setOperation}
                    type={operation.type}
                    submitName={handleSubmitName(operation.actionType)}
                />
            }

            {/* Status Modal */}
            {showStatusModal && (
                <StatusModal
                    show={showStatusModal}
                    onHide={() => setShowStatusModal(false)}
                    modalTitle="Change Status"
                    modalBody="Do you want to change status ?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => TogglePackageStatus(operation.id, operation.current_status)}
                />
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <StatusModal
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    modalTitle="Delete"
                    modalBody="Do you want to delete this package ?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => DeletePackage(operation.id)}
                />
            )}
        </>
    );
}

export default React.forwardRef(CreateEditView);
