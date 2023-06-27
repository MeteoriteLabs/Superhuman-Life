import React, { useState, useContext } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useQuery, gql } from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import AddFitnessAddressModal from '../../../../components/customWidgets/AddFitnessAddressModal';

const ProgramDetails: React.FC<{
    readonly: boolean;
    value: string;
    onChange: (args: string | null) => void;
    formContext: any;
}> = (props) => {
    const inputDisabled = props.readonly;

    const existingData = props.value ? JSON.parse(props.value) : null;

    if (existingData && existingData.length > 0) {
        existingData.address = {
            id: JSON.parse(existingData?.address)[0].id,
            title: JSON.parse(existingData?.address)[0].title
        };
    }

    const [mode, setMode] = useState<string>(props.value ? existingData.mode.toString() : '0');

    const [addressModal, setAddressModal] = useState<boolean>(false);

    const auth = useContext(AuthContext);
    const [singleSelections, setSingleSelections] = useState<any[]>(
        existingData?.address?.length && props.value ? existingData?.address : []
    );
    const [addresses, setAddresses] = useState<any[]>([]);
    const [addressTitle, setAddressTitle] = useState(
        props.value ? existingData.addressTag : 'At My Address'
    );

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
    }

    if (handleValidation()) {
        props.onChange(
            JSON.stringify({
                addressTag: addressTitle,
                address: singleSelections,
                mode: mode
            })
        );
    } else {
        props.onChange(null);
    }

    if (handleValidation()) {
        props.onChange(
            JSON.stringify({
                addressTag: addressTitle,
                address: singleSelections,
                mode: mode
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
                </>
            )}
        </>
    );
};

export default ProgramDetails;
