import { useState } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import moment from 'moment'

const PackageDateConfig = (props: any) => {
    const inputDisabled = props.readonly
    const cohortStartDate = JSON.parse(props.formContext.dates).startDate
    const [publishingDate, setPublishingDate] = useState(
        props.value
            ? moment(JSON.parse(props.value).publishingDate).format('YYYY-MM-DDTHH:mm')
            : `${moment().add(1, 'days').format('YYYY-MM-DDTHH:mm')}`
    )
    const [expiryDate, setExpiryDate] = useState(
        props.value
            ? moment(JSON.parse(props.value).expiryDate).format('YYYY-MM-DDTHH:mm')
            : `${moment().add({ days: 1, year: 1 }).format('YYYY-MM-DDTHH:mm')}`
    )

    if (publishingDate && expiryDate) {
        props.onChange(JSON.stringify({ publishingDate, expiryDate }))
    }

    return (
        <div>
            <label>{props?.title1 ? props.title1 : 'Publishing Date'}</label>
            <InputGroup className="mb-3">
                <FormControl
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    type="datetime-local"
                    min={moment().format('YYYY-MM-DDTHH:mm')}
                    max={moment(cohortStartDate).format('YYYY-MM-DDTHH:mm')}
                    value={publishingDate}
                    onChange={(e) => {
                        setPublishingDate(e.target.value)
                    }}
                    disabled={inputDisabled}
                />
            </InputGroup>
            {props?.title1 && (
                <span className="small">
                    SOffering will be visible on the website and app only from the above date
                </span>
            )}
            <label>{props?.title2 ? props.title2 : 'Expiry Date'}</label>
            <InputGroup className="mb-3">
                <FormControl
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default"
                    type="datetime-local"
                    value={expiryDate}
                    disabled={inputDisabled}
                    onChange={(e) => {
                        setExpiryDate(e.target.value)
                    }}
                    max={moment(cohortStartDate).subtract(1, 'days').format('YYYY-MM-DDTHH:mm')}
                />
            </InputGroup>
            {props?.title2 && (
                <span className="small">
                    Offering will go into drafts and will be remove from listing on webiste and app
                </span>
            )}
        </div>
    )
}

export default PackageDateConfig
