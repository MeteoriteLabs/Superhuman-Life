import React, { Fragment } from 'react'
import Classes from '../Classes'

type Props = {
    onlineClassesType: number,
    offlineClassesType: number,
    packageTypeName: string,
    mode: string
    type: string
}

export default function PTGroupPricingTable({ onlineClassesType, offlineClassesType, packageTypeName, mode, type }: Props) {
    return (
        <Fragment>
            <tr>
                {onlineClassesType !== undefined && onlineClassesType !== 0 ?
                    <Fragment>
                        <td>
                            <img src={`/assets/${packageTypeName}-online.svg`} alt={`${packageTypeName} online`} title={`${packageTypeName} online`} />
                        </td>
                        <Classes
                            numberClass={onlineClassesType}
                            mode={mode}
                            type={type}
                        />
                    </Fragment> : ""
                }
            </tr>
            <tr>
                {offlineClassesType !== undefined && offlineClassesType !== 0 ?
                    <Fragment>
                        <td>
                            <img src={`/assets/${packageTypeName}-offline.svg `} alt={`${packageTypeName} offline`} title={`${packageTypeName} offline`} />
                        </td>
                        <Classes
                            numberClass={offlineClassesType}
                            mode={mode}
                            type={type}
                        />
                    </Fragment> : ""
                }
            </tr>
        </Fragment>
    )
}
