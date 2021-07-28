import React, { Fragment, useState } from 'react'
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Classes from './tableComponent/Classes';
import Voucher from './tableComponent/Voucher';
import ClassesSessions from './tableComponent/ClassesSessions';
import SuggestedPricing from './tableComponent/SuggestedPricing';
import MRP from './tableComponent/MRP';
import * as _ from 'lodash'



export default function FitnessPricingTable(props) {
    const { userData, setUserData, actionType, type, formData, setFormData, packageTypeName, pricingDetailRef } = props;

    let { ptonline, ptoffline, mode, grouponline, groupoffline, recordedclasses, duration } = userData;

    const [status, setStatus] = useState(false);
    const [fitnesspackagepricing, setFitnesspackagepricing] = useState<any>([
        {
            "duration": 30,
            "voucher": "Choose voucher",
            "mrp": 0,
        },
        {
            "duration": 90,
            "voucher": "Choose voucher",
            "mrp": 0,
        },
        {
            "duration": 180,
            "voucher": "Choose voucher",
            "mrp": 0,
        },
        {
            "duration": 360,
            "voucher": "Choose voucher",
            "mrp": 0,
        },
    ])


    // const [updatePricing, setUpdatePricing] = useState()


    const [onlineClassesType, setOnlineClassesType] = useState()
    const [offlineClassesType, setOffineClassesType] = useState();

    useEffect(() => {
        if (pricingDetailRef) {
            pricingDetailRef.current = {
                getFitnessPackagePricing: () => fitnesspackagepricing,
            }
        }
    }, [pricingDetailRef, fitnesspackagepricing])



    useEffect(() => {
        if (formData) {
            setFitnesspackagepricing(formData)
            console.log(fitnesspackagepricing)
        }
    }, [formData])

    console.log(type, formData)

    useEffect(() => {
        if (type === "Personal Training") {
            setOnlineClassesType(ptonline);
            setOffineClassesType(ptoffline)
        } else if (type === "Group Class") {
            setOnlineClassesType(grouponline);
            setOffineClassesType(groupoffline)
        } else if (type === "Custom Fitness") {

        }
    }, [type])



    if (mode === "Online" && ptoffline > 0) {
        ptonline = 0;
        setUserData({ ...userData, ptoffline })
    } else if (mode === "Offline" && ptonline > 0) {
        ptonline = 0
        setUserData({ ...userData, ptonline })
    }

    return <>
        <Table striped bordered hover className='text-center'>
            <thead>
                <tr>
                    <th>Details</th>
                    {type !== "Classic Class" ? <>
                        <th>Monthly</th>
                        <th>Quaterly</th>
                        <th>Half Yearly</th>
                        <th>Yearly</th>
                    </> :
                        <th>{duration} days</th>
                    }
                </tr>
            </thead>
            <tbody>
                {type !== 'Custom Fitness' ?
                    type === "Classic Class" ?
                        <Fragment>
                            <tr>
                                {recordedclasses !== undefined && recordedclasses !== 0 ?
                                    <>
                                        <td>
                                            <img src={`/assets/${packageTypeName}.svg`} alt={`${packageTypeName}`} title={`${packageTypeName}`} />
                                        </td>
                                        <Classes type={type} numberClass={recordedclasses} />
                                    </> : ""
                                }
                            </tr>
                        </Fragment> :
                        <Fragment>
                            <tr>
                                {onlineClassesType !== undefined && onlineClassesType !== 0 ?
                                    <Fragment>
                                        <td>
                                            <img src={`/assets/${packageTypeName}-online.svg`} alt={`${packageTypeName} online`} title={`${packageTypeName} online`} />
                                        </td>
                                        <Classes numberClass={onlineClassesType} />
                                    </Fragment> : ""
                                }
                            </tr>
                            <tr>
                                {offlineClassesType !== undefined && offlineClassesType !== 0 ?
                                    <Fragment>
                                        <td>
                                            <img src={`/assets/${packageTypeName}-offline.svg `} alt={`${packageTypeName} offline`} title={`${packageTypeName} offline`} />
                                        </td>
                                        <Classes numberClass={offlineClassesType} />
                                    </Fragment> : ""
                                }
                            </tr>
                        </Fragment>
                    : <Fragment>
                        <tr>
                            {ptonline !== undefined && ptonline !== 0 ?
                                <Fragment>
                                    <td>
                                        <img src={`/assets/${packageTypeName}personal-training-online.svg`} alt={`${packageTypeName} online`} title={`${packageTypeName} personal training online`} />
                                    </td>
                                    <Classes numberClass={ptonline} />
                                </Fragment> : ""
                            }
                        </tr>
                        <tr>
                            {ptoffline !== undefined && ptoffline !== 0 ?
                                <Fragment>
                                    <td>
                                        <img src={`/assets/${packageTypeName}personal-training-offline.svg`} alt={`${packageTypeName} offline`} title={`${packageTypeName} personal training offline`} />
                                    </td>
                                    <Classes numberClass={ptoffline} />
                                </Fragment> : ""
                            }
                        </tr>
                        <tr>
                            {grouponline !== undefined && grouponline !== 0 ?
                                <Fragment>
                                    <td>
                                        <img src={`/assets/${packageTypeName}group-online.svg`} alt={`${packageTypeName} online`} title={`${packageTypeName} group online`} />
                                    </td>
                                    <Classes numberClass={grouponline} />
                                </Fragment> : ""
                            }
                        </tr>
                        <tr>
                            {groupoffline !== undefined && groupoffline !== 0 ?
                                <Fragment>
                                    <td>
                                        <img src={`/assets/${packageTypeName}group-offline.svg`} alt={`${packageTypeName} offline`} title={`${packageTypeName} group offline`} />
                                    </td>
                                    <Classes numberClass={groupoffline} />
                                </Fragment> : ""
                            }
                        </tr>
                        <tr>
                            {recordedclasses !== undefined && recordedclasses !== 0 ?
                                <Fragment>
                                    <td>
                                        <img src={`/assets/${packageTypeName}classic.svg`} alt={`${packageTypeName}`} title={`${packageTypeName}`} />
                                    </td>
                                    <Classes type={type} numberClass={recordedclasses} />
                                </Fragment> : ""
                            }
                        </tr>
                    </Fragment>
                }


                <tr>
                    <td></td>
                    <Voucher
                        type={type}
                        actionType={actionType}
                        status={status}
                        setStatus={setStatus}
                        formData={formData}
                        setFormData={setFormData}
                        fitnesspackagepricing={fitnesspackagepricing}
                        setFitnesspackagepricing={setFitnesspackagepricing}
                    />
                </tr>
                <tr>
                    <td className='font-weight-bold'>Total Sessions</td>
                    <ClassesSessions
                        type={type}
                        ptonline={ptonline}
                        ptoffline={ptoffline}
                        grouponline={grouponline}
                        groupoffline={groupoffline}
                        recordedclasses={recordedclasses}
                        classicClasses={recordedclasses}
                        classOnline={offlineClassesType}
                        classOffline={offlineClassesType} />
                </tr>
                <tr>
                    <td>Suggested Pricing</td>
                    <SuggestedPricing type={type} />
                </tr>
                <tr>
                    <td>Set MRP</td>
                    <MRP
                        type={type}
                        actionType={actionType}
                        status={status}
                        setStatus={setStatus}
                        fitnesspackagepricing={fitnesspackagepricing}
                        setFitnesspackagepricing={setFitnesspackagepricing}
                    />
                </tr>
            </tbody>
        </Table>
    </>

}
