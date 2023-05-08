import React, { useState, useContext, Fragment, useEffect } from 'react';
// import { Typeahead } from "react-bootstrap-typeahead";
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FETCH_FITNESS_PACKAGE } from './queries';
import { useQuery } from '@apollo/client';
import { flattenObj } from '../utils/responseFlatten';
import AuthContext from '../../context/auth-context';

const OfferingList: React.FC<{ value: string; onChange: (params: string | null) => void }> = (
  props
) => {
  const auth = useContext(AuthContext);
  function handleReturnType(value) {
    if (typeof value === 'string') {
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  const [offeringSelectedId, setOfferingSelectedId] = useState<string | null>(
    null
    // props.value ? handleReturnType(props.value) : null
  );
  const [offeringSelectedName, setOfferingSelectedName] = useState<string | null>(
    null
    // props.value ? handleReturnType(props.value) : null
  );
  const [offeringList, setOfferingList] = useState<any[]>([]);

  // eslint-disable-next-line
  const { data: get_fitness, refetch: refetchFitness } = useQuery(FETCH_FITNESS_PACKAGE, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      loadData(data);
    }
  });

  function loadData(data: any) {
    const flattenedData = flattenObj({ ...data });
    setOfferingList(
      [...flattenedData?.offeringInventories].map((currValue) => {
        return {
          id: currValue.fitnesspackage.id && currValue.fitnesspackage.id,
          name: currValue.fitnesspackage.packagename && currValue.fitnesspackage.packagename
        };
      })
    );
  }
  // console.log(offeringList);
  function OnChangeHandler(e) {
    // const unique = [...new Map(e.map((m) => [m.id, m])).values()];
    // setMultiSelections(unique);
  }

  if (offeringSelectedId) {
    props.onChange(offeringSelectedId);
  } else {
    props.onChange(null);
  }

  // useEffect(() => {
  //   refetchFitness();
  // }, [get_fitness]);

  return (
    <Fragment>
      <DropdownButton title={offeringSelectedName ? offeringSelectedName : "Select offering"}>
        {offeringList.map((currentOffering) => (
          <Dropdown.Item
            key={currentOffering.id}
            onClick={() => {
              setOfferingSelectedId(currentOffering.id);
              setOfferingSelectedName(currentOffering.name);
            }}>
            {currentOffering.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </Fragment>
  );
};

export default OfferingList;
