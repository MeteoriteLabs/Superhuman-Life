import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import { GET_FITNESS_DISCIPLINES } from '../graphQL/queries';
import { flattenObj } from '../../../../components/utils/responseFlatten';

export default function FitnessMultiSelect(props) {
    const { widgetProps, actionType } = props;
    const [fitnessdisciplines, setFitnessdisciplines] = useState([]);
    const [multiSelections, setMultiSelections] = useState([]);

    const FetchData = () => {
        useQuery(GET_FITNESS_DISCIPLINES, {
            onCompleted: loadData
        })
    }

    const loadData = (data) => {
        const flattenData = flattenObj({...data});
        setFitnessdisciplines(
            [...flattenData.fitnessdisciplines].map(discipline => {
                return {
                    id: discipline.id,
                    disciplinename: discipline.disciplinename,
                }
            })
        )
    }

    useEffect(() => {
        if (widgetProps.value && typeof (widgetProps.value) !== "object") {
            if (typeof (widgetProps.value) === "string") {
                setMultiSelections(JSON.parse(widgetProps.value))
            
            } else {
                setMultiSelections(JSON.stringify(widgetProps.value))
            }
        } 
        
        return () => {
            setMultiSelections()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    FetchData()
    return <div>
        <label>{widgetProps.label}</label>
        {fitnessdisciplines && <Typeahead
            required
            disabled={actionType === "view" ? true : false}
            selected={multiSelections}
            labelKey="disciplinename"
            id="basic-typeahead-multiple"
            options={fitnessdisciplines}
            placeholder="Choose your discpline ... "
            onChange={(e) => {
                setMultiSelections(e)
                widgetProps.onChange(JSON.stringify(e))
            }}
            multiple />}

    </div>
}
