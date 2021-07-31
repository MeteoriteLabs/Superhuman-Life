import React, { Fragment } from 'react'
import Classes from '../Classes';

type Props ={
    ptonline:number,
    ptoffline:number,
    grouponline:number,
    groupoffline:number,
    recordedclasses:number,
    packageTypeName:string,
    type:string
    mode:string
}
export default function CustomPricingTable({ptonline, ptoffline, grouponline, groupoffline,recordedclasses, packageTypeName, type, mode  }:Props) {
   
    return (
        <Fragment>
        <tr>
            {ptonline !== undefined && ptonline !== 0 ?
                <Fragment>
                    <td>
                        <img src={`/assets/preview-${packageTypeName}-personal-training-online.svg`} alt={`${packageTypeName} online`} title={`${packageTypeName} personal training online`} />
                    </td>
                    <Classes 
                    numberClass={ptonline} 
                    type={type}
                    mode={mode}
                    />
                </Fragment> : ""
            }
        </tr>
        <tr>
            {ptoffline !== undefined && ptoffline !== 0 ?
                <Fragment>
                    <td>
                        <img src={`/assets/preview-${packageTypeName}-personal-training-offline.svg`} alt={`${packageTypeName} offline`} title={`${packageTypeName} personal training offline`} />
                    </td>
                    <Classes 
                    numberClass={ptoffline} 
                    type={type}
                    mode={mode}
                    />
                </Fragment> : ""
            }
        </tr>
        <tr>
            {grouponline !== undefined && grouponline !== 0 ?
                <Fragment>
                    <td>
                        <img src={`/assets/preview-${packageTypeName}-group-online.svg`} alt={`${packageTypeName} online`} title={`${packageTypeName} group online`} />
                    </td>
                    <Classes 
                    numberClass={grouponline} 
                    type={type}
                    mode={mode}
                    />
                </Fragment> : ""
            }
        </tr>
        <tr>
            {groupoffline !== undefined && groupoffline !== 0 ?
                <Fragment>
                    <td>
                        <img src={`/assets/preview-${packageTypeName}-group-offline.svg`} alt={`${packageTypeName} offline`} title={`${packageTypeName} group offline`} />
                    </td>
                    <Classes 
                    numberClass={groupoffline} 
                    type={type}
                    mode={mode}
                    />
                </Fragment> : ""
            }
        </tr>
        <tr>
            {recordedclasses !== undefined && recordedclasses !== 0 ?
                <Fragment>
                    <td>
                        <img src={`/assets/preview-${packageTypeName}-classic.svg`} alt={`${packageTypeName}`} title={`${packageTypeName}`} />
                    </td>
                    <Classes
                      numberClass={recordedclasses} 
                      type={type}
                      mode={mode}
                    />
                </Fragment> : ""
            }
        </tr>
    </Fragment>
    )
}
