import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';

import { GET_FITNESS_DISCIPLINES } from '../graphQL/queries';

export default function FitnessMultiSelect(props) {
    console.log("props disciplines", props.value);

    let [multiSelections, setMultiSelections] = useState([]);
    const [fitnessdisciplines, setFitnessdisciplines] = useState([]);



    const FetchData = () => {
        useQuery(GET_FITNESS_DISCIPLINES, {
            onCompleted: loadData
        })
    }


    const loadData = (data) => {
        setFitnessdisciplines(
            [...data.fitnessdisciplines].map(discipline => {
                return {
                    id: discipline.id,
                    disciplinename: discipline.disciplinename,
                }
            })
        )
    }


    useEffect(() => {
        if (props.value) {
            if(typeof(props.value) === "string"){
                setMultiSelections(JSON.parse(props.value))
            }else{
                setMultiSelections(JSON.stringify(props.value))
            }
        }
    }, [])


    console.log("multiSelections",multiSelections)

    FetchData()
    return <div>
        <label>{props.label}</label>
        <Typeahead
            selected={multiSelections}
            labelKey="disciplinename"
            id="basic-typeahead-multiple"
            options={fitnessdisciplines}
            placeholder="Choose your discpline ... "
            onChange={(e) => {
                setMultiSelections(e)
                props.onChange(JSON.stringify(e))
            }}
            multiple />
    </div>
}
