import React from 'react'


type Props = {
    type: string
}

export default function SuggestedPricing({ type }: Props) {

    const arrSuggestedPrice = type === "Classic Class" ? [1000] : [2500, 2500, 2500, 2500];
    return <>
        {arrSuggestedPrice.map((item, index) => {
            return <td key={index}>Rs {item}</td>
        })}
    </>
}
