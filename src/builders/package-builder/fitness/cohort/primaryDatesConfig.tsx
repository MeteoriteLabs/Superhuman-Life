import React, { useState, useEffect, ChangeEvent } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import moment from 'moment'

const PackageDateConfig: React.FC<{
    readonly?: boolean
    title1: string
    title2: string
    value: string
    onChange: (params: string | null) => void
    type?: string
}> = (props) => {
    const inputDisabled = props.readonly
    const [startDate, setStartDate] = useState<string>(
        props.value
            ? moment(JSON.parse(props.value).startDate).format('YYYY-MM-DD')
            : moment().add(1, 'days').format('YYYY-MM-DD')
    )
    const [endDate, setEndDate] = useState<string>(
        props.value
            ? moment(JSON.parse(props.value).endDate).format('YYYY-MM-DD')
            : moment(startDate).add(1, 'days').format('YYYY-MM-DD')
    )

    useEffect(() => {
        if (moment(startDate).isAfter(endDate)) {
            setEndDate(startDate)
        }
    }, [startDate])

    props.onChange(JSON.stringify({ startDate, endDate }))

    return (
        <div>
            <label>{props?.title1 ? props.title1 : 'Publishing Date'}</label>
            <InputGroup className="mb-3">
                <FormControl
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    type="date"
                    min={startDate}
                    value={startDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setStartDate(e.target.value)
                        setEndDate(moment(e.target.value).add(1, 'days').format('YYYY-MM-DD'))
                    }}
                    disabled={inputDisabled}
                />
            </InputGroup>
            {props?.title1 && (
                <span className="small text-muted">
                    Set the date for this offering to be available for everyone
                </span>
            )}

            <br />
            <label>{props?.title2 ? props.title2 : 'Expiry Date'}</label>
            <InputGroup className="mb-3">
                <FormControl
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    type="date"
                    min={moment(startDate).add(1, 'days').format('YYYY-MM-DD')}
                    value={endDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEndDate(e.target.value)
                    }}
                    disabled={inputDisabled}
                />
            </InputGroup>
            {props?.title2 && (
                <span className="small text-muted">
                    On the selected date this offering will be shifted to drafts
                </span>
            )}
        </div>
    )
}

export default PackageDateConfig
