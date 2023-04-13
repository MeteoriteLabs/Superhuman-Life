import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import { GET_FITNESS_DISCIPLINES } from '../graphQL/queries';
import { flattenObj } from '../../../../components/utils/responseFlatten';

const FitnessMultiSelect: React.FC<{widgetProps: any; actionType: string;}> = (props) => {
    // const { widgetProps, actionType } = props;
    const [fitnessdisciplines, setFitnessdisciplines] = useState<string[]>([]);
    const [multiSelections, setMultiSelections] = useState<string[]>([]);

    const FetchData = () => {
        useQuery(GET_FITNESS_DISCIPLINES, {
            onCompleted: loadData
        })
    }

    const loadData = (data) => {
        const flattenData = flattenObj({...data});
        setFitnessdisciplines(
            flattenData?.fitnessdisciplines.map(discipline => {
                return {
                    id: discipline.id,
                    disciplinename: discipline.disciplinename,
                }
    })
        )
    }

    useEffect(() => {
        if (props.widgetProps.value && typeof (props.widgetProps.value) !== "object") {
            if (typeof (props.widgetProps.value) === "string") {
                setMultiSelections(JSON.parse(props.widgetProps.value))
            
            } else {
                setMultiSelections([JSON.stringify(props.widgetProps.value)])
            }
        } 
        
        return () => {
            setMultiSelections([])
        }

    }, [])

    FetchData()
    return <div>
        <label>{props.widgetProps.label}</label>
        {fitnessdisciplines && <Typeahead
            // required
            disabled={props.actionType === "view" ? true : false}
            selected={multiSelections}
            // labelKey="disciplinename"
            id="basic-typeahead-multiple"
            options={fitnessdisciplines}
            placeholder="Choose your discpline ... "
            onChange={(e) => {
                setMultiSelections(e)
                props.widgetProps.onChange(JSON.stringify(e))
            }}
            multiple />}

    </div>
}

export default FitnessMultiSelect;