import React from 'react'


type Props = {
    type: "One-On-One" | 'Group Class' | 'Custom Fitness' | 'Classic Class';
    numberClass:number
    // mode: "Online" | "Offline" | "Hybird" | "Workout" | "Online Workout" | "Offline Workout"
    mode: "Online" | "Offline" | "Hybird" | "Workout" | "Online Workout" | "Offline Workout"
}

export default function OnlineClasses({type, numberClass, mode}:Props) {

    let arrayNumberClass: number[] = [];

    if(type === "Classic Class" || mode === "Online Workout" ||  mode === "Offline Workout" ){
        arrayNumberClass.push(numberClass)
    }else{
        arrayNumberClass[0] = numberClass

        for (let i = 1; i < 4; i++) {
            i === 1 ? numberClass *= 3 : numberClass *= 2;
            arrayNumberClass.push(numberClass);
        }

    }
    return <>
        {arrayNumberClass.map((numClass, index) => {
            return  <td key={index}>{numClass} Class</td>
        })}
    </>

}
