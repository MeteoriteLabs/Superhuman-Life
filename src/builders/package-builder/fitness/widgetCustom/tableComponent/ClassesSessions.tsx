import React from 'react'

export default function ClassesSessions(props) {
    let { type, classOnline, classOffline, classicClasses } = props;
 

    if (classOnline === undefined) {
        classOnline = 0
    } else if (classOffline === undefined) {
        classOnline = 0
    }



    let totalClasses = 0;
    let arrNumberClass: number[] = [];
    if (type === "Classic Class") {
        arrNumberClass.push(classicClasses);
    } else {
        if ((classOnline && classOffline) || classOnline !== 0 || classOffline !== 0) {
            totalClasses = classOnline + classOffline;
        }
        arrNumberClass[0] = totalClasses;
        for (let i = 1; i < 4; i++) {
            i === 1 ? totalClasses *= 3 : totalClasses *= 2;
            arrNumberClass.push(totalClasses);
        }

    }
    return <>
        {arrNumberClass.map((item, index) => {
            return <td key={index} className='font-weight-bold'>{item} Class</td>
        })}
    </>
}
