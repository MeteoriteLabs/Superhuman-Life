import { fireEvent } from '@testing-library/react';
import React, { useCallback, useRef, useState } from 'react'
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

    let { ptonline, ptoffline, mode, grouponline, groupoffline } = userData;

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
    const [offlineClassesType, setOffineClassesType] = useState()


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
        }
    }, [])




    if (mode === "Online" && ptoffline > 0) {
        ptonline = 0;
        setUserData({ ...userData, ptoffline })
    } else if (mode === "Offline" && ptonline > 0) {
        ptonline = 0
        setUserData({ ...userData, ptonline })
    }


    // return null 
    return <>
        <Table striped bordered hover className='text-center'>
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
                    {onlineClassesType !== undefined && onlineClassesType !== 0 ?
                        <>
                            <td><img src={`/assets/${name}-Online.svg`} alt='123' />Online</td>
                            <Classes numberClass={onlineClassesType} />
                        </> : ""
                    }
                </tr>
                <tr>
                    {offlineClassesType !== undefined && offlineClassesType !== 0 ?
                        <>
                            <td><img src={`/assets/${name}-Offline.svg `} alt='123' />Offline</td>
                            <Classes numberClass={offlineClassesType} />
                        </> : ""
                    }
                </tr>
                <tr>
                    <td></td>
                    <Voucher
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
                    <ClassesSessions classOnline={ptonline} classOffline={ptoffline} />
                </tr>
                <tr>
                    <td>Suggested Pricing</td>
                    <SuggestedPricing />
                </tr>
                <tr>
                    <td>Set MRP</td>
                    <MRP
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
