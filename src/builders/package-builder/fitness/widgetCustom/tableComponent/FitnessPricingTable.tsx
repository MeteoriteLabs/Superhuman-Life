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
import { useQuery } from '@apollo/client';
import { GET_SAPIENT_PRICES } from '../../graphQL/queries';


type FitnessPricing = {
    duration: number,
    voucher: string,
    mrp: number | string,
}

// interface UserData{
//     mode: "Online" | "Offline" | "Hybird" | "Workout"
//     type: 'Personal Training' | 'Group Class' | 'Custom Fitness' | 'Classic Class';

// }



export default function FitnessPricingTable({ userData, setUserData, actionType, type, formData, packageTypeName, pricingDetailRef, widgetProps, auth }) {

    let { ptonline, ptoffline, mode, grouponline, groupoffline, recordedclasses, duration, fitness_package_type } = userData;


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

    const [minPrice, setMinPrice] = useState<number[]>([]);
    const [arrSapientPrice, setArraySapientPrice] = useState<any[]>([]);



    const [onlineClassesType, setOnlineClassesType] = useState<number>(0)
    const [offlineClassesType, setOffineClassesType] = useState<number>(0);
    const [index, setIndex] = useState<number>(0)


    useQuery(GET_SAPIENT_PRICES, {
        onCompleted: (data) => fetchData(data)
    })




    const arrayDuration = fitnesspackagepricing.map(fitness => fitness.duration);

    const calculateSuggestPrice = (arrayData: { Mode: "Online" | "Offline"; mrp: number; }[], arrayClasses: number[]) => {
        const mrp: number[] = [];

        // eslint-disable-next-line array-callback-return
        arrayData.map((item: { Mode: "Online" | "Offline"; mrp: number; }) => {
            if (item.Mode === "Online") {
                mrp.unshift(item.mrp * arrayClasses[0])
            } else if (item.Mode === "Offline") {
                mrp.push(item.mrp * arrayClasses[1])
            }
        })
        return mrp.reduce((acc, cur) => acc + cur)
    }




    const calculateArraySuggestPrice = (sapientPrice: number, arrayDuration: number[]) => {
        const arraySapient: number[] = [];
        arraySapient[0] = Number(sapientPrice);
        for (let i = 1; i < arrayDuration.length; i++) {
            if (i === 1) {
                sapientPrice = Number(sapientPrice) * 3;
            } else {
                sapientPrice = Number(sapientPrice) * 2;
            }
            arraySapient.push(Number(sapientPrice));
        }


        let updatePrice = [...arraySapient];
        if (actionType === "edit") {
            if (userData.fitnesspackagepricing) {
                const arrayVoucher = userData.fitnesspackagepricing[0].packagepricing.map(item => item.voucher);
                for (let i = 0; i < updatePrice.length; i++) {
                    if (arrayVoucher[i] === "0%") {
                        updatePrice[i] = Number(arraySapient[i])
                        

                    } else if (arrayVoucher[i] === "10%") {
                        updatePrice[i] = Number(((arraySapient[i] * 100) / (100 - 10)).toFixed(2))
                      

                    } else if (arrayVoucher[i] === "20%") {
                        updatePrice[i] = Number(((arraySapient[i] * 100) / (100 - 20)).toFixed(2))
                       
                    }
                }
            }

            setMinPrice(updatePrice);
        } else {
            setMinPrice(arraySapient);
        }

        setArraySapientPrice(arraySapient);
       
        return arraySapient
    }


    // PT
    const PTSuggestedPricing = (data: { sapienPricings: any[]; }) => {
        const arrayPTdata = data.sapienPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Personal Training");
        const arrayPTClasses = [ptonline, ptoffline];
        const sapientPrice = calculateSuggestPrice(arrayPTdata, arrayPTClasses);

        calculateArraySuggestPrice(sapientPrice, arrayDuration);


    }


    const groupSuggestedPricing = (data: { sapienPricings: any[]; }) => {
        const arrayGroupData = data.sapienPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Group Class");
        const arrayGroupClasses = [grouponline, groupoffline];
        const sapientPrice = calculateSuggestPrice(arrayGroupData, arrayGroupClasses);

        calculateArraySuggestPrice(sapientPrice, arrayDuration)
    }



    const classicSuggestPricing = (data: { sapienPricings: any[]; }) => {
        const arrayClassicData = data.sapienPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Classic Class");
        const arrayClassic = [recordedclasses];
        const sapientPrice = calculateSuggestPrice(arrayClassicData, arrayClassic);

        calculateArraySuggestPrice(sapientPrice, [duration])
    }


    //custom
    const customSuggestPrice = (data) => {

        const arrayCustomPrice: number[] = []
        const arrayPTdata = data.sapienPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Personal Training");

        const arrayGroupData = data.sapienPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Group Class");

        const arrayClassicData = data.sapienPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Classic Class");


        for (let i = 0; i < arrayPTdata.length; i++) {
            if (arrayPTdata[i].Mode === "Online") {
                arrayCustomPrice.push(arrayPTdata[i].mrp * ptonline)
            } else {
                arrayCustomPrice.push(arrayPTdata[i].mrp * ptoffline)
            }
        }

        for (let i = 0; i < arrayGroupData.length; i++) {
            if (arrayGroupData[i].Mode === "Online") {
                arrayCustomPrice.push(arrayGroupData[i].mrp * grouponline)
            } else {
                arrayCustomPrice.push(arrayGroupData[i].mrp * groupoffline)
            }
        }

        for (let i = 0; i < arrayClassicData.length; i++) {
            arrayCustomPrice.push(arrayClassicData[i].mrp * recordedclasses)
        }


        const totalCustomPrice = arrayCustomPrice.reduce((acc, cur) => acc + cur)
        calculateArraySuggestPrice(totalCustomPrice, arrayDuration)

    }


    const fetchData = (data) => {
        console.log(fitness_package_type);
        if (fitness_package_type === "Personal Training") {
            PTSuggestedPricing(data)
        }
        //  group
        else if (fitness_package_type === "Group Class") {
            groupSuggestedPricing(data)
        }
        //record/ classic
        else if (fitness_package_type === "Classic Class") {
            classicSuggestPricing(data)
        }
        // custom
        else if (fitness_package_type === "Custom Fitness") {
            customSuggestPrice(data)
        }
    }



    useEffect(() => {
        if (pricingDetailRef) {
            pricingDetailRef.current = {
                getFitnessPackagePricing: () => fitnesspackagepricing,
            }
        }
    }, [pricingDetailRef, fitnesspackagepricing])



    useEffect(() => {
        let updatePricing: any = ''

        if (actionType === 'create') {
            if (userData.fitnesspackagepricing) {
                updatePricing = _.cloneDeep(userData.fitnesspackagepricing);
            } else {
                updatePricing = [...fitnesspackagepricing];
            }
            
            updatePricing[0].duration = duration;

        } else if (actionType === 'view') {
            if (formData.fitnesspackagepricing) {
                updatePricing = formData.fitnesspackagepricing[0].packagepricing
            }
        } else {
            if (userData.fitnesspackagepricing) {
                updatePricing = userData.fitnesspackagepricing[0].packagepricing
            }
        }
        setFitnesspackagepricing(updatePricing)
    }, [userData, actionType, duration, formData]) // eslint-disable-line react-hooks/exhaustive-deps

    


    useEffect(() => {
        if (type === "Personal Training") {
            setOnlineClassesType(ptonline);
            setOffineClassesType(ptoffline)
        } else if (type === "Group Class") {
            setOnlineClassesType(grouponline);
            setOffineClassesType(groupoffline)
        } else if (type === "Custom Fitness") {

        }
    }, [ptonline, ptoffline, groupoffline, grouponline, type])



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
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        fitnesspackagepricing={fitnesspackagepricing}
                        setFitnesspackagepricing={setFitnesspackagepricing}
                        arrSapientPrice={arrSapientPrice}
                        setIndex={setIndex}
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
                    <SuggestedPricing
                        type={type}
                        mode={mode}
                        auth={auth}
                        fitnesspackagepricing={fitnesspackagepricing}
                        userData={userData}
                    />
                </tr>
                <tr>
                    <td>Set MRP</td>
                    <MRP
                        index={index}
                        type={type}
                        mode={mode}
                        actionType={actionType}
                        fitnesspackagepricing={fitnesspackagepricing}
                        setFitnesspackagepricing={setFitnesspackagepricing}
                        widgetProps={widgetProps}
                        minPrice={minPrice}
                        setMinPrice={setMinPrice}
                        userData={userData}
                    />
                </tr>
            </tbody>
        </Table>

    </>

}
