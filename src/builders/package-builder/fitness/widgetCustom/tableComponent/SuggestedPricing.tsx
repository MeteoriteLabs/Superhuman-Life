import { useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { GET_SUGGESTIONS_PRICES } from '../../graphQL/queries';


type Props = {
    type: "Online Workout" | "Offline Workout" | "Classic Class"
    mode: string
    auth: any
    fitnesspackagepricing: any
    userData: any
}


export default function SuggestedPricing({ type, mode, auth, fitnesspackagepricing, userData }: Props) {
    const { ptonline, ptoffline, grouponline, groupoffline, recordedclasses, duration } = userData;



    const [suggestedPricing, setSuggestedPricing] = useState<any>([]);

    useQuery(GET_SUGGESTIONS_PRICES, {
        variables: { id: auth.userid },
        onCompleted: (data) => fillData(data)
    });


    const arrayDuration = fitnesspackagepricing.map(fitness => fitness.duration);

    const calculateSuggestPrice = (arrayData: { Mode: "Online" | "Offline"; mrp: number; }[], arrayClasses) => {
        const mrp: number[] = [];
        arrayData.map((item: { Mode: string; mrp: number; }) => {
            if (item.Mode === "Online") {
                mrp.unshift(item.mrp * arrayClasses[0])
            } else if (item.Mode === "Offline") {
                mrp.push(item.mrp * arrayClasses[1])
            }
        })
        return mrp.reduce((acc, cur) => acc + cur)
    }


    const calculateArraySuggestPrice = (partnerMRP: number, arrayDuration: number[]) => {
        const arraySuggestedPricings: number[] = []
        arraySuggestedPricings[0] = partnerMRP
        for (let i = 1; i < arrayDuration.length; i++) {
            if (i === 1) {
                partnerMRP *= 3
            } else {
                partnerMRP *= 2
            }
            arraySuggestedPricings.push(partnerMRP)
        }
        setSuggestedPricing(arraySuggestedPricings)
        return arraySuggestedPricings
    }



    // let arrSuggestedPrice = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? [1000] : [2500, 2500, 2500, 2500];


    const PTSuggestedPricing = (data: { suggestedPricings: any[]; }) => {
        const arrayPTdata = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Personal Training");
        const arrayPTClasses = [ptonline, ptoffline];
        const partnerSuggestPrice = calculateSuggestPrice(arrayPTdata, arrayPTClasses);
        calculateArraySuggestPrice(partnerSuggestPrice, arrayDuration)
    }



    const groupSuggestedPricing = (data: { suggestedPricings: any[]; }) => {
        const arrayGroupData = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Group Class");
        const arrayGroupClasses = [grouponline, groupoffline];
        const partnerSuggestPrice = calculateSuggestPrice(arrayGroupData, arrayGroupClasses);
        calculateArraySuggestPrice(partnerSuggestPrice, arrayDuration)
    }



    const classicSuggestPricing = (data: { suggestedPricings: any[]; }) => {
        const arrayClassicData = data.suggestedPricings.filter((item: { fitness_package_type: { type: "Personal Training" | "Group Class" | "Classic Class"; }; }) => item.fitness_package_type.type === "Classic Class");

        const arrayClassic = [recordedclasses];

        const partnerSuggestPrice = calculateSuggestPrice(arrayClassicData, arrayClassic);

        calculateArraySuggestPrice(partnerSuggestPrice, [duration])
    }



    const fillData = (data) => {
        //personal-training
        if (userData.fitness_package_type === "60e0455e7df648b0f5756c2f") {
            PTSuggestedPricing(data)

            // group
        } else if (userData.fitness_package_type === "60e045697df648b0f5756c30") {
            groupSuggestedPricing(data)

            //record/ classic
        } else if (userData.fitness_package_type === "60e045867df648b0f5756c32") {
            classicSuggestPricing(data)
        }
    }

    console.log(suggestedPricing)

    return <>
        {suggestedPricing.map((item, index) => {
            return <td key={index}>Rs {item}</td>
        })}
    </>
}
