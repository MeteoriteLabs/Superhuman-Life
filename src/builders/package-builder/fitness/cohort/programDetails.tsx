import React, { useState, useContext } from 'react';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery, gql } from '@apollo/client';
import AuthContext from 'context/auth-context';
import { flattenObj } from 'components/utils/responseFlatten';
import AddFitnessAddressModal from 'components/customWidgets/AddFitnessAddressModal';

const ProgramDetails: React.FC<{
    readonly: boolean;
    value: string;
    onChange: (args: string | null) => void;
    formContext: any;
}> = (props) => {
    const inputDisabled = props.readonly;
    const cohortClassSize = props.formContext.classSize;
    const existingData = props.value === undefined ? undefined : JSON.parse(props.value);

    if (existingData && existingData.length > 0) {
        existingData.address = {
            id: JSON.parse(existingData?.address)[0].id,
            title: JSON.parse(existingData?.address)[0].title
        };
    }

    const [mode, setMode] = useState<string>(props.value ? existingData.mode.toString() : '0');
    const [residential, setResidential] = useState<string>(
        '0'
        // (props?.value === undefined || existingData?.residential === null)
        //   ? '0'
        //   : existingData?.residential?.toString()
    );
    const [addressModal, setAddressModal] = useState<boolean>(false);

    const auth = useContext(AuthContext);
    const [singleSelections, setSingleSelections] = useState<any[]>(
        existingData?.address?.length && props.value ? existingData?.address : []
    );
    const [addresses, setAddresses] = useState<any[]>([]);
    const [addressTitle, setAddressTitle] = useState(
        props.value ? existingData.addressTag : 'At My Address'
    );

    const [showPrivate, setShowPrivate] = useState<boolean>(
        props.value ? existingData.accomodationDetails?.private : false
    );
    const [showSharing, setShowSharing] = useState<boolean>(
        props.value ? existingData.accomodationDetails?.sharing : false
    );
    const [privateRooms, setPrivateRooms] = useState<number>(
        props.value ? existingData.accomodationDetails?.privateRooms : null
    );
    const [twoSharing, setTwoSharing] = useState<number>(
        props.value ? existingData.accomodationDetails?.twoSharingRooms : null
    );
    const [threeSharing, setThreeSharing] = useState<number>(
        props.value ? existingData.accomodationDetails?.threeSharingRooms : null
    );
    const [foodDescription, setFoodDescription] = useState<string>(
        props?.value === undefined
            ? ''
            : existingData?.accomodationDetails?.foodDescription === undefined
            ? ''
            : existingData?.accomodationDetails?.foodDescription
    );
    const [accomodationDetails] = useState<any>({});

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
        onCompleted: loadData
    });

    function handleCallback() {
        mainQuery.refetch();
    }

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data });

        setAddresses(
            [...flattenedData.addresses].map((address) => {
                return {
                    id: address.id,
                    address1: address.address1
                };
            })
        );
    }

    function OnChange(e) {
        setSingleSelections(e);
    }

    function calculateAccomodation({
        onePerRoom = 0,
        twoPerRoom = 0,
        threePerRoom = 0
    }: {
        onePerRoom?: number;
        twoPerRoom?: number;
        threePerRoom?: number;
    }): boolean {
        if (onePerRoom + 2 * twoPerRoom + 3 * threePerRoom <= cohortClassSize) {
            return true;
        } else {
            return false;
        }
    }

    function handleValidation() {
        if (mode === '0') {
            return true;
        }
        if (mode === '1') {
            if (
                (addressTitle === 'At My Address' && singleSelections.length !== 0) ||
                addressTitle === 'At Client Address'
            ) {
                return true;
            }
        }
        if (mode === '2') {
            if (
                (addressTitle === 'At My Address' &&
                    singleSelections.length !== 0 &&
                    residential !== '') ||
                (mode === '2' && addressTitle === 'At Client Address')
            ) {
                if (!showPrivate && !showSharing) {
                    return false;
                }
                if (foodDescription === '' && residential === '1') {
                    return false;
                }
                if (showPrivate && privateRooms! > 0 && !showSharing) {
                    if (
                        calculateAccomodation({
                            onePerRoom: privateRooms,
                            twoPerRoom: twoSharing,
                            threePerRoom: threeSharing
                        })
                    ) {
                        return true;
                    }
                }
                if (showSharing && !showPrivate && (twoSharing! > 0 || threeSharing! > 0)) {
                    if (
                        calculateAccomodation({
                            onePerRoom: privateRooms,
                            twoPerRoom: twoSharing,
                            threePerRoom: threeSharing
                        })
                    ) {
                        return true;
                    }
                }
                if (
                    showPrivate &&
                    showSharing &&
                    privateRooms! > 0 &&
                    (twoSharing! > 0 || threeSharing! > 0)
                ) {
                    if (
                        calculateAccomodation({
                            onePerRoom: privateRooms,
                            twoPerRoom: twoSharing,
                            threePerRoom: threeSharing
                        })
                    ) {
                        return true;
                    }
                }
            }
        }
    }

    accomodationDetails.private = showPrivate;
    accomodationDetails.sharing = showSharing;
    accomodationDetails.privateRooms = (showPrivate && privateRooms) || null;
    accomodationDetails.twoSharingRooms = (showSharing && twoSharing) || null;
    accomodationDetails.threeSharingRooms = (showSharing && threeSharing) || null;
    accomodationDetails.foodDescription = foodDescription;

    if (handleValidation()) {
        props.onChange(
            JSON.stringify({
                addressTag: addressTitle,
                address: singleSelections,
                mode: mode,
                residential: residential,
                accomodationDetails: accomodationDetails
            })
        );
    } else {
        props.onChange(null);
    }

    accomodationDetails.private = showPrivate;
    accomodationDetails.sharing = showSharing;
    accomodationDetails.privateRooms = privateRooms;
    accomodationDetails.twoSharingRooms = twoSharing;
    accomodationDetails.threeSharingRooms = threeSharing;
    accomodationDetails.foodDescription = foodDescription;

    if (handleValidation()) {
        props.onChange(
            JSON.stringify({
                addressTag: addressTitle,
                address: singleSelections,
                mode: mode,
                residential: residential,
                accomodationDetails: accomodationDetails
            })
        );
    } else {
        props.onChange(null);
    }

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
                        defaultChecked={mode === '0' ? true : false}
                        name="group1"
                        type="radio"
                        onClick={(e: any) => setMode(e.target.value)}
                    />
                    <Form.Check
                        inline
                        label="Offline"
                        disabled={inputDisabled}
                        value="1"
                        defaultChecked={mode === '1' ? true : false}
                        name="group1"
                        type="radio"
                        onClick={(e: any) => setMode(e.target.value)}
                    />
                    <Form.Check
                        inline
                        label="Residential"
                        disabled={inputDisabled}
                        value="2"
                        defaultChecked={mode === '2' ? true : false}
                        name="group1"
                        type="radio"
                        onClick={(e: any) => setMode(e.target.value)}
                    />
                </Form>
            </div>
            {mode !== '0' && (
                <>
                    {mode !== '' && (
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
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                {addressTitle === 'At My Address' && (
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
                            </Row>
                            {addressTitle === 'At My Address' && (
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
                    {mode !== '' && mode === '2' && (
                        <div>
                            <label>
                                <b>Residential</b>
                            </label>
                            <Form>
                                <Form.Check
                                    inline
                                    label="Accommodation"
                                    disabled={inputDisabled}
                                    value="0"
                                    defaultChecked={residential === '0' ? true : false}
                                    name="group1"
                                    type="radio"
                                    onClick={(e: any) => setResidential(e.target.value)}
                                />
                                <Form.Check
                                    inline
                                    label="Accommodation + Food"
                                    value="1"
                                    disabled={inputDisabled}
                                    defaultChecked={residential === '1' ? true : false}
                                    name="group1"
                                    type="radio"
                                    onClick={(e: any) => setResidential(e.target.value)}
                                />
                            </Form>
                        </div>
                    )}
                    {residential !== '' && mode === '2' && (
                        <div className="mt-3">
                            <Form.Check
                                custom
                                inline
                                type="checkbox"
                                id={`custom-checkbox`}
                                label="Private Rooms"
                                checked={showPrivate}
                                disabled={inputDisabled}
                                onChange={() => {
                                    setShowPrivate(!showPrivate);
                                }}
                            />
                            <Form.Check
                                custom
                                inline
                                type="checkbox"
                                id={`custom-checkbox2`}
                                label="Sharing"
                                checked={showSharing}
                                disabled={inputDisabled}
                                onChange={() => {
                                    setShowSharing(!showSharing);
                                }}
                            />
                        </div>
                    )}
                    {showPrivate && mode === '2' && (
                        <div className="mt-3">
                            <label>
                                <b>Private Rooms</b>
                            </label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    disabled={inputDisabled}
                                    value={privateRooms}
                                    min={0}
                                    onChange={(e: any) => setPrivateRooms(parseInt(e.target.value))}
                                />
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1">Rooms</InputGroup.Text>
                                </InputGroup.Prepend>
                            </InputGroup>
                        </div>
                    )}
                    {showSharing && mode === '2' && (
                        <div>
                            <label>
                                <b>Sharing Rooms</b>
                            </label>
                            <Row>
                                <Col>
                                    <label>
                                        <b>Dual Occupancy</b>
                                    </label>
                                    <InputGroup>
                                        <Form.Control
                                            disabled={inputDisabled}
                                            type="number"
                                            min={0}
                                            value={twoSharing}
                                            onChange={(e: any) => {
                                                setTwoSharing(parseInt(e.target.value));
                                            }}
                                        />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">
                                                Rooms
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                    <span className="small text-muted">
                                        Dual Occupancy as One room will be shared by 2 participants
                                    </span>
                                </Col>
                                <Col>
                                    <label>
                                        <b>Triple Occupancy</b>
                                    </label>
                                    <InputGroup>
                                        <Form.Control
                                            disabled={inputDisabled}
                                            type="number"
                                            min={0}
                                            value={threeSharing}
                                            onChange={(e: any) =>
                                                setThreeSharing(parseInt(e.target.value))
                                            }
                                        />
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">
                                                Rooms
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                    </InputGroup>
                                    <span className="small text-muted">
                                        Triple Occupancy as One room will be shared by 3
                                        participants
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    )}
                    {residential === '1' && mode === '2' && (
                        <div>
                            <label>
                                <b>Food Description</b>
                            </label>
                            <Form.Group controlId="formBasictext">
                                <Form.Control
                                    as="textarea"
                                    disabled={inputDisabled}
                                    aria-label="With textarea"
                                    value={foodDescription}
                                    onChange={(e: any) => {
                                        setFoodDescription(e.target.value);
                                    }}
                                />
                            </Form.Group>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ProgramDetails;
