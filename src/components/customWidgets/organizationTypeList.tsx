import { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { ORGANIZATION_TYPE } from './queries';
import { useQuery } from '@apollo/client';
import { flattenObj } from '../utils/responseFlatten';

const MultiSelect = (props: any) => {
    const [multiSelections, setMultiSelections] = useState(
        props.value?.length > 0 ? JSON.parse(props.value) : []
    );
    const [org, setOrg] = useState<any[]>([]);

    function FetchData() {
        useQuery(ORGANIZATION_TYPE, { onCompleted: loadData });
    }

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data });
        setOrg(
            [...flattenedData.organizationTypes].map((orgType) => {
                return {
                    id: orgType.id,
                    title: orgType.Org_title_name
                };
            })
        );
    }

    function OnChange(e) {
        // let id = e.map(d => {return d.id}).join(',');
        props.onChange(JSON.stringify(e));
        setMultiSelections(e);
    }

    FetchData();

    return (
        <div>
            <label>Organization Type</label>
            <Typeahead
                id="basic-typeahead-multiple"
                labelKey="title"
                onChange={OnChange}
                options={org}
                placeholder="Select type..."
                selected={multiSelections}
            />
        </div>
    );
};

export default MultiSelect;
