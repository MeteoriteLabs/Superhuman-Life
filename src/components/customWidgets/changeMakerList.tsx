import React, { useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { DESIGNATIONS } from './queries';
import { useQuery } from '@apollo/client';
import { flattenObj } from '../utils/responseFlatten';

const MultiSelect: React.FC<{ value: string; onChange: (params: string) => void }> = ({
  value,
  onChange
}) => {
  const [multiSelections, setMultiSelections] = useState(value?.length ? JSON.parse(value) : []);
  const [designations, setDesignations] = useState<any[]>([]);

  function FetchData() {
    useQuery(DESIGNATIONS, { onCompleted: loadData });
  }

  function loadData(data: any) {
    console.log(data);
    const flattenedData = flattenObj({ ...data });
    setDesignations(
      [...flattenedData.designations].map((designation) => {
        return {
          id: designation.id,
          title: designation.Designation_title
        };
      })
    );
  }

  function OnChange(e) {
    setMultiSelections(e);
  }

  FetchData();

  onChange(JSON.stringify(multiSelections));

  return (
    <div>
      <label>Designation</label>
      <Typeahead
        id="basic-typeahead-multiple"
        labelKey="title"
        onChange={OnChange}
        options={designations}
        placeholder="Select Designation..."
        selected={multiSelections}
        multiple
      />
    </div>
  );
};

export default MultiSelect;
