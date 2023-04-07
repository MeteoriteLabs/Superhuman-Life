import React from 'react';

const PricingAssistEditIcon : React.FC<{rowData: any;}> = (props) => {
    const { rowData } = props;
    
    let type = "";
    switch (rowData.mode) {
        case "Online": {
            if (rowData.type === "One-On-One") {
                type = "custompersonal-training-Online.svg";
            } else if (rowData.type === "Group Class") {
                type = "customgroup-Online.svg";
            } else if (rowData.type === "Classic Class") {
                type = "customgroup-Online.svg";
            }
            break;
        }

        case "Offline": {
            if (rowData.type === "One-On-One") {
                type = "custompersonal-training-Offline.svg";
            } else if (rowData.type === "Group Class") {
                type = "customgroup-Offline.svg";
            }
            break;
        }
    }
    return (
        <div className='d-flex  align-items-center'>
            <p>Type:</p>
            <div className='ml-5'>
                <img loading="lazy" src={`./assets/${type}`} alt={rowData.type} />
            </div>
        </div>
    )
}

export default PricingAssistEditIcon;
