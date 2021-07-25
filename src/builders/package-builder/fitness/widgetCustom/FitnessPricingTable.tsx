import React, { useState } from 'react'
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Classes from './tableComponent/Classes';
import Voucher from './tableComponent/Voucher';
import ClassesSessions from './tableComponent/ClassesSessions';
import SuggestedPricing from './tableComponent/SuggestedPricing';
import MRP from './tableComponent/MRP';
import * as _ from 'lodash'



export default function FitnessPricingTable(props) {
    const { userData, setUserData, actionType, type, formData, setFormData, name, pricingDetailRef } = props;

    let { ptonline, ptoffline, mode, grouponline, groupoffline, recordedclasses, duration } = userData;
    console.log(type)
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

    const [onlineClassesType, setOnlineClassesType] = useState()
    const [offlineClassesType, setOffineClassesType] = useState();
    const [classicClasses, setClassicClasses] = useState()


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
        };

        if (type === "Personal Training") {
            setOnlineClassesType(ptonline);
            setOffineClassesType(ptoffline)
        } else if (type === "Group Class") {
            setOnlineClassesType(grouponline);
            setOffineClassesType(groupoffline)
        } else if (type === "Classic Class") {
            setClassicClasses(recordedclasses)
        }
    }, [])




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

                {type === "Classic Class" ?
                    <>
                        <tr>
                            {recordedclasses !== undefined && recordedclasses !== 0 ?
                                <>
                                    <td><img src={`/assets/${name}.svg`} alt='123' />Recorded</td>
                                    <Classes type={type} numberClass={classicClasses} />
                                </> : ""
                            }
                        </tr>
                    </> :
                    <>
                        <tr>
                            {onlineClassesType !== undefined && onlineClassesType !== 0 ?
                                <>
                                    <td><img src={`/assets/${name}-Online.svg`} alt='123' />Online</td>
                                    <Classes type numberClass={onlineClassesType} />
                                </> : ""
                            }
                        </tr>
                        <tr>
                            {offlineClassesType !== undefined && offlineClassesType !== 0 ?
                                <>
                                    <td><img src={`/assets/${name}-Offline.svg `} alt='123' />Offline</td>
                                    <Classes type numberClass={offlineClassesType} />
                                </> : ""
                            }
                        </tr>
                    </>
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
                        classicClasses={classicClasses}
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
                        // formData={formData}
                        setStatus={setStatus}
                        // setFormData={setFormData}
                        fitnesspackagepricing={fitnesspackagepricing}
                        setFitnesspackagepricing={setFitnesspackagepricing}
                    // childFitnesspackagepricing={childFitnesspackagepricing}
                    // setChildFitnesspackagepricing={setChildFitnesspackagepricing}
                    />
                </tr>
            </tbody>
        </Table>
    </>

}
