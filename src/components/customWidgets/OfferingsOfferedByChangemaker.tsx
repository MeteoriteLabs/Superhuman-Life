import React, { useState, useContext, Fragment, useEffect } from "react";
// import { Typeahead } from "react-bootstrap-typeahead";
import { DropdownButton, Dropdown } from "react-bootstrap";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { GET_FITNESS } from "../../builders/package-builder/fitness/graphQL/queries";
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

  const [multiSelections, setMultiSelections] = useState<any[]>(
    props.value?.length > 0 ? handleReturnType(props.value) : []
  );
  const [offeringList, setOfferingList] = useState<any[]>([]);

  // eslint-disable-next-line
  const { data: get_fitness, refetch: refetchFitness } = useQuery(GET_FITNESS, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
        loadData(data)
    }
  });


  function loadData(data: any) {
    const flattenedData = flattenObj({ ...data });
    // console.log(flattenedData);
    setOfferingList(
      [...flattenedData?.fitnesspackages].map((currValue) => {
        return {
          id: currValue.id,
          name: currValue.packagename && currValue.packagename,
        //   email: currValue.email && currValue.email,
        };
      })
    );
  }
// console.log(offeringList);
  function OnChangeHandler(e) {

    // const unique = [...new Map(e.map((m) => [m.id, m])).values()];
    // setMultiSelections(unique);
  }

  if (multiSelections.length > 0) {
    props.onChange(JSON.stringify(multiSelections));
  } else {
    props.onChange(null);
  }

  useEffect(() => {
    refetchFitness();

  }, [get_fitness])

  return (
    // <div>
    //   <label>Add offering</label>
    //   <Typeahead
    //     id="basic-typeahead-multiple"
    //     labelKey="name"
    //     onChange={OnChange}
    //     options={offeringList}
    //     placeholder="Choose offerings..."
    //     selected={multiSelections}
    //   />
    // </div>
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
