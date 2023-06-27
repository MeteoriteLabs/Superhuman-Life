import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { FETCH_FITNESSDISCPLINES } from '../../builders/program-builder/workout/queries'
import { useQuery } from '@apollo/client'
import { flattenObj } from '../utils/responseFlatten'

const MultiSelect: React.FC<{
    value: string
    onChange: (args: string | null) => void
    uiSchema: any
}> = (props) => {
    function handleReturnType(value) {
        if (typeof value === 'string') {
            return JSON.parse(value)
        } else {
            return value
        }
    }

    const [multiSelections, setMultiSelections] = useState(
        props.value?.length > 0 ? handleReturnType(props.value) : []
    )
    const [fitnessdisciplines, setFitnessDisciplines] = useState<any[]>([])

    // useEffect(() => {
    //      const unique = [...new Map(multiSelections.map((m) => [m.id, m])).values()];
    //      setMultiSelections(unique);
    // }, [multiSelections]);

    function FetchData() {
        useQuery(FETCH_FITNESSDISCPLINES, { onCompleted: loadData })
    }

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data })
        setFitnessDisciplines(
            [...flattenedData.fitnessdisciplines].map((discipline) => {
                return {
                    id: discipline.id,
                    disciplinename: discipline.disciplinename
                }
            })
        )
    }

    function OnChange(e) {
        // let id = e.map(d => {return d.id}).join(',');
        // props.onChange(id);]
        const unique = [...new Map(e.map((m) => [m.id, m])).values()]
        setMultiSelections(unique)
    }

    if (multiSelections.length > 0) {
        props.onChange(JSON.stringify(multiSelections))
    } else {
        props.onChange(null)
    }

    FetchData()

    return (
        <div>
            <label>Fitness discplines</label>
            <Typeahead
                id="basic-typeahead-multiple"
                labelKey="disciplinename"
                onChange={OnChange}
                options={fitnessdisciplines}
                placeholder="You can Choose multiple discplines..."
                selected={multiSelections}
                // multiple
                disabled={props.uiSchema.readonly}
            />
        </div>
    )
}

export default MultiSelect
