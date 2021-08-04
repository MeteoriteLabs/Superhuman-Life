import React, { Fragment, useState } from 'react'
import { useEffect } from 'react';
import { Table } from 'react-bootstrap';
import "./fitnessPricing.css"
import Voucher from './Voucher';
import ClassesSessions from './ClassesSessions';
import SuggestedPricing from './SuggestedPricing';
import MRP from './MRP';
import * as _ from 'lodash'
import CustomPricingTable from './PricingTable/CustomPricingTable';
import RecordedPricingTable from './PricingTable/RecordedPricingTable';
import PTGroupPricingTable from './PricingTable/PTGroupPricingTable';


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
    console.log(packageTypeName)
    const [status, setStatus] = useState<Boolean>(false);
    const [fitnesspackagepricing, setFitnesspackagepricing] = useState<FitnessPricing[]>([
        {
            "duration": 30,
            "voucher": "",
            "mrp": 0,
        },
        {
            "duration": 90,
            "voucher": "",
            "mrp": 0,
        },
        {
            "duration": 180,
            "voucher": "",
            "mrp": 0,
        },
        {
            "duration": 360,
            "voucher": "",
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

    console.log("form data pricing", userData)

    useEffect(() => {
        let updatePricing: any = ''
        if (formData) {
            updatePricing = _.cloneDeep(formData);
        } else {
            updatePricing = [...fitnesspackagepricing];
        }
        updatePricing[0].duration = duration;
        setFitnesspackagepricing(updatePricing)
        // console.log(updatePricing)
    }, [formData])


    useEffect(() => {
        let updatePricing: any = ''
        if (userData.fitnesspackagepricing) {
            setFitnesspackagepricing(userData.fitnesspackagepricing)
        }
    }, [userData])
    // console.log('packageTypeName', packageTypeName, fitnesspackagepricing)


    // console.log(type, userData)

    useEffect(() => {
        if (type === "Personal Training") {
            setOnlineClassesType(ptonline);
            setOffineClassesType(ptoffline)
        } else if (type === "Group Class") {
            setOnlineClassesType(grouponline);
            setOffineClassesType(groupoffline)
        } else if (type === "Custom Fitness") {

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
        <Table className='text-center'>
            <thead>
                <tr>
                    <th>Details</th>
                    {(type === "Classic Class" || userData.mode === "Online Workout" || userData.mode === "Offline Workout") ?
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
                        formData={formData}
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
                        formData={formData}
                        fitnesspackagepricing={fitnesspackagepricing}
                        setFitnesspackagepricing={setFitnesspackagepricing}
                    />
                </tr>
            </tbody>
        </Table>
    </>

}
