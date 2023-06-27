import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Form, Table, FormControl, InputGroup } from 'react-bootstrap';
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';

const PricingTable: React.FC<{
    readonly: boolean;
    onChange: (args: string | null) => void;
    value: string;
    formContext: any;
}> = (props) => {
    const inputDisabled = props.readonly;
    const accomodationDetails = JSON.parse(props.formContext?.programDetails)?.accomodationDetails;
    const accomodationType = JSON.parse(props.formContext.programDetails).residential;
    const mode = JSON.parse(props.formContext.programDetails).mode;

    function calculateDuration(sd, ed) {
        const start = moment(sd);
        const end = moment(ed);
        const duration = end.diff(start, 'days');
        return duration;
    }

    const auth = useContext(AuthContext);
    const [vouchers, setVouchers] = useState<any>([]);
    const [show, setShow] = useState(props.value === 'free' ? true : false);
    const [pricing, setPricing] = useState<any>(
        props.value !== undefined && props.value !== 'free'
            ? JSON.parse(props.value)
            : [
                  {
                      mrp: null,
                      suggestedPrice: null,
                      voucher: 0,
                      duration: calculateDuration(
                          JSON.parse(props.formContext.dates).startDate,
                          JSON.parse(props.formContext.dates).endDate
                      ),
                      sapienPricing: null
                  }
              ]
    );

    useEffect(() => {
        const newDuration = calculateDuration(
            JSON.parse(props.formContext.dates).startDate,
            JSON.parse(props.formContext.dates).endDate
        );
        const newPricing = [...pricing];
        if (
            JSON.parse(props.formContext.dates).startDate ===
            JSON.parse(props.formContext.dates).endDate
        ) {
            newPricing[0].duration = 1;
        } else {
            newPricing[0].duration = newDuration;
        }
        setPricing(newPricing);
    }, []);

    const GET_VOUCHERS = gql`
        query fetchVouchers($expiry: DateTime!, $id: ID!, $start: DateTime!, $status: String!) {
            vouchers(
                filters: {
                    expiry_date: { gte: $expiry }
                    Start_date: { lte: $start }
                    Status: { eq: $status }
                    users_permissions_user: { id: { eq: $id } }
                }
            ) {
                data {
                    id
                    attributes {
                        voucher_name
                        discount_percentage
                        Status
                        Start_date
                        expiry_date
                    }
                }
            }
        }
    `;

    const [getVouchers] = useLazyQuery(GET_VOUCHERS, {
        onCompleted: (data) => {
            const flattenData = flattenObj({ ...data });
            setVouchers(flattenData.vouchers);
        }
    });
    React.useEffect(() => {
        getVouchers({
            variables: {
                expiry: moment().toISOString(),
                id: auth.userid,
                start: moment().toISOString(),
                status: 'Active'
            }
        });
    }, []);

    const SAPIEN_PRICING = gql`
        query fetchSapienPricing($id: ID!) {
            suggestedPricings(
                filters: {
                    fitness_package_type: { type: { eq: "Cohort" } }
                    users_permissions_users: { id: { eq: $id } }
                }
            ) {
                data {
                    id
                    attributes {
                        mrp
                    }
                }
            }
            sapienPricings(filters: { fitness_package_type: { type: { eq: "Cohort" } } }) {
                data {
                    id
                    attributes {
                        mrp
                    }
                }
            }
        }
    `;

    function FetchData() {
        useQuery(SAPIEN_PRICING, {
            variables: { id: auth.userid },
            onCompleted: (data) => {
                loadData(data);
            }
        });
    }

    function loadData(data) {
        const flattenData = flattenObj({ ...data });
        const newValue = [...pricing];
        newValue.forEach((item, index) => {
            if (item.voucher !== 0 && item.mrp !== null) {
                item.suggestedPrice = parseInt(
                    ((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2)
                );
            } else {
                item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp * item.duration;
            }
            item.sapienPricing = flattenData.sapienPricings[0]?.mrp * item.duration;
        });
        setPricing(newValue);
    }

    function handleValidation() {
        if (parseInt(pricing[0].mrp) < pricing[0].sapienPricing) {
            return false;
        }
        // here it means if the mode is not equal to residential in the previous step
    }

    if (show) {
        props.onChange('free');
    } else if (handleValidation()) {
        props.onChange(JSON.stringify(pricing));
    } else {
        props.onChange(null);
    }

    function handlePricingUpdate(value: any, id: any) {
        const newPricing = [...pricing];
        newPricing[id].mrp = value;
        setPricing(newPricing);
    }

    function handleAccomodationPriceUpdate(value: number, id: any, key: string) {
        const newPricing = [...pricing];
        newPricing[id][key] = value;
        setPricing(newPricing);
    }

    function handleUpdatePricing(id: any, value: any) {
        if (parseInt(value) !== 1) {
            const newValue = [...pricing];
            newValue[id].voucher = parseInt(value);
            newValue[id].suggestedPrice = parseInt(
                ((newValue[id].sapienPricing * 100) / (100 - value)).toFixed(2)
            );
            setPricing(newValue);
        } else {
            const newValue = [...pricing];
            newValue[id].voucher = parseInt(value);
            newValue[id].suggestedPrice = newValue[id].sapienPricing;
            setPricing(newValue);
        }
    }

    FetchData();

    return (
        <>
            <div>
                <Row>
                    <Col>
                        <h5>Type of payment</h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col lg={2}>
                                <b>Setup Pricing</b>
                            </Col>
                            <Col lg={1}>
                                <Form>
                                    <Form.Check
                                        type="switch"
                                        id="custom-switch"
                                        defaultChecked={show}
                                        onClick={() => setShow(!show)}
                                        disabled={inputDisabled}
                                    />
                                </Form>
                            </Col>
                            <Col lg={3}>
                                <b>Free (support Me Button)</b>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <br />
            <br />
            {!show && (
                <div>
                    <div className="d-flex justify-content-between p-2">
                        <div>
                            <h4>Subscription Plan</h4>
                        </div>
                        <div></div>
                    </div>
                    <Table responsive>
                        <thead>
                            <tr className="text-center">
                                <th>Details</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td>
                                    <b>Vouchers</b>
                                </td>
                                <td>
                                    <Form.Control
                                        as="select"
                                        disabled={inputDisabled}
                                        value={pricing[0].voucher}
                                        onChange={(e) => handleUpdatePricing(0, e.target.value)}
                                    >
                                        <option value={0}>Choose voucher</option>
                                        {vouchers.map((voucher, index: number) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={voucher.discount_percentage}
                                                >
                                                    {voucher.voucher_name}
                                                </option>
                                            );
                                        })}
                                    </Form.Control>
                                </td>
                            </tr>
                            <tr className="text-center">
                                <td>
                                    <b>Total days</b>
                                </td>
                                <td>1 day</td>
                            </tr>

                            <tr>
                                <td className="text-center">
                                    <b>Cohort Base Price</b>
                                </td>
                                <td>
                                    <InputGroup style={{ minWidth: '200px' }}>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text id="basic-addon1">
                                                {'\u20B9'}
                                            </InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            className={`${
                                                pricing[0]?.mrp < pricing[0]?.sapienPricing &&
                                                pricing[0]?.mrp !== null
                                                    ? 'is-invalid'
                                                    : pricing[0]?.mrp >= pricing[0]?.sapienPricing
                                                    ? 'is-valid'
                                                    : ''
                                            }`}
                                            aria-label="Default"
                                            type="number"
                                            min={0}
                                            disabled={inputDisabled}
                                            aria-describedby="inputGroup-sizing-default"
                                            value={pricing[0]?.mrp}
                                            onChange={(e) => {
                                                handlePricingUpdate(e.target.value, 0);
                                            }}
                                        />
                                    </InputGroup>
                                    {pricing[0]?.mrp < pricing[0]?.sapienPricing &&
                                        pricing[0]?.mrp !== null && (
                                            <span style={{ fontSize: '12px', color: 'red' }}>
                                                cannot be less than ₹ {pricing[0]?.sapienPricing}
                                            </span>
                                        )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                    {pricing[0].mrp !== null && pricing[0].mrp !== '' && (
                        <>
                            <hr className="my-0" />
                            <div className="text-center">
                                <label className="text-danger">
                                    <b>MRP</b>
                                </label>
                            </div>
                            <hr className="my-0" />
                            {/* {accomodationType === '1' && (
                <Row className="text-center">
                  <Col>
                    <label>
                      <b>
                        Base Price + <span className="text-danger">Food</span>
                      </b>
                    </label>
                    <p>₹ {parseInt(pricing[0].mrp)}</p>
                  </Col>
                  {accomodationDetails.private && (
                    <Col>
                      <label>
                        <b>
                          Private Room + Base Price + <span className="text-danger">Food</span>
                        </b>
                      </label>
                      <p>
                        ₹{' '}
                        {parseInt(pricing[0].mrp) +
                          (isNaN(pricing[0].privateRoomPrice) ? 0 : pricing[0].privateRoomPrice) +
                          (isNaN(pricing[0].foodPrice) ? 0 : pricing[0].foodPrice)}
                      </p>
                    </Col>
                  )}
                  {accomodationDetails.sharing && accomodationDetails.twoSharingRooms !== null && (
                    <>
                      <Col>
                        <label>
                          <b>
                            Base Price + Dual Occupancy + <span className="text-danger">Food</span>
                          </b>
                        </label>
                        <p>
                          ₹{' '}
                          {parseInt(pricing[0].mrp) +
                            (isNaN(pricing[0].twoSharingPrice) ? 0 : pricing[0].twoSharingPrice) +
                            (isNaN(pricing[0].foodPrice) ? 0 : pricing[0].foodPrice)}
                        </p>
                      </Col>
                      {accomodationDetails.threeSharingRooms !== null && (
                        <Col>
                          <label>
                            <b>
                              {' '}
                              Base Price + Triple Occupancy +{' '}
                              <span className="text-danger">Food</span>
                            </b>
                          </label>
                          <p>
                            ₹{' '}
                            {parseInt(pricing[0].mrp) +
                              (isNaN(pricing[0].threeSharingPrice)
                                ? 0
                                : pricing[0].threeSharingPrice) +
                              (isNaN(pricing[0].foodPrice) ? 0 : pricing[0].foodPrice)}
                          </p>
                        </Col>
                      )}
                    </>
                  )}
                </Row>
              )} */}
                            {/* {accomodationType !== '1' && (
                <Row className="text-center">
                  <Col>
                    <label>
                      <b>Base Price</b>
                    </label>
                    <p>₹ {parseInt(pricing[0].mrp)}</p>
                  </Col>
                  {accomodationDetails.private && (
                    <Col>
                      <label>
                        <b>Base Price + Private Room </b>
                      </label>
                      <p>
                        ₹{' '}
                        {parseInt(pricing[0].mrp) +
                          (isNaN(pricing[0].privateRoomPrice) ? 0 : pricing[0].privateRoomPrice)}
                      </p>
                    </Col>
                  )}
                  {accomodationDetails.sharing && accomodationDetails.twoSharingRooms !== null && (
                    <>
                      <Col>
                        <label>
                          <b>Base Price + Dual Occupancy</b>
                        </label>
                        <p>
                          ₹{' '}
                          {parseInt(pricing[0].mrp) +
                            (isNaN(pricing[0].twoSharingPrice) ? 0 : pricing[0].twoSharingPrice)}
                        </p>
                      </Col>
                      {accomodationDetails.threeSharingRooms !== null && (
                        <Col>
                          <label>
                            <b>+ Base Price + Triple Occupancy</b>
                          </label>
                          <p>
                            ₹{' '}
                            {parseInt(pricing[0].mrp) +
                              (isNaN(pricing[0].threeSharingPrice)
                                ? 0
                                : pricing[0].threeSharingPrice)}
                          </p>
                        </Col>
                      )}{' '}
                    </>
                  )}
                </Row>
              )} */}
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default PricingTable;
