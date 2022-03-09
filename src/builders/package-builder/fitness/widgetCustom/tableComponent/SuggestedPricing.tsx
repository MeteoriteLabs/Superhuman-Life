import { useQuery } from '@apollo/client';
import React, { useState } from 'react'
import { GET_SUGGESTIONS_PRICES } from '../../graphQL/queries';


type Props = {
    type: "Online Workout" | "Offline Workout" | "Classic Class"
    mode: string
    auth: { userid: string }
    fitnesspackagepricing: { duration: number, voucher: string, mrp: number | string, }[]
    userData: {
        fitness_package_type: any
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
        arrayData?.map((item: { Mode: "Online" | "Offline"; mrp: number; }) => {
            if (item.Mode === "Online") {
                mrp.unshift(item.mrp * arrayClasses[0])
            } else if (item.Mode === "Offline") {
                mrp.push(item.mrp * arrayClasses[1])
            }
        })
        if(mrp.length > 0){
            return mrp.reduce((acc, cur) => acc + cur);
        }else {
            return 0;
        }
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
    const PTSuggestedPricing = (data:any) => {
        let ptDuration: number[] = [];
  
        const arrayPTdata = data.suggestedPricings.data.filter((item => item.attributes.fitness_package_type.data.attributes.type === "Personal Training"));
        const arrayPTClasses = [ptonline, ptoffline];

        const partnerSuggestPrice = calculateSuggestPrice(arrayPTdata, arrayPTClasses);
        if(mode === "Online Workout" || mode === "Offline Workout"){
            ptDuration.push(arrayDuration[0])
        }else{
            ptDuration= arrayDuration
        }
        calculateArraySuggestPrice(partnerSuggestPrice, ptDuration);
        return calculateArraySuggestPrice
    }


    // Group
    const groupSuggestedPricing = (data) => {
        const arrayGroupData = data.suggestedPricings.data.filter((item => item.attributes.fitness_package_type.data.attributes.type ==="Group Class"));
        const arrayGroupClasses = [grouponline, groupoffline];
        const partnerSuggestPrice = calculateSuggestPrice(arrayGroupData, arrayGroupClasses);

        calculateArraySuggestPrice(partnerSuggestPrice, arrayDuration)
    }


    //classic
    const classicSuggestPricing = (data) => {
        const arrayClassicData = data.suggestedPricings.data.filter((item => item.attributes.fitness_package_type.data.attributes.type === "Classic Class"));
        const arrayClassic = [recordedclasses];
        const partnerSuggestPrice = calculateSuggestPrice(arrayClassicData, arrayClassic);

        calculateArraySuggestPrice(partnerSuggestPrice, [duration])
    }



    //custom
    const customSuggestPrice = (data) => {

        const arrayCustomPrice: number[] = []
        let num = 0;
        if(data.length > 0){
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
            num = arrayCustomPrice.reduce((acc, cur) => acc + cur)
        }
        calculateArraySuggestPrice(num, arrayDuration)
    }





    const fillData = (data: { suggestedPricings: any[]; }) => {
        //personal-training
        // const flattenedData = flattenObj({...data});
        // console.log("🚀 ~ file: SuggestedPricing.tsx ~ line 165 ~ fillData ~ flattenedData", flattenedData)
        console.log(fitness_package_type);
        if (fitness_package_type === "Personal Training") {
            PTSuggestedPricing(data)

            // group
        } else if (fitness_package_type === "Group Class") {
            groupSuggestedPricing(data)

            //record/ classic
        } else if (fitness_package_type === "Classic Class") {
            classicSuggestPricing(data)

            // custom
        } else if (fitness_package_type === "Custom Fitness")
            customSuggestPrice(data)
    }



    return <>
        {suggestedPricing.map((item: number, index: number) => {
            return <td key={index}> &#8377; {item.toLocaleString()}</td>
        })}
    </>
}
