import React from 'react'


type Props = {
    type:string
    numberClass:number
    mode:string
}

export default function OnlineClasses({type, numberClass, mode}: Props) {

    let arrayNumberClass: number[] = [];

    if(type === "Classic Class" || mode === "Workout"){
        arrayNumberClass.push(numberClass)
    }else{
        // if (numberClass !== '') {
        // }
        arrayNumberClass[0] = numberClass

        for (let i = 1; i < 4; i++) {
            i === 1 ? numberClass *= 3 : numberClass *= 2;
            arrayNumberClass.push(numberClass);
        }

    }
    return <>
        {arrayNumberClass.map((item, index) => {
            return  <td key={index}>{item} Class</td>
        })}
    </>

}
