import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';

import { GET_FITNESS_DISCIPLINES } from '../graphQL/queries';

export default function FitnessMultiSelect(props) {
    const { widgetProps, actionType } = props;


    const [multiSelections, setMultiSelections] = useState([]);
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
        // if (widgetProps.value && typeof (widgetProps.value) !== "object") {
        //     if (typeof (widgetProps.value) === "string") {
        //         setMultiSelections(JSON.parse(widgetProps.value))
        //     } else {
        //         setMultiSelections(JSON.stringify(widgetProps.value))
        //     }
        // } else {
        //     setMultiSelections(widgetProps.value);
        // }
    }




    useEffect(() => {
        if (widgetProps.value && typeof (widgetProps.value) !== "object") {
            if (typeof (widgetProps.value) === "string") {
                setMultiSelections(JSON.parse(widgetProps.value))
            } else {
                setMultiSelections(JSON.stringify(widgetProps.value))
            }
        } else {
            setMultiSelections(widgetProps.value);
        }

        return () =>{
            setMultiSelections()
        }
        
    },[setMultiSelections,widgetProps])




    FetchData()
    return <div>
        <label>{widgetProps.label}</label>
        <Typeahead
            required
            disabled={actionType === "view" ? true : false}
            defaultSelected={multiSelections}
            labelKey="disciplinename"
            id="basic-typeahead-multiple"
            options={fitnessdisciplines}
            placeholder="Choose your discpline ... "
            onChange={(e) => {
                setMultiSelections(e)
                widgetProps.onChange(JSON.stringify(e))
            }}
            multiple />
    </div>
}
