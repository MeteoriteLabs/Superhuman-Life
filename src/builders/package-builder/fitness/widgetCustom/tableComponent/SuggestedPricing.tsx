import React from 'react'

export default function SuggestedPricing() {
    const arrSuggestedPrice = [2500, 2500, 2500, 2500];
    return <>
        {arrSuggestedPrice.map((item, index) => {
            return <td key={index}>Rs {item}</td>
        })}
    </>
}
