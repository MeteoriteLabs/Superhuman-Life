import React, { useState, useContext, Fragment } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { FETCH_FITNESS_PACKAGE } from './queries';
import { useQuery } from '@apollo/client';
import { flattenObj } from '../utils/responseFlatten';
import AuthContext from '../../context/auth-context';

interface OfferingInventory {
  id: string;
  ActiveBookings: number;
  fitnesspackage: FitnessPackage;
  __typename: string;
}

interface FitnessPackage {
  id: string;
  packagename: string;
  __typename: string;
}

const OfferingList: React.FC<{ value: string; onChange: (params: string | null) => void }> = ({
  value,
  onChange
}) => {
  const auth = useContext(AuthContext);
  const [offeringSelectedId, setOfferingSelectedId] = useState<string | null>(null);
  const [offeringSelectedName, setOfferingSelectedName] = useState<string | null>(null);
  const [offeringList, setOfferingList] = useState<{ id: string; name: string }[]>([]);

  useQuery<OfferingInventory>(FETCH_FITNESS_PACKAGE, {
    variables: { Changemakerid: auth.userid },
    onCompleted: (data) => {
      loadData(data);
    }
  });

  function loadData(data: OfferingInventory) {
    const flattenedData = flattenObj({ ...data });
    console.log(flattenedData);
    setOfferingList(
      [...flattenedData.offeringInventories].map((currValue) => {
        return {
          id: currValue.fitnesspackage && currValue.fitnesspackage.id,
          name: currValue.fitnesspackage && currValue.fitnesspackage.packagename
        };
      })
    );
  }

  console.log(offeringList);

  if (offeringSelectedId) {
    onChange(offeringSelectedId);
  } else {
    onChange(null);
  }

  return (
    <Fragment>
      <DropdownButton title={offeringSelectedName ? offeringSelectedName : 'Select offering'}>
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
