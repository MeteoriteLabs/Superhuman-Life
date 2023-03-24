import { useState, useContext } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { FETCH_CHANGEMAKERS } from "./queries";
import { useQuery } from "@apollo/client";
import { flattenObj } from "../utils/responseFlatten";
import AuthContext from "../../context/auth-context";

const Changemakers = (props: any) => {
  const auth = useContext(AuthContext);
  function handleReturnType(value) {
    if (typeof value === "string") {
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  const [multiSelections, setMultiSelections] = useState<any[]>(
    props.value?.length ? handleReturnType(props.value) : []
  );
  const [changemakerList, setChangemakerList] = useState<any[]>([]);

  function FetchData() {
    useQuery(FETCH_CHANGEMAKERS, {
      variables: { id: auth.userid },
      onCompleted: loadData,
    });
  }

  function loadData(data: any) {
    const flattenedData = flattenObj({ ...data });

    setChangemakerList(
      [...flattenedData.usersPermissionsUsers].map((currValue) => {
        return {
          id: currValue.id,
          username: currValue.username,
        };
      })
    );
  }

  function OnChange(e) {
    const unique = [...new Map(e.map((m) => [m.id, m])).values()];
    setMultiSelections(unique);
  }

  if (multiSelections.length) {
    props.onChange(JSON.stringify(multiSelections));
  } else {
    props.onChange(undefined);
  }

  FetchData();

  return (
    <div>
      <label>Add changemaker</label>
      <Typeahead
        id="basic-typeahead-multiple"
        labelKey="username"
        onChange={OnChange}
        options={changemakerList}
        placeholder="Choose Changemaker..."
        selected={multiSelections}
      />
    </div>
  );
};

export default Changemakers;
