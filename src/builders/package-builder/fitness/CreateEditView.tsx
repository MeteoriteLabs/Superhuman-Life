import React, { useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ModalView from '../../../components/modal';
import AuthContext from '../../../context/auth-context';

import ModalCustomClasses from './widgetCustom/FitnessClasses';
import ModalCustomRestday from './widgetCustom/FitnessRestday';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SINGLE_PACKAGE_BY_ID } from './graphQL/queries';
import ModalPreview from './widgetCustom/Preview/FitnessPreview';
import './CreateEditView.css'
import { CREATE_PACKAGE, DELETE_PACKAGE, EDIT_PACKAGE, UPDATE_PACKAGE_PRIVATE } from './graphQL/mutations';
import StatusModal from '../../../components/StatusModal/StatusModal';
import FitnessMultiSelect from './widgetCustom/FitnessMultiSelect'
import FitnessAddress from './widgetCustom/FitnessAddress';
import FitnessPricingTable from './widgetCustom/FitnessPricingTable'
import FitnessDuration from './widgetCustom/FitnessDuration';
import FitnessBookingLeadday from './widgetCustom/FitnessBookingLeadday/FitnessBookingLeadday';


interface Operation {
    id: string;
    actionType: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    type: 'Personal Training' | 'Group Class' | 'Custom Fitness' | 'Classic Class';
    current_status: boolean;
}


interface UserDataProps {
    packagename: string;
    tags: string;
    disciplines: { typename: string, id: string, disciplines: string }[];
    type: string;
    aboutpackage: string;
    benefits: string;
    level: string;
    mode: string;
    address: { id: string, __typename: string };
    ptclasssize: string;
    classsize: number;
    ptonline: number | null;
    ptoffline: number | null;
    restdays: number;
    bookingleadday: number;
    fitnesspackagepricing: any;
    is_private: boolean;
    introvideourl: string;
    fitness_package_type: { id: string, type: string, __typename: string };
    duration: number
}


function CreateEditView(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [userData, setUserData] = useState<any>('');
    const [fitnesspackagepricing, setFitnesspackagepricing] = useState<any>([
        {
            "duration": 30,
            "voucher": "Choose voucher",
            "mrp": "",
        },
        {
            "duration": 90,
            "voucher": "Choose voucher",
            "mrp": "",
        },
        {
            "duration": 180,
            "voucher": "Choose voucher",
            "mrp": "",
        },
        {
            "duration": 360,
            "voucher": "Choose voucher",
            "mrp": "",
        },
    ]
    )
    const [packageTypeName, setPackageTypeName] = useState<string | null>('personal-training');
    const [actionName, setActionName] = useState<string>("")
    const [formData, setFormData] = useState<UserDataProps>();
    const [render, setRender] = useState<boolean>(false);


    const ptSchema = require("./personal-training/personal-training.json");
    const groupSchema = require("./group/group.json");
    const classicSchema = require("./classic/classic.json");
    const customSchema = require("./custom/custom.json");
 
    const jsonSchema = require(`./${packageTypeName}/${packageTypeName}.json`);



    useEffect(() => {
        const { actionType, type } = operation;

        if (type === 'Personal Training') {
            setPackageTypeName("personal-training");
        } else if (type === 'Group Class') {
            setPackageTypeName("group");
        } else if (type === 'Classic Class') {
            setPackageTypeName("classic");
        } else if (type === 'Custom Fitness') {
            setPackageTypeName("custom");
        };


        if (actionType === 'create') {
            setActionName("Create New");
        } else if (actionType === 'edit') {
            setActionName("Edit");
        } else if (actionType === 'view') {
            setActionName("View");
        };

    }, [operation]);


    // console.log('parent')


    let fitness_package_type: string | undefined = ''
    if (operation.actionType === "view" || operation.actionType === 'edit') {
        fitness_package_type = formData?.fitness_package_type.id
    } else if (operation.actionType === "create") {
        if (operation.type === "Personal Training") {
            fitness_package_type = props.packageType.fitnessPackageTypes[0].id;
        } else if (operation.type === "Group Class") {
            fitness_package_type = props.packageType.fitnessPackageTypes[1].id;
        } else if (operation.type === "Custom Fitness") {
            fitness_package_type = props.packageType.fitnessPackageTypes[2].id;
        } else if (operation.type === "Classic Class") {
            fitness_package_type = props.packageType.fitnessPackageTypes[3].id;
        }
    }





    const widgets = {
        // ModalCustomClasses,
        // FitnessMultiSelect
    }




    const pricingDetailRef = useRef<{ getFitnessPackagePricing?: Function }>({});

    const uiSchema: any = {
        "disciplines": {
            'ui:widget': (props) => <FitnessMultiSelect widgetProps={props} actionType={operation.actionType} />
        },
        "address": {
            "ui:widget": (props) => <FitnessAddress actionType={operation.actionType} widgetProps={props} />

        },
        "duration": {
            "ui:widget": (props) => <FitnessDuration type={operation.type} actionType={operation.actionType} widgetProps={props} />
        },

        "ptonline": {
            "ui:widget": (props) => <ModalCustomClasses packageTypeName={packageTypeName} actionType={operation.actionType} PTProps={ptSchema[3]} groupProps={groupSchema[3]} recordedProps={classicSchema[3]} customProps= {customSchema[3]} widgetProps={props} />
        },

        "ptoffline": {
            "ui:widget": (props) => <ModalCustomClasses packageTypeName={packageTypeName} actionType={operation.actionType} PTProps={ptSchema[3]} groupProps={groupSchema[3]} recordedProps={classicSchema[3]} customProps= {customSchema[3]} widgetProps={props} />
        },

        "grouponline": {
            "ui:widget": (props) => <ModalCustomClasses packageTypeName={packageTypeName} actionType={operation.actionType} PTProps={ptSchema[3]} groupProps={groupSchema[3]} recordedProps={classicSchema[3]} customProps= {customSchema[3]} widgetProps={props} />
        },

        "groupoffline": {
            "ui:widget": (props) => <ModalCustomClasses packageTypeName={packageTypeName} actionType={operation.actionType} PTProps={ptSchema[3]} groupProps={groupSchema[3]} recordedProps={classicSchema[3]} customProps= {customSchema[3]} widgetProps={props} />
        },

        "recordedclasses": {
            "ui:widget": (props) => <ModalCustomClasses packageTypeName={packageTypeName} actionType={operation.actionType} classicProps={classicSchema[3]} PTProps={ptSchema[3]} groupProps={groupSchema[3]} customProps= {customSchema[3]} recordedProps={classicSchema[3]}  widgetProps={props} />
        },

        "restdays": {
            "ui:widget": (props: any) => <ModalCustomRestday actionType={operation.actionType} classicProps={classicSchema[3]} PTProps={ptSchema[3]} widgetProps={props} />

        },

        "bookingleadday":{
            "ui:widget":(props:any) => <FitnessBookingLeadday type={operation.type} userData={userData} widgetProps={props}/>
        },

        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },
        "is_private": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },
        "mode": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
       
        "aboutpackage": {
            "ui:widget": "textarea",
            "ui:autofocus": true,
            "ui:options": {
                "rows": 3
            }
        },
        "benefits": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3,
            },
        },

        "ptclasssize": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },


        "introvideourl": {
            "ui:placeholder": "http://"
        },




        "groupinstantbooking": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },

        "type": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },

        "pricingDetail": {
            "ui:widget": (props) => <FitnessPricingTable
                userData={userData}
                setUserData={setUserData}
                type={operation.type}
                packageTypeName={packageTypeName}
                actionType={operation.actionType}
                pricingDetailRef={pricingDetailRef}
                widgetProps={props}
                formData={formData && formData.fitnesspackagepricing[0].packagepricing}
            />,
        },


        "carousel": {
            "ui:widget": () => <ModalPreview
                userData={userData}
                type={operation.type}
                actionType={operation.actionType}
                packageType={packageTypeName}
                fitnesspackagepricing={pricingDetailRef.current.getFitnessPackagePricing?.()} />
        },
    }



    // if (operation.actionType === "edit" || operation.actionType === "view") {
    // }

    const FetchData = () => {
        useQuery(GET_SINGLE_PACKAGE_BY_ID, {
            variables: {
                id: operation.id,
                skip: (!operation.id),
                users_permissions_user: auth.userid
            },
            onCompleted: (dataPackage: any) => {
                FillDetails(dataPackage)
            }
        });

    };

    FetchData()


    const FillDetails = (dataPackage: any) => {
        const packageDetail = dataPackage.fitnesspackage;
        console.log("packageDetail", packageDetail)
        const { id, packagename, tags, disciplines, fitness_package_type, aboutpackage, benefits, level, mode, ptoffline, ptonline, grouponline, groupoffline, recordedclasses, restdays, fitnesspackagepricing, bookingleadday, duration, groupstarttime, groupendtime, groupinstantbooking, address, ptclasssize, classsize, groupdays, introvideourl, is_private } = packageDetail

        let updateFormData: any = {};
        updateFormData.id = id
        updateFormData.packagename = packagename;
        updateFormData.tags = tags;
        updateFormData.level = level;
        updateFormData.aboutpackage = aboutpackage
        updateFormData.disciplines = JSON.stringify(disciplines);
        updateFormData.fitness_package_type = fitness_package_type;
        updateFormData.benefits = benefits;
        updateFormData.mode = mode;
        updateFormData.address = address?.id;
        updateFormData.ptclasssize = ptclasssize;
        updateFormData.ptonline = ptonline;
        updateFormData.ptoffline = ptoffline;
        updateFormData.grouponline = grouponline;
        updateFormData.groupoffline = groupoffline;
        updateFormData.recordedclasses = recordedclasses;
        updateFormData.restdays = restdays;
        updateFormData.bookingleadday = bookingleadday;
        updateFormData.duration = duration;
        updateFormData.groupstarttime = groupstarttime;
        updateFormData.groupendtime = groupendtime;
        updateFormData.groupinstantbooking = groupinstantbooking;
        updateFormData.fitnesspackagepricing = fitnesspackagepricing
        updateFormData.classsize = classsize;
        updateFormData.groupdays = groupdays;
        updateFormData.introvideourl = introvideourl;
        updateFormData.is_private = is_private;

        setFormData(updateFormData);

        // if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.actionType) > -1) {
            setRender(true)
        }
        else {
            OnSubmit(null);
        }
    }

    // console.log('form data parent', formData)



    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            console.log('msg', msg)
            setOperation(msg);

            //render form if no message id
            if (msg && !msg.id) {
                setRender(true);
            }
        }
    }));


    const [createPackage] = useMutation(CREATE_PACKAGE, {
        variables: { users_permissions_user: auth.userid },
        onCompleted: (r: any) => {
            console.log(r);
            setRender(false)
        }
    })

    const [deletePackage] = useMutation(DELETE_PACKAGE);

    const [updateStatus] = useMutation(UPDATE_PACKAGE_PRIVATE);

    const [editPackage] = useMutation(EDIT_PACKAGE, {
        onCompleted: (data: any) => {
            console.log('r', data);
            setRender(false)
        }
    });

    const TogglePackageStatus = (id: string, currentStatus: boolean) => {
        updateStatus({
            variables: {
                id,
                is_private: !currentStatus
            }
        })
    }

    function CreatePackage(frm) {
        // console.log('create message');
        // console.log('frm', frm)
        createPackage({ variables: frm })

    }

    function EditPackage(frm: any) {
        // console.log('frm', frm)
        // console.log('edit message');
        editPackage({ variables: frm })
    }

    // function ViewMessage() {
    //     console.log('view message');

    // }

    const DeletePackage = (id: any) => {
        console.log('delete package');
        deletePackage({ variables: { id: id } })
    }


    function OnSubmit(frm: any) {
        console.log('frm', frm);
        //bind user id
        if (frm)
            frm.user_permissions_user = auth.userid;

        switch (operation.actionType) {
            case 'create':
                CreatePackage(frm);
                break;
            case 'edit':
                EditPackage(frm);
                break;
            // case 'view':
            //     ViewMessage();
            //     break;
        }
    }

    return (
        <>
            {render &&
                <ModalView
                    fitness_package_type={fitness_package_type}
                    name={actionName}
                    isStepper={true}
                    formUISchema={uiSchema}
                    formSchema={jsonSchema}
                    userData={userData}
                    setUserData={setUserData}
                    pricingDetailRef={pricingDetailRef}
                    formSubmit={(frm: any) => OnSubmit(frm)}
                    setRender={setRender}
                    // fitnesspackagepricing={fitnesspackagepricing}
                    widgets={widgets}
                    formData={operation.id && formData}
                    PTProps={ptSchema[3]}
                    classicProps={classicSchema[3]}
                    actionType={operation.actionType}
                    operation={operation}
                    setOperation={setOperation}

                />
            }
            {operation.actionType === 'delete' && <StatusModal
                modalTile="Delete"
                modalBody="Do you want to delete this package ?"
                buttonLeft="Cancel"
                buttonRight="Yes"
                onClick={() => DeletePackage(operation.id)}
            />}
            {operation.actionType === 'toggle-status' && <StatusModal
                modalTile="Change Status"
                modalBody="Do you want to change status ?"
                buttonLeft="Cancel"
                buttonRight="Yes"
                onClick={() => TogglePackageStatus(operation.id, operation.current_status)}
            />}
        </>
    )
}

export default React.forwardRef(CreateEditView);