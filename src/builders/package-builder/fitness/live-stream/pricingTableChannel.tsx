import React, { useState, useContext, useEffect } from "react";
import {
  Form,
  Table,
  FormControl,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import moment from "moment";

const PricingTable = (props: any) => {
  const durationOfOffering = props.formContext.durationOfOffering;
  const inputDisabled = props.readonly;
  const bookingDetails = JSON.parse(props.formContext.channelinstantBooking);
  const [show, setShow] = useState(props.value === "free" ? true : false);

  function handleReturnType(val: any) {
    if (typeof val === "string") {
      if (bookingDetails.instantBooking && JSON.parse(val).length === 4) {
        return handleDefaultPricing();
      } else {
        if (!bookingDetails.instantBooking && JSON.parse(val).length === 5) {
          return handleDefaultPricing();
        } else {
          return JSON.parse(val);
        }
      }
    } else {
      if (bookingDetails.instantBooking && val.length === 4) {
        return handleDefaultPricing();
      } else {
        if (!bookingDetails.instantBooking && val.length === 5) {
          return handleDefaultPricing();
        } else {
          return val;
        }
      }
    }
  }

  let day = 0;
      for(let i = 0 ; i <  durationOfOffering.length ; i++){
        if(durationOfOffering[i] === "1 day"){
          day = day > 1 ?  day : 1;
        } else if (durationOfOffering[i] === "30 days"){
          day= day > 30 ? day : 30;
        } else if (durationOfOffering[i] === "90 days"){
          day=  day > 90 ? day : 90;
        } else if (durationOfOffering[i] === "180 days"){
          day=  day > 180 ? day : 180;
        } else if (durationOfOffering[i] === "360 days"){
          day=  day >= 360 ? day : 360;
        }
      }

  function handleDefaultPricing() {
    if (bookingDetails.instantBooking) {
      if(day === 360){
        return [
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 1,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 30,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 90,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 180,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 360,
            sapienPricing: null,
            classes: null,
          },
        ]
      } else if (day === 180){
        return [
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 1,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 30,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 90,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 180,
            sapienPricing: null,
            classes: null,
          }
        ];
      } else if (day === 90){
        return [
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 1,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 30,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 90,
            sapienPricing: null,
            classes: null,
          }
        ];
      } else if (day === 30){
        return [
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 1,
            sapienPricing: null,
            classes: null,
          },
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 30,
            sapienPricing: null,
            classes: null,
          }
        ];
      } else {
        return [
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: 1,
            sapienPricing: null,
            classes: null,
          }
        ]

      }
    } else {
      return [
        {
          mrp: null,
          suggestedPrice: null,
          voucher: 0,
          duration: 30,
          sapienPricing: null,
        },
        {
          mrp: null,
          suggestedPrice: null,
          voucher: 0,
          duration: 90,
          sapienPricing: null,
        },
        {
          mrp: null,
          suggestedPrice: null,
          voucher: 0,
          duration: 180,
          sapienPricing: null,
        },
        {
          mrp: null,
          suggestedPrice: null,
          voucher: 0,
          duration: 360,
          sapienPricing: null,
        },
      ];
    }
  }

  const auth = useContext(AuthContext);
  const [vouchers, setVouchers] = useState<any>([]);
  const [pricing, setPricing] = useState<any>(
    props.value !== undefined && props.value !== "free"
      ? handleReturnType(props.value)
      : handleDefaultPricing()
  );

  useEffect(() => {
    if (bookingDetails.freeDemo) {
      const values = [...pricing];
      values[0].mrp = "free";
      setPricing(values);
    }
  }, [bookingDetails.freeDemo]);

  const GET_VOUCHERS = gql`
    query fetchVouchers(
      $expiry: DateTime!
      $id: ID!
      $start: DateTime!
      $status: String!
    ) {
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
    },
  });
  React.useEffect(() => {
    getVouchers({
      variables: {
        expiry: moment().toISOString(),
        id: auth.userid,
        start: moment().toISOString(),
        status: "Active",
      },
    });
  }, []);

  const SUGGESTED_PRICING = gql`
    query fetchSapienPricing($id: ID!) {
      suggestedPricings(
        filters: {
          fitness_package_type: { type: { eq: "Live Stream Channel" } }
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
      sapienPricings(
        filters: {
          fitness_package_type: { type: { eq: "Live Stream Channel" } }
        }
      ) {
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
    useQuery(SUGGESTED_PRICING, {
      variables: { id: auth.userid },
      onCompleted: (data) => {
        loadData(data);
      },
    });
  }

  function loadData(data) {
    const flattenData = flattenObj({ ...data });
    const newValue = [...pricing];

    newValue.forEach((item) => {
      if (item.voucher !== 0 && item.price !== null) {
        item.suggestedPrice = parseInt(
          ((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2)
        );
      } else {
        if (item.duration === 1) {
          if (bookingDetails.freeDemo) {
            item.suggestedPrice = "free";
          } else {
            item.suggestedPrice = flattenData.suggestedPricings[0]?.mrp;
          }
        } else {
          item.suggestedPrice =
            flattenData.suggestedPricings[0]?.mrp * item.duration;
        }
      }
      item.sapienPricing = flattenData.sapienPricings[0]?.mrp * item.duration;
    });
    setPricing(newValue);
  }

  function handlePricingUpdate(value: any, id: any) {
    const newPricing = [...pricing];
    newPricing[id].mrp = value;
    setPricing(newPricing);
  }

  function handleValidation() {
    const values = [...pricing];
    let res = false;
    // eslint-disable-next-line
    values.map((item: any) => {
      if (item.mrp !== null && item.mrp >= parseInt(item.sapienPricing)) {
        res = true;
      }
    });
    return res;
  }

  useEffect(() => {
    if (show) {
      props.onChange("free");
    } else if (handleValidation()) {
      props.onChange(JSON.stringify(pricing));
    } else {
      props.onChange(undefined);
    }
  }, [pricing, show]);

  function handleUpdatePricing(id: any, value: any) {
    if (parseInt(value) !== 0) {
      const newValue = [...pricing];
      newValue[id].voucher = parseInt(value);
      newValue[id].suggestedPrice = parseInt(
        ((newValue[id].sapienPricing * 100) / (100 - value)).toFixed(0)
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
          </div>
          <Table responsive>
            <thead>
              <tr className="text-center">
                <th></th>
                {bookingDetails.instantBooking && <th>One Day</th>}
                {bookingDetails.instantBooking && <th>One Day</th>}
                {day >= 30 && <th>Monthly</th>}
                {day >= 90 && <th>Quaterly</th>}
                {day >= 180 && <th>Half Yearly</th>}
                
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td>
                  <b>Vouchers</b>
                </td>
                {pricing.map((item, index: number) => {
                  return (
                    <td key={index}>
                      <Form.Control
                        as="select"
                        disabled={inputDisabled}
                        value={item.voucher}
                        onChange={(e) =>
                          handleUpdatePricing(index, e.target.value)
                        }
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
                  );
                })}
              </tr>
              <tr className="text-center">
                <td>
                  <b>Total days</b>
                </td>
                {pricing.map((item, index: number) => {
                  return <td key={index}>{item.duration} days</td>;
                })}
              </tr>
              <tr className="text-center">
                <td>
                  <b>Suggested</b>
                </td>
                {pricing.map((item, index: number) => {
                  return (
                    <td key={index}>
                      {isNaN(item.suggestedPrice)
                        ? "Base Price Not Set"
                        : `₹ ${item.suggestedPrice}`}
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="text-center">
                  <b>Set MRP</b>
                </td>
                {pricing.map((item, index: number) => {
                  return (
                    <td key={index}>
                      <InputGroup style={{ minWidth: "200px" }}>
                        <InputGroup.Prepend>
                          <InputGroup.Text id="basic-addon1">
                            {"\u20B9"}
                          </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                          className={`${
                            pricing[index]?.mrp <
                              pricing[index]?.sapienPricing &&
                            pricing[index]?.mrp !== null
                              ? "is-invalid"
                              : pricing[index]?.mrp >=
                                pricing[index]?.sapienPricing
                              ? "is-valid"
                              : ""
                          }`}
                          aria-label="Default"
                          type="number"
                          disabled={
                            (item.duration === 1 && bookingDetails.freeDemo) ||
                            inputDisabled
                              ? true
                              : false
                          }
                          min={0}
                          aria-describedby="inputGroup-sizing-default"
                          value={pricing[index]?.mrp}
                          onChange={(e) => {
                            handlePricingUpdate(e.target.value, index);
                          }}
                        />
                      </InputGroup>
                      {pricing[index]?.mrp < pricing[index]?.sapienPricing &&
                        pricing[index]?.mrp !== null && (
                          <span style={{ fontSize: "12px", color: "red" }}>
                            cannot be less than ₹{" "}
                            {pricing[index]?.sapienPricing}
                          </span>
                        )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default PricingTable;
