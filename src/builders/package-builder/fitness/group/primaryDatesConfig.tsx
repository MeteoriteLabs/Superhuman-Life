import { useState, useEffect } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import moment from 'moment'

const PackageDateConfig = (props: any) => {
    const inputDisabled = props.readonly
    const [startDate, setStartDate] = useState(
        props.value
            ? moment(JSON.parse(props.value).startDate).format('YYYY-MM-DD')
            : moment().add(1, 'days').format('YYYY-MM-DD')
    )
    const [endDate, setEndDate] = useState(
        props.value
            ? moment(JSON.parse(props.value).endDate).format('YYYY-MM-DD')
            : moment(startDate).add(30, 'days').format('YYYY-MM-DD')
    )

    useEffect(() => {
        setEndDate(moment(startDate).add(30, 'days').format('YYYY-MM-DD'))
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
                    min={moment().add(1, 'days').format('YYYY-MM-DD')}
                    value={startDate}
                    onChange={(e) => {
                        setStartDate(e.target.value)
                    }}
                    disabled={inputDisabled}
                />
            </InputGroup>
            {props?.title1 && (
                <span className="small text-muted">
                    Set the date for this offering to be available for everyone
                </span>
            )}
        </div>
    )
}

export default PackageDateConfig
