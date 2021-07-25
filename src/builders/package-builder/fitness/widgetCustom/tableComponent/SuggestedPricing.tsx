import React from 'react'

export default function SuggestedPricing(props) {
    const {type} = props
    const arrSuggestedPrice = type === "Classic Class" ? [1000] : [2500, 2500, 2500, 2500];
    return <>
        {arrSuggestedPrice.map((item, index) => {
            return <td key={index}>Rs {item}</td>
        })}
    </>
}
