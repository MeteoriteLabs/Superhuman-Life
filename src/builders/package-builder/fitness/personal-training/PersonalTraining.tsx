import React, { useContext, useImperativeHandle, useRef, useState } from 'react';
import ModalView from '../../../../components/modal';
import AuthContext from '../../../../context/auth-context';

import ModalCustomClasses from '../widgetCustom/FitnessClasses';
import ModalCustomRestday from '../widgetCustom/FitnessRestday';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SINGLE_PACKAGE_BY_ID } from '../graphQL/queries';
import ModalPreview from '../widgetCustom/FitnessPreview';
import './pt.css'
import { CREATE_PT_PACKAGE, DELETE_PACKAGE, UPDATE_PACKAGE_PRIVATE } from '../graphQL/mutations';
import StatusModal from '../../../../components/StatusModal/StatusModal';
import FitnessMultiSelect from '../widgetCustom/FitnessMultiSelect'
import FitnessAddress from '../widgetCustom/FitnessAddress';
import FitnessPricingTable from '../widgetCustom/FitnessPricingTable'

interface Operation {
    id: string;
    actionType: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    type: 'Personal Training' | 'Group Class' | 'Custom Fitness' | 'Classic Class';
    current_status: boolean;
}
function PersonalTraining(props: any, ref: any) {
    const auth = useContext(AuthContext);

    const [render, setRender] = useState<boolean>(false);
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

 
    const [formData, setFormData] = useState<{ packagename: string, tags: string, disciplines: { typename: string, id: string, disciplines: string }[], type: string, aboutpackage: string, benefits: string, level: string, mode: string, address: { id: string, __typename: string }, ptclasssize: string, ptonline: number | null, ptoffline: number | null, restdays: number, bookingleadday: number, fitnesspackagepricing: any, is_private: boolean, introvideourl: string }>()

    const ptSchema: {} = require("./pt.json");


    const customTextTitlePackage = ({ schema }: any) => {
        return <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
            <p className='m-0'>Set for One Month ({schema.duration} days)</p>
        </div>
    };


    const widgets = {
        ModalCustomClasses,
        FitnessMultiSelect
    }



    const pricingDetailRef = useRef<{ getFitnessPackagePricing?: Function }>({});

    const uiSchema: any = {
        "disciplines": {
            'ui:widget': (props) => <FitnessMultiSelect widgetProps={props} actionType={operation.actionType} />
        },
        "address": {
            // "ui:widget": RenderLocation
            // "ui:widget": "radio",
            "ui:widget": (props) => <FitnessAddress actionType={operation.actionType} widgetProps={props} />

        },
        "title_package": {
            "ui:widget": customTextTitlePackage
        },

        "ptonline": {
            "ui:widget": (props) => <ModalCustomClasses actionType={operation.actionType} PTProps={ptSchema[3]} widgetProps={props} />

            // "ui:widget": ModalCustomClasses
        },
        "ptoffline": {
            "ui:widget": (props) => <ModalCustomClasses actionType={operation.actionType} PTProps={ptSchema[3]} widgetProps={props} />

        },

        "restdays": {
            "ui:widget": (props: any) => <ModalCustomRestday actionType={operation.actionType} PTProps={ptSchema[3]} widgetProps={props} />

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


        "pricingDetail": {
            "ui:widget": (props) => <FitnessPricingTable
                userData={userData}
                setUserData={setUserData}
                actionType={operation.actionType}
                pricingDetailRef={pricingDetailRef}
                widgetProps={props}
                formData={formData}
            />,
        },

        "group-schedule": {
            "ui:placeholder": "Number of minutes",
        },
        "custom-schedule": {
            "ui:placeholder": "Number of days",
        },

        "carousel": {
            "ui:widget": () => <ModalPreview userData={userData} fitnesspackagepricing={pricingDetailRef.current.getFitnessPackagePricing?.()} />
        },
    }


    if (operation.actionType === "edit" || operation.actionType === "view") {
    }


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
        console.log(packageDetail)
        const { packagename, tags, disciplines, fitness_package_type, aboutpackage, benefits, level, mode, address, ptclasssize, ptoffline, ptonline, restdays, fitnesspackagepricing, bookingleadday, introvideourl, is_private } = packageDetail

        let updateFormData: any = {};
        updateFormData.packagename = packagename;
        updateFormData.tags = tags;
        updateFormData.disciplines = JSON.stringify(disciplines);
        updateFormData.type = fitness_package_type;
        updateFormData.aboutpackage = aboutpackage
        updateFormData.benefits = benefits;
        updateFormData.level = level;
        updateFormData.mode = mode;
        updateFormData.address = address.id;
        updateFormData.ptclasssize = ptclasssize;
        updateFormData.ptonline = fitness_package_type.type === "Personal Training" && ptonline;
        updateFormData.ptoffline = fitness_package_type.type === "Personal Training" && ptoffline;
        updateFormData.restdays = restdays;
        updateFormData.bookingleadday = bookingleadday;
        updateFormData.fitnesspackagepricing = fitnesspackagepricing[0].packagepricing
        updateFormData.is_private = is_private;
        updateFormData.introvideourl = introvideourl;

        setFormData(updateFormData);
        // setFitnesspackagepricing(updateFormData.fitnesspackagepricing)

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.actionType) > -1)
            setRender(true);
        else
            OnSubmit(null);
    }



    const [createPackage] = useMutation(CREATE_PT_PACKAGE, {
        variables: { users_permissions_user: auth.userid },
        onCompleted: (r: any) => {
            console.log(r);
            setRender(false)
        }
    })

    const [deletePackage] = useMutation(DELETE_PACKAGE);

    const [updateStatus] = useMutation(UPDATE_PACKAGE_PRIVATE)

    const TogglePackageStatus = (id: string, currentStatus: boolean) => {
        updateStatus({
            variables: {
                id,
                is_private: !currentStatus
            }
        })
    }


    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            console.log(msg)
            setOperation(msg);
            if (msg && !msg.id) //render form if no message id
                setRender(true);
            // if (msg.type === "toggle-status" && "current_status" in msg)
            //     ToggleMessageStatus(msg.id, msg.current_status);

        }


    }));


    function CreatePackage(frm) {
        console.log('create message');
        console.log('frm', frm)
        createPackage({ variables: frm })

    }

    function EditPackage(frm: any) {
        
        console.log('edit message');



    }

    function ViewMessage(frm: any) {
        console.log('view message');

    }

    const DeletePackage = (id: any) => {
        console.log('delete package');
        deletePackage({ variables: { id: id } })
    }


    function OnSubmit(frm: any) {
        console.log(frm);
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
            case 'view':
                ViewMessage(frm);
                break;
        }
    }

    let name = "";
    if (operation.actionType === 'create') {
        name = "Create New";
    } else if (operation.actionType === 'edit') {
        name = "Edit";
    } else if (operation.actionType === 'view') {
        name = "View";
    }


    let fitness_package_type = '';
    if (operation.type === "Personal Training") {
        fitness_package_type = props.packageType.fitnessPackageTypes[0].id
    }

    console.log('Rerender createoredit-fitness')

    return (
        <>
            {render &&
                <ModalView
                    fitness_package_type={fitness_package_type}
                    name={name}
                    isStepper={true}
                    formUISchema={uiSchema}
                    formSchema={ptSchema}
                    // formSubmit={name ==="View"? () => {setRender(false)}:(frm: any) => { OnSubmit(frm); }}
                    userData={userData}
                    setUserData={setUserData}
                    pricingDetailRef={pricingDetailRef}
                    formSubmit={(frm: any) => OnSubmit(frm)}
                    setRender={setRender}
                    fitnesspackagepricing={fitnesspackagepricing}
                    widgets={widgets}
                    formData={operation.id && {
                        ...formData
                    }}
                    classesValidation={ptSchema[3]}
                    actionType={operation.actionType}
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

export default React.forwardRef(PersonalTraining);