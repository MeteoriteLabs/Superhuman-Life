import { useState, useContext, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Table,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import moment from "moment";

const PricingTable = (props) => {
  const inputDisabled = props.readonly;

  const auth = useContext(AuthContext);
  const [vouchers, setVouchers] = useState<any>([]);
  const [show, setShow] = useState(props.value === "free" ? true : false);
  const [pricing, setPricing] = useState<any>(
    props.value !== undefined && props.value !== "free"
      ? JSON.parse(props?.value)
      : [
          {
            mrp: null,
            suggestedPrice: null,
            voucher: 0,
            duration: JSON.parse(props.formContext.programDetails).online,
            sapienPricing: null,
          },
        ]
  );

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
  useEffect(() => {
    getVouchers({
      variables: {
        expiry: moment().toISOString(),
        id: auth.userid,
        start: moment().toISOString(),
        status: "Active",
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SUGGESTED_PRICING = gql`
    query fetchSapienPricing($id: ID!) {
      suggestedPricings(
        filters: {
          fitness_package_type: { type: { eq: "Classic Class" } }
          users_permissions_users: { id: { eq: $id } }
        }
      ) {
        data {
          id
          attributes {
            mrp
            Mode
            fitness_package_type {
              data {
                id
                attributes {
                  type
                }
              }
            }
          }
        }
      }
      sapienPricings(
        filters: { fitness_package_type: { type: { eq: "Classic Class" } } }
      ) {
        data {
          id
          attributes {
            mrp
            mode
            fitness_package_type {
              data {
                id
                attributes {
                  type
                }
              }
            }
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
    newValue.forEach((item, index) => {
      if (item.voucher !== 0 && item.mrp !== null) {
        item.suggestedPrice = parseInt(
          ((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2)
        );
      } else {
        item.suggestedPrice =
          flattenData.suggestedPricings[0]?.mrp * item.duration;
      }
      item.sapienPricing = flattenData.sapienPricings[0]?.mrp * item.duration;
    });
    setPricing(newValue);
  }

  useEffect(() => {
    if (show) {
      props.onChange("free");
    } else if (pricing[0].mrp !== null) {
      props.onChange(JSON.stringify(pricing));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricing, show]);

  function handlePricingUpdate(value: any, id: any) {
    let newPricing = [...pricing];
    newPricing[id].mrp = value;
    setPricing(newPricing);
  }

  function handleUpdatePricing(id: any, value: any) {
    if (parseInt(value) !== 1) {
      let newValue = [...pricing];
      newValue[id].voucher = parseInt(value);
      newValue[id].suggestedPrice = parseInt(
        ((newValue[id].sapienPricing * 100) / (100 - value)).toFixed(2)
      );
      setPricing(newValue);
    } else {
      let newValue = [...pricing];
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
                        <option key={index} value={voucher.discount_percentage}>
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
                <td>{pricing[0].duration} sessions</td>
              </tr>
              <tr className="text-center">
                <td>
                  <b>Suggested</b>
                </td>
                <td>
                  {isNaN(pricing[0].suggestedPrice)
                    ? "Base Price Not Set"
                    : `₹ ${pricing[0].suggestedPrice}`}
                </td>
              </tr>
              <tr>
                <td className="text-center">
                  <b>Set MRP</b>
                </td>
                <td>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">
                        {"\u20B9"}
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      className={`${
                        pricing[0]?.mrp < pricing[0]?.sapienPricing &&
                        pricing[0]?.mrp !== null
                          ? "is-invalid"
                          : pricing[0]?.mrp >= pricing[0]?.sapienPricing
                          ? "is-valid"
                          : ""
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
                      <span style={{ fontSize: "12px", color: "red" }}>
                        cannot be less than ₹ {pricing[0]?.sapienPricing}
                      </span>
                    )}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default PricingTable;
