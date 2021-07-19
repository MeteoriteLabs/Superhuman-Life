import React, { useContext, useEffect, useImperativeHandle, useState } from 'react';
import ModalView from '../../../../components/modal';
import AuthContext from '../../../../context/auth-context';
import { Table } from "react-bootstrap";

import ModalCustomClasses from '../modalCustom/ModalCustomClasses';
import ModalCustomRestday from '../modalCustom/ModalCustomRestday';
import { useMutation, useQuery } from '@apollo/client';
import { Typeahead } from 'react-bootstrap-typeahead'
import { GET_ADDRESS, GET_FITNESS_DISCIPLINES, GET_SINGLE_PACKAGE_BY_ID } from '../graphQL/queries';
import ModalPreview from '../modalCustom/ModalPreview';
import './pt.css'
import * as _ from "lodash";
import { CREATE_PT_PACKAGE, DELETE_PACKAGE, UPDATE_PACKAGE_STATUS } from '../graphQL/mutations';
import StatusModal from '../../../../components/StatusModal/StatusModal';
import FitnessMultiSelect from '../modalCustom/FitnessMultiSelect'

interface Operation {
    id: string;
    actionType: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    type: 'Personal Training' | 'Group Class' | 'Custom Fitness' | 'Classic Class';
    current_status: boolean;
}
function CreateEditFitness(props: any, ref: any) {

    const auth = useContext(AuthContext);

    const [render, setRender] = useState<boolean>(false);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [userData, setUserData] = useState<any>('');
    const [arrPrice, setArrPrice] = useState<any>({
        fitnesspackagepricing: [
            {
                "duration": 30,
                "voucher": "",
                "mrp": "",
            },
            {
                "duration": 90,
                "voucher": "",
                "mrp": "",
            },
            {
                "duration": 180,
                "voucher": "",
                "mrp": "",
            },
            {
                "duration": 360,
                "voucher": "",
                "mrp": "",
            },
        ]
    })
    const [formData, setFormData] = useState<any>('')


    const ptSchema: {} = require("./pt.json");

    const loadData = (data) => {
        // console.log("data address", data)
        //    ptSchema[3].dependencies.mode.oneOf[1].properties.address.enum = data.addresses.map(item => `${item.address1} ${item.address2} ${item.city} ${item.state} ${item.country}`);
        //    ptSchema[3].dependencies.mode.oneOf[2].properties.address.enum = data.addresses.map(item => `${item.address1} ${item.address2} ${item.city} ${item.state} ${item.country}`); 
        // ptSchema[3].dependencies.mode.oneOf[1].properties.address.enum = data.addresses.map(item => item.id);
        // ptSchema[3].dependencies.mode.oneOf[2].properties.address.enum = data.addresses.map(item => item.id);
    }

    useQuery(GET_ADDRESS, {
        onCompleted: loadData
    });



    const RenderLocation = (props: any) => {
        const { data, loading, error } = useQuery(GET_ADDRESS);
        console.log("data address", data)
        if (loading) return <p>...loading</p>
        if (!loading && !error) {
            // ptSchema[3].properties.address.enum = data.address.map(item => item.id)
            return <div>
                <label>{props.label}</label>
                {data.addresses?.map((item: any, index: any) => {
                    return <div key={index}>
                        <label className='ml-3'>
                            <input type="radio" checked={props.value === item.id} id={item.id} name='address' value={item.id} onChange={(event) => props.onChange(event.target.value)} />
                            <span className='ml-3'>{item.address1} {item.address2} {item.city} {item.state} {item.country}</span>
                        </label>
                    </div>
                })}
            </div>
        }
    };

    const customTextTitlePackage = ({ schema }: any) => {
        return <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
            <p className='m-0'>Set for One Month ({schema.duration} days)</p>
        </div>
    };


    const renderClasses = (numberClass: any) => {
        console.log(numberClass)
        let arrayNumberClass: string[] = [];
        if (numberClass !== '') {
            arrayNumberClass[0] = numberClass
        }

        for (let i = 1; i < 4; i++) {
            i === 1 ? numberClass *= 3 : numberClass *= 2;
            arrayNumberClass.push(numberClass);
        }
        return arrayNumberClass.map((item, index) => {
            return <>
                <td key={index}>{item} Class</td>
            </>
        })

    }


    const renderVoucher = () => {
        return [...Array(4)].map((item, index: number) => {
            return <td key={index}><select
                value={arrPrice.fitnesspackagepricing[index].voucher}
                onChange={(e) => {
                    const updateVouhcer = { ...arrPrice }
                    updateVouhcer.fitnesspackagepricing[index].voucher = e.target.value;
                    setArrPrice(updateVouhcer)
                    console.log(arrPrice.fitnesspackagepricing)
                }}
            >
                <option value='0'>Choose voucher</option>
                <option value='10%'>Getfit - 10%</option>
                <option value='20%'>Getfit - 20%</option>
            </select></td>
        })
    }

    const renderClassSessions = (classOnline, classOffline) => {
        if (classOnline === undefined) {
            classOnline = 0
        } else if (classOffline === undefined) {
            classOffline = 0
        }
        let totalClasses = 0;
        console.log("classOnline", classOnline, "classOffline", classOffline)
        let arrNumberClass: number[] = [];
        if ((classOnline && classOffline) || classOnline !== 0 || classOffline !== 0) {
            totalClasses = classOnline + classOffline;
        }
        arrNumberClass[0] = totalClasses;
        for (let i = 1; i < 4; i++) {
            i === 1 ? totalClasses *= 3 : totalClasses *= 2;
            arrNumberClass.push(totalClasses);
        }
        return arrNumberClass.map((item, index) => {
            return <td key={index} className='font-weight-bold'>{item} Class</td>
        })
    }

    const renderSuggestedPricing = () => {
        const arrPrice = [2500, 2500, 2500, 2500];
        return arrPrice.map((item, index) => {
            return <td key={index}>Rs {item}</td>
        })
    }


    const renderMRPInput = (props: any) => {
        return [...new Array(4)].map((item, index) => {
            let updateMRP = { ...arrPrice.fitnesspackagepricing[index].mrp }
            return <td key={index}>
                <input
                    className='w-75'
                    min="0"
                    max="6000"
                    type="number"
                    placeholder='Enter MRP'
                    onChange={(e) => {
                        updateMRP = e.target.value;
                        arrPrice.fitnesspackagepricing[index].mrp = parseInt(updateMRP)
                        setArrPrice(arrPrice)
                    }} /></td>
        })
    }


    const customPricingTable = (props: any) => {
        // console.log("userData", userData)
        let { ptonline, ptoffline, mode } = userData
        if (mode === "Online" && ptoffline > 0) {
            ptonline = 0;
            setUserData({ ...userData, ptoffline })
        } else if (mode === "Offline" && ptonline > 0) {
            ptonline = 0
            setUserData({ ...userData, ptonline })
        }
        return <div className='text-center mt-3'>
            <p className=' font-weight-bold' style={{ fontSize: '1.5rem' }}>Pricing Plan</p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Details</th>
                        <th>Monthly</th>
                        <th>Quaterly</th>
                        <th>Half Yearly</th>
                        <th>Yearly</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {ptonline !== undefined && ptonline !== 0 &&
                            <>
                                <td><img src="/assets/PT-Online.svg" alt='123' />Online</td>
                                {renderClasses(ptonline)}
                            </>
                        }
                    </tr>
                    <tr>
                        {ptoffline !== undefined && ptoffline !== 0 &&
                            <>
                                <td><img src="/assets/PT-Offline.svg" alt='123' />Offline</td>
                                {renderClasses(ptoffline)}
                            </>
                        }
                    </tr>
                    <tr>
                        <td></td>
                        {renderVoucher()}
                    </tr>
                    <tr>
                        <td className='font-weight-bold'>Total Sessions</td>
                        {renderClassSessions(ptonline, ptoffline)}
                    </tr>
                    <tr>
                        <td>Suggested Pricing</td>
                        {renderSuggestedPricing()}
                    </tr>
                    <tr>
                        <td>Set MRP</td>
                        {renderMRPInput(props)}
                    </tr>
                </tbody>
            </Table>
        </div>
    }


    const widgets = {
        ModalCustomClasses,
        FitnessMultiSelect
    }

    const uiSchema: any = {
        "disciplines": {
            'ui:widget': FitnessMultiSelect
        },
        "address": {
            "ui:widget": RenderLocation
            // "ui:widget": "radio",

        },
        "title_package": {
            "ui:widget": customTextTitlePackage
        },

        "ptonline": {
            "ui:widget": (props) => <ModalCustomClasses PTProps={ptSchema[3]} props={props} />

            // "ui:widget": ModalCustomClasses
        },
        "ptoffline": {
            "ui:widget": (props) => <ModalCustomClasses PTProps={ptSchema[3]} props={props} />

        },

        "restdays": {
            "ui:widget": (props: any) => <ModalCustomRestday PTProps={ptSchema[3]} props={props} />

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


        "pricing_plan": {
            "ui:widget": customPricingTable
        },

        "group-schedule": {
            "ui:placeholder": "Number of minutes",
        },
        "custom-schedule": {
            "ui:placeholder": "Number of days",
        },

        "carousel": {
            "ui:widget": () => <ModalPreview userData={userData} arrPrice={arrPrice.fitnesspackagepricing} />
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
        console.log('dataPackage', dataPackage.fitnesspackage);
        const packageDetail = dataPackage.fitnesspackage;
        const { packagename, tags, disciplines, fitness_package_type, aboutpackage, benefits, level, mode, address, ptclasssize, ptoffline, ptonline, restdays, fitnesspackagepricing, Status, introvideourl, is_private } = packageDetail

        let updateFormData: any = {};
        updateFormData.packagename = packagename;
        updateFormData.tags = tags;
        updateFormData.disciplines = disciplines;
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
        updateFormData.duration = fitnesspackagepricing[0].packagepricing.map(item => item.duration);
        updateFormData.mrp = fitnesspackagepricing[0].packagepricing.map(item => item.mrp);
        updateFormData.is_private = is_private;
        updateFormData.introvideourl = introvideourl;

        setFormData(updateFormData)

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.actionType) > -1)
            setRender(true);
        else
            OnSubmit(null);
    }


    console.log('formData', formData)



    const [createPackage] = useMutation(CREATE_PT_PACKAGE, {
        variables: { users_permissions_user: auth.userid },
        onCompleted: (r: any) => {
            console.log(r);
            setRender(false)
        }
    })

    const [deletePackage] = useMutation(DELETE_PACKAGE);

    const [updateStatus] = useMutation(UPDATE_PACKAGE_STATUS)

    const TogglePackageStatus = (id: string, currentStatus: boolean) => {
        updateStatus({
            variables: {
                id,
                Status: !currentStatus
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

    function EditMessage(frm: any) {
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
                EditMessage(frm);
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
        fitness_package_type = props.packageType[0].id
    }

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
                    fitnesspackagepricing={arrPrice.fitnesspackagepricing}
                    formSubmit={(frm: any) => OnSubmit(frm)}
                    setRender={setRender}
                    widgets={widgets}
                    formData={operation.id && formData}
                    classesValidation={ptSchema[3]}
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

export default React.forwardRef(CreateEditFitness);