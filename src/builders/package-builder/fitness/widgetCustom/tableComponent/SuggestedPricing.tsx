import { useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { GET_SUGGESTIONS_PRICES } from '../../graphQL/queries';


type Props = {
    type: "Online Workout" | "Offline Workout" | "Classic Class"
    mode: string
    auth: { userid: string }
    fitnesspackagepricing: { duration: number, voucher: string, mrp: number | string, }[]
    userData: {
        fitness_package_type: "60e0455e7df648b0f5756c2f" | "60e045697df648b0f5756c30" | "60e045867df648b0f5756c32"
        ptonline: number,
        ptoffline: number,
        grouponline: number,
        groupoffline: number,
        recordedclasses: number,
        duration: number,
    }
}



export default function SuggestedPricing({ type, mode, auth, fitnesspackagepricing, userData }: Props) {

    const { ptonline, ptoffline, grouponline, groupoffline, recordedclasses, duration, fitness_package_type } = userData;


    const [suggestedPricing, setSuggestedPricing] = useState<number[]>([]);

    useQuery(GET_SUGGESTIONS_PRICES, {
        variables: { id: auth.userid },
        onCompleted: (data) => fillData(data)
    });


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


    const calculateArraySuggestPrice = (partnerMRP: number, arrayDuration: number[]) => {
        const arraySuggestedPricings: number[] = [];

        arraySuggestedPricings[0] = partnerMRP
        for (let i = 1; i < arrayDuration.length; i++) {
            if (i === 1) {
                partnerMRP = Number(partnerMRP) * 3
            } else {
                partnerMRP = Number(partnerMRP) * 2
            }
            arraySuggestedPricings.push(partnerMRP)
        }

    
        setSuggestedPricing(arraySuggestedPricings)
        return arraySuggestedPricings
    }


    // PT
    const PTSuggestedPricing = (data: { suggestedPricings: any[]; }) => {
        const arrayPTdata = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Personal Training");
        const arrayPTClasses = [ptonline, ptoffline];
        const partnerSuggestPrice = calculateSuggestPrice(arrayPTdata, arrayPTClasses);

        calculateArraySuggestPrice(partnerSuggestPrice, arrayDuration);
        return calculateArraySuggestPrice
    }


    // Group
    const groupSuggestedPricing = (data: { suggestedPricings: any[]; }) => {
        const arrayGroupData = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Group Class");
        const arrayGroupClasses = [grouponline, groupoffline];
        const partnerSuggestPrice = calculateSuggestPrice(arrayGroupData, arrayGroupClasses);

        calculateArraySuggestPrice(partnerSuggestPrice, arrayDuration)
    }


    //classic
    const classicSuggestPricing = (data: { suggestedPricings: any[]; }) => {
        const arrayClassicData = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Classic Class");
        const arrayClassic = [recordedclasses];
        const partnerSuggestPrice = calculateSuggestPrice(arrayClassicData, arrayClassic);

        calculateArraySuggestPrice(partnerSuggestPrice, [duration])
    }



    //custom
    const customSuggestPrice = (data) => {

        const arrayCustomPrice: number[] = []
        const arrayPTdata = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Personal Training");

        const arrayGroupData = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Group Class");

        const arrayClassicData = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Classic Class");


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


        const num = arrayCustomPrice.reduce((acc, cur) => acc + cur)
        calculateArraySuggestPrice(num, arrayDuration)

    }




    const fillData = (data: { suggestedPricings: any[]; }) => {
        //personal-training
        if (fitness_package_type === "60e0455e7df648b0f5756c2f") {
            PTSuggestedPricing(data)

            // group
        } else if (fitness_package_type === "60e045697df648b0f5756c30") {
            groupSuggestedPricing(data)

            //record/ classic
        } else if (fitness_package_type === "60e045867df648b0f5756c32") {
            classicSuggestPricing(data)

            // custom
        } else if (fitness_package_type === "60e045747df648b0f5756c31")
            customSuggestPrice(data)
    }



    return <>
        {suggestedPricing.map((item: number, index: number) => {
            return <td key={index}>Rs {item.toLocaleString()}</td>
        })}
    </>
}
