import { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { GET_TIMEZONES } from './queries'
import { useQuery } from '@apollo/client'
import { flattenObj } from '../utils/responseFlatten'

const MultiSelect = (props: any) => {
    const [multiSelections, setMultiSelections] = useState(
        props.value?.length ? JSON.parse(props.value) : []
    )
    const [timezone, setTimeZone] = useState<any[]>([])

    function FetchData() {
        useQuery(GET_TIMEZONES, { onCompleted: loadData })
    }

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data })
        setTimeZone(
            [...flattenedData.timezones].map((zone) => {
                return {
                    id: zone.id,
                    title: `${zone.time} ${zone.name}`
                }
            })
        )
    }

    function OnChange(e) {
        props.onChange(JSON.stringify(e))
        setMultiSelections(e)
    }

    FetchData()

    return (
        <div>
            <label>Timezone</label>
            <Typeahead
                id="basic-typeahead-multiple"
                labelKey="title"
                onChange={OnChange}
                options={timezone}
                placeholder="Select Timezone..."
                selected={multiSelections}
            />
        </div>
    )
}

export default MultiSelect
