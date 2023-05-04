import React, { useState, useContext, Fragment, useEffect } from "react";
// import { Typeahead } from "react-bootstrap-typeahead";
import { DropdownButton, Dropdown } from "react-bootstrap";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { FETCH_FITNESS_PACKAGE } from "./queries";
import { useQuery } from "@apollo/client";
import { flattenObj } from "../utils/responseFlatten";
import AuthContext from "../../context/auth-context";

const OfferingList: React.FC<{value: string; onChange: (params: string|null) => void;}> = (props) => {
  const auth = useContext(AuthContext);
  function handleReturnType(value) {
    if (typeof value === "string") {
      return JSON.parse(value);
    } else {
      return value;
    }
  }
  console.log(props);

  const [multiSelections, setMultiSelections] = useState<string|null>(null
    // props.value ? handleReturnType(props.value) : null
  );
  const [offeringList, setOfferingList] = useState<any[]>([]);

  // eslint-disable-next-line
  const { data: get_fitness, refetch: refetchFitness } = useQuery(FETCH_FITNESS_PACKAGE, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
        loadData(data)
    }
  });


  function loadData(data: any) {
    const flattenedData = flattenObj({ ...data });
    console.log(flattenedData);
    setOfferingList(
      [...flattenedData?.offeringInventories].map((currValue) => {
        return {
          id: currValue.fitnesspackage.id && currValue.fitnesspackage.id,
          name: currValue.fitnesspackage.packagename && currValue.fitnesspackage.packagename,
        };
      })
    );
  }
// console.log(offeringList);
  function OnChangeHandler(e) {

    // const unique = [...new Map(e.map((m) => [m.id, m])).values()];
    // setMultiSelections(unique);
  }

  if (multiSelections) {
    props.onChange(multiSelections);
  } else {
    props.onChange(null);
  }

  useEffect(() => {
    refetchFitness();

  }, [get_fitness])

  return (
    <Fragment>
    <DropdownButton title="Select offering">
      {
        offeringList.map(currentOffering => <Dropdown.Item key={currentOffering.id} onClick={() => {setMultiSelections(currentOffering.id)}}>{currentOffering.name}</Dropdown.Item>)
      }
  
  
</DropdownButton>
</Fragment>
  );
};

export default OfferingList;
