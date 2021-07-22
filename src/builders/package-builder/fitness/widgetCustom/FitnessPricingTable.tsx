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

interface FintessPackagePricing {
 
}

export default function FitnessPricingTable(props) {
    const { userData, setUserData, actionType, widgetProps, formData, setFormData, mrpInput, setMrpInput, pricingDetailRef } = props;

    const [status, setStatus] = useState(false);
    const [fitnesspackagepricing, setFitnesspackagepricing] = useState <{duration:number, voucher:string, mrp:number} []> ([
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


    useEffect(() => {
        if (pricingDetailRef) {
            pricingDetailRef.current = {
                getFitnessPackagePricing: () => fitnesspackagepricing,
            }
        }


    }, [pricingDetailRef, fitnesspackagepricing])




    console.log('fitnesspackagepricing', fitnesspackagepricing)
    // console.log("childFitnesspackagepricing", childFitnesspackagepricing);

    useEffect(() => {
        if (formData) {
            setFitnesspackagepricing(formData.fitnesspackagepricing)
        }
    }, [])



    let { ptonline, ptoffline, mode } = userData
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
                            <Classes numberClass={ptonline} />
                        </>
                    }
                </tr>
                <tr>
                    {ptoffline !== undefined && ptoffline !== 0 &&
                        <>
                            <td><img src="/assets/PT-Offline.svg" alt='123' />Offline</td>
                            <Classes numberClass={ptoffline} />

                        </>
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
                    // childFitnesspackagepricing={childFitnesspackagepricing}
                    // setChildFitnesspackagepricing={setChildFitnesspackagepricing} 
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
