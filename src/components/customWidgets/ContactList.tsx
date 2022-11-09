import { useState, useContext } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { GET_CONTACTS } from "./queries";
import { useQuery } from "@apollo/client";
import { flattenObj } from "../utils/responseFlatten";
import AuthContext from "../../context/auth-context";

const ContactList = (props: any) => {
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
  const [contactList, setContactList] = useState<any[]>([]);

  function FetchData() {
    useQuery(GET_CONTACTS, {
      variables: { id: Number(auth.userid) },
      onCompleted: loadData,
    });
  }

  function loadData(data: any) {
    const flattenedData = flattenObj({ ...data });

    setContactList(
      [...flattenedData.contacts].map((currValue) => {
        return {
          id: currValue.id,
          name: currValue.firstname && currValue.firstname,
          email: currValue.email && currValue.email,
        };
      })
    );
  }

  function OnChange(e) {
    const unique = [...new Map(e.map((m) => [m.id, m])).values()];
    setMultiSelections(unique);
  }

  if (multiSelections.length > 0) {
    props.onChange(JSON.stringify(multiSelections));
  } else {
    props.onChange(undefined);
  }

  FetchData();

  return (
    <div>
      <label>Add contact</label>
      <Typeahead
        id="basic-typeahead-multiple"
        labelKey="name"
        onChange={OnChange}
        options={contactList}
        placeholder="Choose Contact..."
        selected={multiSelections}
      />
    </div>
  );
};

export default ContactList;
