import { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { GET_MUSCLEGROUPS } from './queries'
import { useQuery } from '@apollo/client'
import { flattenObj } from '../utils/responseFlatten'

const MuscleGroupMultiSelect = (props: any) => {
    function handleReturnType(value) {
        if (typeof value === 'string') {
            return JSON.parse(value)
        } else {
            return value
        }
    }

    const [multiSelections, setMultiSelections] = useState<any[]>(
        props.value?.length > 0 ? handleReturnType(props.value) : []
    )
    const [muscleList, setMuscleList] = useState<any[]>([])

    function FetchData() {
        useQuery(GET_MUSCLEGROUPS, { onCompleted: loadData })
    }

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data })
        setMuscleList(
            [...flattenedData.muscleGroups].map((muscles) => {
                return {
                    id: muscles.id,
                    name: muscles.name
                }
            })
        )
    }

    function OnChange(e) {
        const unique = [...new Map(e.map((m) => [m.id, m])).values()]
        setMultiSelections(unique)
    }

    // props.onChange(multiSelections.map((d) => {
    //     return d.id;
    //     }).join(",").toString()
    // );

    props.onChange(JSON.stringify(multiSelections))

    FetchData()

    return (
        <div>
            <label>Muscle Group</label>
            <Typeahead
                id="basic-typeahead-multiple"
                labelKey="name"
                onChange={OnChange}
                options={muscleList}
                placeholder="Choose Discpline..."
                selected={multiSelections}
                multiple
                disabled={props.uiSchema.readonly}
            />
        </div>
    )
}

export default MuscleGroupMultiSelect
