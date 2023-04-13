import React, { useContext, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { useQuery, gql } from "@apollo/client";
import AuthContext from "../../context/auth-context";
import { flattenObj } from "../utils/responseFlatten";

const LocationList: React.FC<{onChange: (args: string) => void;}> = (props) => {
  const auth = useContext(AuthContext);
  const [singleSelections, setSingleSelections] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressTitle, setAddressTitle] = useState("Other");

  const FETCH_USER_ADDRESSES = gql`
    query addresses($id: ID!) {
      addresses(filters: { users_permissions_user: { id: { eq: $id } } }) {
        data {
          id
          attributes {
            address1
          }
        }
      }
    }
  `;

  function FetchData() {
    useQuery(FETCH_USER_ADDRESSES, {
      variables: { id: auth.userid },
      onCompleted: loadData,
    });
  }

  function loadData(data: any) {
    const flattenedData = flattenObj({ ...data });

    setAddresses(
      [...flattenedData.addresses].map((address) => {
        return {
          id: address.id,
          title: address.address1,
        };
      })
    );
  }

  FetchData();

  function OnChange(e) {
    setSingleSelections(e);
  }

  props.onChange(
    JSON.stringify({ addressTag: addressTitle, address: singleSelections })
  );

  return (
    <>
      <div>
        <h6>Location</h6>
        <Row>
          <Col lg={3}>
            <Form.Group>
              <Form.Control
                as="select"
                value={addressTitle}
                onChange={(e: any) => {
                  setAddressTitle(e.target.value);
                }}
              >
                <option value="Other">Other</option>
                <option value="At My Address">At My Address</option>
                <option value="At Client Address">At Client Address</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Typeahead
              id="basic-typeahead-multiple"
              labelKey="title"
              onChange={OnChange}
              options={addresses}
              placeholder="Search Address.."
              selected={singleSelections}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LocationList;
