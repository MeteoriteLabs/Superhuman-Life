import React, { Fragment } from 'react'
import Classes from '../Classes'

type Props = {
    recordedclasses: number,
    packageTypeName: string,
    type: string,
    mode: string
}


export default function RecordedPricingTable({ recordedclasses, packageTypeName, type, mode }: Props) {
    return (
        <Fragment>
            <tr>
                {recordedclasses !== undefined && recordedclasses !== 0 ?
                    <>
                        <td>
                            <img src={`/assets/preview-custom-${packageTypeName}.svg`} alt={`${packageTypeName}`} title={`${packageTypeName}`} />
                        </td>
                        <Classes
                            numberClass={recordedclasses}
                            type={type}
                            mode={mode}
                        />
                    </> : ""
                }
            </tr>
        </Fragment>
    )
}
