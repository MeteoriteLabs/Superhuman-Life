import React, { Fragment, useState } from 'react'
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import Voucher from './tableComponent/Voucher';
import ClassesSessions from './tableComponent/ClassesSessions';
import SuggestedPricing from './tableComponent/SuggestedPricing';
import MRP from './tableComponent/MRP';
import * as _ from 'lodash'
import CustomPricingTable from './tableComponent/PricingTable/CustomPricingTable';
import RecordedPricingTable from './tableComponent/PricingTable/RecordedPricingTable';
import PTGroupPricingTable from './tableComponent/PricingTable/PTGroupPricingTable';


type FitnessPricing = {
    duration: number,
    voucher: string,
    mrp: number,
}

// interface UserData{
//     mode: "Online" | "Offline" | "Hybird" | "Workout"
//     type: 'Personal Training' | 'Group Class' | 'Custom Fitness' | 'Classic Class';

// }



export default function FitnessPricingTable({ userData, setUserData, actionType, type, formData, packageTypeName, pricingDetailRef }) {

    let { ptonline, ptoffline, mode, grouponline, groupoffline, recordedclasses, duration } = userData;

    const [status, setStatus] = useState<Boolean>(false);
    const [fitnesspackagepricing, setFitnesspackagepricing] = useState<FitnessPricing[]>([
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




    const [onlineClassesType, setOnlineClassesType] = useState<number>(0)
    const [offlineClassesType, setOffineClassesType] = useState<number>(0);

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

    console.log(type, userData)

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
                    {(type === "Classic Class" || userData.mode === "Workout") ?
                        <th>{duration} days</th>
                        :
                        <>
                            <th>Monthly</th>
                            <th>Quaterly</th>
                            <th>Half Yearly</th>
                            <th>Yearly</th>
                        </>
                    }
                </tr>
            </thead>
            <tbody>
                {type !== 'Custom Fitness' ?
                    type === "Classic Class" ?
                        <RecordedPricingTable
                            recordedclasses={recordedclasses}
                            packageTypeName={packageTypeName}
                            type={type}
                            mode={mode}
                        />
                        :
                        <PTGroupPricingTable
                            type={type}
                            mode={mode}
                            onlineClassesType={onlineClassesType}
                            offlineClassesType={offlineClassesType}
                            packageTypeName={packageTypeName}
                        />

                    :
                    <CustomPricingTable
                        ptonline={ptonline}
                        ptoffline={ptoffline}
                        grouponline={grouponline}
                        groupoffline={groupoffline}
                        recordedclasses={recordedclasses}
                        packageTypeName={packageTypeName}
                        type={type}
                        mode={mode}
                    />
                }

                <tr>
                    <td></td>
                    <Voucher
                        type={type}
                        mode={mode}
                        actionType={actionType}
                        status={status}
                        setStatus={setStatus}
                        formData={formData}
                        // setFormData={setFormData}
                        fitnesspackagepricing={fitnesspackagepricing}
                        setFitnesspackagepricing={setFitnesspackagepricing}
                    />
                </tr>
                <tr>
                    <td className='font-weight-bold'>Total Sessions</td>
                    <ClassesSessions
                        type={type}
                        mode={mode}
                        ptonline={ptonline}
                        ptoffline={ptoffline}
                        grouponline={grouponline}
                        groupoffline={groupoffline}
                        recordedclasses={recordedclasses}
                        classicClasses={recordedclasses}
                    />
                </tr>
                <tr>
                    <td>Suggested Pricing</td>
                    <SuggestedPricing type={type} mode={mode} />
                </tr>
                <tr>
                    <td>Set MRP</td>
                    <MRP
                        type={type}
                        mode={mode}
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
