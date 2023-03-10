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

const CustomProgramDetails = (props) => {
  const inputDisabled = props.readonly;

  const existingData =
    props.value === undefined ? undefined : JSON.parse(props.value);
  if (existingData && existingData.length > 0) {
    existingData.address = {
      id: JSON.parse(existingData?.address)[0].id,
      title: JSON.parse(existingData?.address)[0].title,
    };
  }

  const [mode, setMode] = useState(
    props.value ? existingData.mode.toString() : "0"
  );
  const [addressModal, setAddressModal] = useState(false);

  const auth = useContext(AuthContext);
  const [singleSelections, setSingleSelections] = useState<any[]>(
    existingData?.address?.length !== 0 && props.value !== undefined
      ? existingData?.address
      : []
  );
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressTitle, setAddressTitle] = useState(
    props.value ? existingData.addressTag : "At My Address"
  );
  const [ptOnlineClasses, setPtOnlineClasses] = useState<number>(
    existingData?.ptOnline ? existingData.ptOnline : 0
  );
  const [groupOnlineClasses, setGroupOnlineClasses] = useState<number>(
    existingData?.groupOnline ? existingData.groupOnline : 0
  );
  const [ptOfflineClasses, setPtOfflineClasses] = useState<number>(
    existingData?.ptOffline ? existingData.ptOffline : 0
  );
  const [groupOfflineClasses, setGroupOfflineClasses] = useState<number>(
    existingData?.groupOffline ? existingData.groupOffline : 0
  );
  const [recordedClasses, setRecordedClasses] = useState<number>(
    existingData?.recorded ? existingData.recorded : 0
  );
  const [restDays, setRestDays] = useState<number>(
    existingData?.rest ? existingData.rest : 0
  );

  useEffect(() => {
    if (ptOnlineClasses > 30) {
      setPtOnlineClasses(30);
    }
    if (ptOfflineClasses > 30) {
      setPtOnlineClasses(30);
    }
    if (groupOnlineClasses > 30) {
      setGroupOnlineClasses(30);
    }
    if (groupOfflineClasses > 30) {
      setGroupOfflineClasses(30);
    }
    if (recordedClasses > 30) {
      setRecordedClasses(30);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ptOnlineClasses,
    ptOfflineClasses,
    restDays,
    mode,
    recordedClasses,
    groupOfflineClasses,
    groupOnlineClasses,
  ]);

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
    //    here we will check for online
    if (restDays < 0) {
      return false;
    }
    if (mode === "0") {
      if (
        ptOnlineClasses + groupOnlineClasses + recordedClasses + restDays ===
        30
      ) {
        return true;
      } else {
        return false;
      }
    }
    //here we will check for offline
    if (mode === "1") {
      if (
        restDays + groupOfflineClasses + ptOfflineClasses + recordedClasses ===
        30
      ) {
        if (addressTitle === "At My Address" && singleSelections.length !== 0) {
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
      if (
        restDays +
          ptOfflineClasses +
          ptOnlineClasses +
          groupOfflineClasses +
          groupOnlineClasses +
          recordedClasses ===
        30
      ) {
        if (addressTitle === "At My Address" && singleSelections.length !== 0) {
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
    if (ptOnlineClasses < 0) {
      setPtOnlineClasses(0);
    }
    if (ptOfflineClasses < 0) {
      setPtOfflineClasses(0);
    }
    if (groupOnlineClasses < 0) {
      setGroupOnlineClasses(0);
    }
    if (groupOfflineClasses < 0) {
      setGroupOfflineClasses(0);
    }
    if (recordedClasses < 0) {
      setRecordedClasses(0);
    }
  }, [
    ptOnlineClasses,
    ptOfflineClasses,
    recordedClasses,
    groupOfflineClasses,
    groupOnlineClasses,
  ]);

  useEffect(() => {
    if (mode === "0") {
      setGroupOfflineClasses(0);
      setPtOfflineClasses(0);
      setSingleSelections([]);
    } else if (mode === "1") {
      setPtOnlineClasses(0);
      setGroupOnlineClasses(0);
    }
  }, [mode]);

  if (handleValidation(mode)) {
    props.onChange(
      JSON.stringify({
        addressTag: addressTitle,
        address: singleSelections,
        mode: mode,
        ptOnline: ptOnlineClasses,
        ptOffline: ptOfflineClasses,
        groupOnline: groupOnlineClasses,
        groupOffline: groupOfflineClasses,
        recorded: recordedClasses,
        rest: restDays,
      })
    );
  } else {
    props.onChange(undefined);
  }

  useEffect(() => {
    if (mode === "0") {
      setRestDays(
        30 - (ptOnlineClasses + recordedClasses + groupOnlineClasses)
      );
    }
    if (mode === "1") {
      setRestDays(
        30 - (groupOfflineClasses + recordedClasses + ptOfflineClasses)
      );
    }
    if (mode === "2") {
      setRestDays(
        30 -
          (ptOnlineClasses +
            ptOfflineClasses +
            groupOnlineClasses +
            recordedClasses +
            groupOfflineClasses)
      );
    }
  }, [
    ptOnlineClasses,
    ptOfflineClasses,
    groupOnlineClasses,
    groupOfflineClasses,
    recordedClasses,
    mode,
  ]);

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
            value="0"
            disabled={inputDisabled}
            defaultChecked={mode === "0" ? true : false}
            name="group1"
            type="radio"
            onClick={(e: any) => setMode(e.target.value)}
          />
          <Form.Check
            inline
            label="Offline"
            value="1"
            disabled={inputDisabled}
            defaultChecked={mode === "1" ? true : false}
            name="group1"
            type="radio"
            onClick={(e: any) => setMode(e.target.value)}
          />
          <Form.Check
            inline
            label="Hybrid"
            value="2"
            disabled={inputDisabled}
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
                <Col lg={3}>
                  <Form.Group>
                    <Form.Control
                      as="select"
                      disabled={inputDisabled}
                      value={addressTitle}
                      onChange={(e: any) => {
                        setAddressTitle(e.target.value);
                      }}
                    >
                      <option value="At My Address">At My Address</option>
                      <option value="At Client Address">
                        At Client Address
                      </option>
                    </Form.Control>
                  </Form.Group>
                </Col>
                {addressTitle === "At My Address" && (
                  <Col>
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
                )}
                {addressTitle === "At Client Address" && (
                  <span className="small text-muted">*Within city limits</span>
                )}
              </Row>
              {addressTitle === "At My Address" && (
                <Row>
                  <Col lg={{ offset: 3 }}>
                    <Button
                      variant="outline-info"
                      disabled={inputDisabled}
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
      <div className="m-5 p-2 text-center shadow-lg">
        <h4>Set For One Month (30 Days)</h4>
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
            <img
              src="/assets/custompersonal-training-online.svg"
              alt="custom-training"
            />
          </Col>
          <Col lg={2}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                min={0}
                max={28}
                value={ptOnlineClasses}
                disabled={inputDisabled}
                onChange={(e: any) =>
                  setPtOnlineClasses(parseInt(e.target.value))
                }
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon1">Sessions</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col lg={1}>
            <img src="/assets/customgroup-online.svg" alt="custom-training" />
          </Col>
          <Col lg={2}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                min={2}
                max={10}
                value={groupOnlineClasses}
                disabled={inputDisabled}
                onChange={(e: any) =>
                  setGroupOnlineClasses(parseInt(e.target.value))
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
            <img
              src="/assets/custompersonal-training-offline.svg"
              alt="custom-training"
            />
          </Col>
          <Col lg={2}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                min={0}
                max={28}
                value={ptOfflineClasses}
                disabled={inputDisabled}
                onChange={(e: any) =>
                  setPtOfflineClasses(parseInt(e.target.value))
                }
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon1">Sessions</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col lg={1}>
            <img src="/assets/customgroup-offline.svg" alt="custom-training" />
          </Col>
          <Col lg={2}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                min={2}
                max={10}
                value={groupOfflineClasses}
                disabled={inputDisabled}
                onChange={(e: any) =>
                  setGroupOfflineClasses(parseInt(e.target.value))
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
        <Row>
          <Col lg={1}>
            <img src="/assets/customclassic.svg" alt="custom-training" />
          </Col>
          <Col lg={2}>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
                type="number"
                min={2}
                max={10}
                value={recordedClasses}
                disabled={inputDisabled}
                onChange={(e: any) =>
                  setRecordedClasses(parseInt(e.target.value))
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
        <label>
          <b>Rest Days</b>
        </label>
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
                disabled={true}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon1">Days</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          {/* <span className='small'>*It should add upto 30 classes per month</span> */}
        </Row>
      )}
    </>
  );
};

export default CustomProgramDetails;
