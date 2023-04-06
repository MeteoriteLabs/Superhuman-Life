import { useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { useQuery, gql } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import AddFitnessAddressModal from "../../../../components/customWidgets/AddFitnessAddressModal";

const GroupProgramDetails = (props) => {
  const inputDisabled = props.readonly;
  const existingData =
    props.value === undefined ? undefined : JSON.parse(props.value);
  if (existingData && existingData.length) {
    existingData.address = {
      id: JSON.parse(existingData?.address)[0].id,
      title: JSON.parse(existingData?.address)[0].title,
    };
  }

  const [mode, setMode] = useState(
    props.value ? existingData.mode.toString() : "0"
  );
  const [addressModal, setAddressModal] = useState<boolean>(false);

  const auth = useContext(AuthContext);
  const [singleSelections, setSingleSelections] = useState<any[]>(
    existingData?.address?.length && props.value ? existingData?.address : []
  );
  const [addresses, setAddresses] = useState<any[]>([]);
  // eslint-disable-next-line 
  const [addressTitle, setAddressTitle] = useState(
    props.value ? existingData.addressTag : "At My Address"
  );
  const [onlineClasses, setOnlineClasses] = useState<number>(
    existingData?.online ? existingData.online : 0
  );
  const [offlineClasses, setOfflinceClasses] = useState<number>(
    existingData?.offline ? existingData.offline : 0
  );
  const [restDays, setRestDays] = useState<number>(
    existingData?.rest ? existingData.rest : 0
  );

  useEffect(() => {
    if (onlineClasses > 30) {
      setOnlineClasses(30);
    }
    if (offlineClasses > 30) {
      setOfflinceClasses(30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineClasses, offlineClasses, restDays, mode]);

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

  const mainQuery = useQuery(FETCH_USER_ADDRESSES, {
    variables: { id: auth.userid },
    onCompleted: loadData,
  });

  function loadData(data: any) {
    const flattenedData = flattenObj({ ...data });

    setAddresses(
      [...flattenedData.addresses].map((address) => {
        return {
          id: address.id,
          address1: address.address1,
        };
      })
    );
  }

  function OnChange(e) {
    setSingleSelections(e);
  }

  function handleCallback() {
    mainQuery.refetch();
  }

  function handleValidation(mode: string) {
    //here we will check for online
    if (restDays < 0) {
      return false;
    }
    if (mode === "0") {
      if (onlineClasses + restDays === 30) {
        return true;
      } else {
        return false;
      }
    }
    //here we will check for offline
    if (mode === "1") {
      if (restDays + offlineClasses === 30) {
        if (addressTitle === "At My Address" && singleSelections.length) {
          return true;
        }
        if (addressTitle === "At Client Address") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    //here we will check for both(hybrid)
    if (mode === "2") {
      if (restDays + offlineClasses + onlineClasses === 30) {
        if (addressTitle === "At My Address" && singleSelections.length) {
          return true;
        }
        if (addressTitle === "At Client Address") {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  useEffect(() => {
    if (mode === "0") {
      setOfflinceClasses(0);
      setSingleSelections([]);
    } else if (mode === "1") {
      setOnlineClasses(0);
    }
  }, [mode]);

  if (handleValidation(mode)) {
    props.onChange(
      JSON.stringify({
        addressTag: addressTitle,
        address: singleSelections,
        mode: mode,
        online: onlineClasses,
        offline: offlineClasses,
        rest: restDays,
      })
    );
  } else {
    props.onChange(undefined);
  }

  useEffect(() => {
    if (mode === "0") {
      setRestDays(30 - onlineClasses);
    }
    if (mode === "1") {
      setRestDays(30 - offlineClasses);
    }
    if (mode === "2") {
      setRestDays(30 - (onlineClasses + offlineClasses));
    }
  }, [onlineClasses, offlineClasses, mode]);

  return (
    <>
      <div>
        <label>
          <b>Mode</b>
        </label>
        <Form>
          <Form.Check
            inline
            label="Online"
            disabled={inputDisabled}
            value="0"
            defaultChecked={mode === "0" ? true : false}
            name="group1"
            type="radio"
            onClick={(e: any) => setMode(e.target.value)}
          />
          <Form.Check
            inline
            label="Offline"
            disabled={inputDisabled}
            value="1"
            defaultChecked={mode === "1" ? true : false}
            name="group1"
            type="radio"
            onClick={(e: any) => setMode(e.target.value)}
          />
          <Form.Check
            inline
            label="Hybrid"
            disabled={inputDisabled}
            value="2"
            defaultChecked={mode === "2" ? true : false}
            name="group1"
            type="radio"
            onClick={(e: any) => setMode(e.target.value)}
          />
        </Form>
      </div>
      {mode !== "0" && (
        <>
          {mode !== "" && (
            <div>
              <label>
                <b>Location</b>
              </label>
              <Row>
                  <Col lg={6} sm={12}>
                    <Typeahead
                      id="basic-typeahead-multiple"
                      labelKey="address1"
                      onChange={OnChange}
                      options={addresses}
                      placeholder="Search Address.."
                      selected={singleSelections}
                      disabled={inputDisabled}
                      clearButton
                    />
                  </Col>
              </Row>
              {addressTitle === "At My Address" && (
                <Row>
                  <Col lg={{ offset: 3 }}>
                    <Button
                      disabled={inputDisabled}
                      variant="outline-info"
                      onClick={() => {
                        setAddressModal(true);
                      }}
                    >
                      + Add New Address
                    </Button>
                  </Col>
                </Row>
              )}

              <AddFitnessAddressModal
                show={addressModal}
                onHide={() => {
                  setAddressModal(false);
                  handleCallback();
                }}
              />
            </div>
          )}
        </>
      )}
      <div className="m-5 p-1 text-center shadow-lg">
        <h6>Set For One Month (30 Days)</h6>
      </div>
      {mode !== "" && (
        <div>
          <label>
            <b>Enter Number of Sessions</b>
          </label>
        </div>
      )}
      {mode !== "" && (mode === "0" || mode === "2") && (
        <Row>
          <Col lg={1}>
            <img src="/assets/Group-Online.svg" alt="group-online" />
          </Col>
          <Col lg={2}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                min={1}
                max={28}
                value={onlineClasses}
                disabled={inputDisabled}
                onChange={(e: any) =>
                  setOnlineClasses(parseInt(e.target.value))
                }
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon1">Sessions</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
      )}
      {mode !== "" && (mode === "1" || mode === "2") && (
        <Row>
          <Col lg={1}>
            <img src="/assets/Group-Offline.svg" alt="group offline" />
          </Col>
          <Col lg={2}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                min={2}
                max={10}
                value={offlineClasses}
                disabled={inputDisabled}
                onChange={(e: any) =>
                  setOfflinceClasses(parseInt(e.target.value))
                }
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon1">Sessions</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
      )}
      {mode !== "" && (
        <div>
          <label>
            <b>Rest Days</b>
          </label>
        </div>
      )}
      {mode !== "" && (
        <Row>
          <Col lg={2}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                min={0}
                value={restDays}
                // disabled={true}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon1">Days</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default GroupProgramDetails;
