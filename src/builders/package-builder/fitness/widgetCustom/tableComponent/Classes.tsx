import React from 'react'

export default function OnlineClasses(props) {
    let { numberClass } = props
    let arrayNumberClass: string[] = [];
    if (numberClass !== '') {
        arrayNumberClass[0] = numberClass
    }

    for (let i = 1; i < 4; i++) {
        i === 1 ? numberClass *= 3 : numberClass *= 2;
        arrayNumberClass.push(numberClass);
    }
    return <>
        {arrayNumberClass.map((item, index) => {
            return  <td key={index}>{item} Class</td>
          
        })}
    </>

}
