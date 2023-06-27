import { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { LANGUAGES } from './queries'
import { useQuery } from '@apollo/client'
import { flattenObj } from '../utils/responseFlatten'

const MultiSelect = (props: any) => {
    const [multiSelections, setMultiSelections] = useState(
        props.value?.length > 0 ? JSON.parse(props.value) : []
    )
    const [languages, setlanguages] = useState<any[]>([])

    function FetchData() {
        useQuery(LANGUAGES, { onCompleted: loadData })
    }

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data })
        setlanguages(
            [...flattenedData.languages].map((language) => {
                return {
                    id: language.id,
                    title: language.languages
                }
            })
        )
    }

    function OnChange(e) {
        setMultiSelections(e)
    }

    FetchData()

    props.onChange(JSON.stringify(multiSelections))

    return (
        <div>
            <label>Languages</label>
            <Typeahead
                id="basic-typeahead-multiple"
                labelKey="title"
                onChange={OnChange}
                options={languages}
                placeholder="Select languages..."
                selected={multiSelections}
                multiple
                disabled={props.uiSchema.readonly ? true : false}
            />
        </div>
    )
}

export default MultiSelect
