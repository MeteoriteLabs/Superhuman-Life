import React from 'react'


type Props = {
    type: string,
    mode:string
}

export default function SuggestedPricing({ type, mode }: Props) {

    const arrSuggestedPrice = (type === "Classic Class" || mode ==="Workout") ? [1000] : [2500, 2500, 2500, 2500];
    return <>
        {arrSuggestedPrice.map((item, index) => {
            return <td key={index}>Rs {item}</td>
        })}
    </>
}
