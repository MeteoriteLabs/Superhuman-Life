import React, { useState, useContext } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { useQuery, gql } from '@apollo/client'
import AuthContext from '../../../../context/auth-context'
import { flattenObj } from '../../../../components/utils/responseFlatten'
import AddFitnessAddressModal from '../../../../components/customWidgets/AddFitnessAddressModal'
import { ADDRESSES_IS_PRIMARY } from '../../../../pages/profile/queries/queries'
import { BasicAddressDetails } from '../../../../pages/profile/ProfileOptions/AddressDetails/CreateAddress'

const PtProgramDetails: React.FC<{
    value: string
    readonly: boolean
    onChange: (args: string | null) => void
}> = (props) => {
    const inputDisabled = props.readonly

    const existingData = props.value ? JSON.parse(props.value) : null
    if (existingData && existingData.length > 0) {
        existingData.address = {
            id: JSON.parse(existingData?.address)[0].id,
            title: JSON.parse(existingData?.address)[0].title
        }
    }

    const [primaryAddress, setPrimaryAddress] = useState<BasicAddressDetails[]>([])
    const [clientAddress, setClientAddress] = useState<string>(
        existingData?.clientAddress ? existingData.clientAddress : ''
    )
    const [distance, setDistance] = useState<string>(
        existingData?.distance ? existingData.distance : '5 Km'
    )
    const [mode, setMode] = useState<string>(props.value ? existingData.mode.toString() : '0')
    const [addressModal, setAddressModal] = useState<boolean>(false)

    const auth = useContext(AuthContext)
    const [singleSelections, setSingleSelections] = useState<any[]>(
        existingData?.address?.length && props.value ? existingData?.address : []
    )
    const [addresses, setAddresses] = useState<any[]>([])
    const [addressTitle, setAddressTitle] = useState<string>(
        props.value ? existingData.addressTag : 'At My Address'
    )

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
    `

    const mainQuery = useQuery(FETCH_USER_ADDRESSES, {
        variables: { id: auth.userid },
        onCompleted: loadData
    })

    // get primary addresses
    useQuery(ADDRESSES_IS_PRIMARY, {
        variables: { id: auth.userid, is_primary: true },
        onCompleted: (response) => {
            const flattenDetail = flattenObj({ ...response.addresses })

            setPrimaryAddress(flattenDetail)
            const address = flattenDetail.map(
                (currentValue) =>
                    `${currentValue.House_Number}, ${currentValue.address1}, ${currentValue.address2}, ${currentValue.city}, ${currentValue.state}, ${currentValue.country}`
            )
            setClientAddress(address)
        }
    })

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data })

        setAddresses(
            [...flattenedData.addresses].map((address) => {
                return {
                    id: address.id,
                    address1: address.address1
                }
            })
        )
    }

    function OnChange(e) {
        setSingleSelections(e)
    }

    function handleCallback() {
        mainQuery.refetch()
    }

    if (mode === '0') {
        props.onChange(
            JSON.stringify({
                addressTag: addressTitle,
                address: singleSelections,
                mode: mode
            })
        )
    } else if (
        (mode !== '' && addressTitle === 'At My Address' && singleSelections.length !== 0) ||
        addressTitle === 'At Client Address'
    ) {
        props.onChange(
            JSON.stringify({
                addressTag: addressTitle,
                address: singleSelections,
                mode: mode,
                clientAddress: clientAddress,
                distance: distance
            })
        )
    } else {
        props.onChange(null)
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
                        value="0"
                        disabled={inputDisabled}
                        defaultChecked={mode === '0' ? true : false}
                        name="group1"
                        type="radio"
                        onClick={(e: any) => setMode(e.target.value)}
                    />
                    <Form.Check
                        inline
                        label="Offline"
                        value="1"
                        disabled={inputDisabled}
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
                                                setAddressTitle(e.target.value)
                                            }}
                                        >
                                            <option value="At My Address">At My Address</option>
                                            <option value="At Client Address">
                                                At Client Address
                                            </option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                {addressTitle === 'At My Address' && (
                                    <Col>
                                        <Typeahead
                                            clearButton
                                            id="basic-typeahead-multiple"
                                            labelKey="address1"
                                            onChange={OnChange}
                                            options={addresses}
                                            placeholder="Search Address.."
                                            selected={singleSelections}
                                            disabled={inputDisabled}
                                        />
                                    </Col>
                                )}
                                {addressTitle === 'At Client Address' && (
                                    <>
                                        <div className="p-3">
                                            <label>
                                                <b>Distance</b>
                                            </label>
                                            <Form>
                                                <Form.Check
                                                    inline
                                                    label="5 Km"
                                                    value="5 Km"
                                                    checked={distance === '5 Km' ? true : false}
                                                    name="group1"
                                                    type="radio"
                                                    onClick={(e: any) =>
                                                        setDistance(e.target.value)
                                                    }
                                                    disabled={inputDisabled}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="10 Km"
                                                    value="10 Km"
                                                    checked={distance === '10 Km' ? true : false}
                                                    name="group1"
                                                    type="radio"
                                                    onClick={(e: any) =>
                                                        setDistance(e.target.value)
                                                    }
                                                    disabled={inputDisabled}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="15 Km"
                                                    value="15 Km"
                                                    checked={distance === '15 Km' ? true : false}
                                                    name="group1"
                                                    type="radio"
                                                    onClick={(e: any) =>
                                                        setDistance(e.target.value)
                                                    }
                                                    disabled={inputDisabled}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="20 Km"
                                                    value="20 Km"
                                                    checked={distance === '20 Km' ? true : false}
                                                    name="group1"
                                                    type="radio"
                                                    onClick={(e: any) =>
                                                        setDistance(e.target.value)
                                                    }
                                                    disabled={inputDisabled}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="25 Km"
                                                    value="25 Km"
                                                    checked={distance === '25 Km' ? true : false}
                                                    name="group1"
                                                    type="radio"
                                                    onClick={(e: any) =>
                                                        setDistance(e.target.value)
                                                    }
                                                    disabled={inputDisabled}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="30 Km"
                                                    value="30 Km"
                                                    checked={distance === '30 Km' ? true : false}
                                                    name="group1"
                                                    type="radio"
                                                    onClick={(e: any) =>
                                                        setDistance(e.target.value)
                                                    }
                                                    disabled={inputDisabled}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="40 Km"
                                                    value="40 Km"
                                                    checked={distance === '40 Km' ? true : false}
                                                    name="group1"
                                                    type="radio"
                                                    onClick={(e: any) =>
                                                        setDistance(e.target.value)
                                                    }
                                                    disabled={inputDisabled}
                                                />
                                                <Form.Check
                                                    inline
                                                    label="50 Km"
                                                    value="50 Km"
                                                    checked={distance === '50 Km' ? true : false}
                                                    name="group1"
                                                    type="radio"
                                                    onClick={(event: any) =>
                                                        setDistance(event.target.value)
                                                    }
                                                    disabled={inputDisabled}
                                                />
                                            </Form>
                                            <div>
                                                {primaryAddress
                                                    ? primaryAddress.map((currentValue, index) => (
                                                          <b
                                                              key={index}
                                                          >{`${currentValue.House_Number}, ${currentValue.address1}, ${currentValue.address2}, ${currentValue.city}, ${currentValue.state}, ${currentValue.country}`}</b>
                                                      ))
                                                    : null}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Row>
                            {addressTitle === 'At My Address' && (
                                <Row>
                                    <Col lg={{ offset: 3 }}>
                                        <Button
                                            variant="outline-info"
                                            disabled={inputDisabled}
                                            onClick={() => {
                                                setAddressModal(true)
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
                                    setAddressModal(false)
                                    handleCallback()
                                }}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    )
}

export default PtProgramDetails
