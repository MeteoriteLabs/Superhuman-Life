import React, { useState, useContext, useEffect } from "react";
import { Form, Table, FormControl, InputGroup } from "react-bootstrap";
import { gql, useQuery, useLazyQuery } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import moment from "moment";

const PricingTable = (props) => {
     console.log(props,props.formContext.programDetails, props.formContext.groupinstantbooking);
  const inputDisabled = props.readonly;
  const classDetails = JSON.parse(props.formContext.programDetails);
  const bookingDetails = JSON.parse(props.formContext.groupinstantbooking);
  const classMode =
    classDetails.mode === "0"
      ? "Online"
      : classDetails.mode === "1"
      ? "Offline"
      : "Hybrid";
  const onlineClasses = classDetails.online;
  const offlineClasses = classDetails.offline;

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

  function handleDefaultPricing() {
    if (bookingDetails.instantBooking) {
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
      ];
    } else {
      return [
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
    if (classMode === "Online") {
      const values = [...pricing];
      values.forEach((val, index) => {
        if (val.duration === 1) {
          val.classes = 1;
        } else {
          val.classes = onlineClasses * (val.duration / 30);
        }
      });
      setPricing(values);
    }
    if (classMode === "Offline") {
      const values = [...pricing];
      values.forEach((val, index) => {
        if (val.duration === 1) {
          val.classes = 1;
        } else {
          val.classes = offlineClasses * (val.duration / 30);
        }
      });
      setPricing(values);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    pricing.map((item, index) => {
      if (item.mrp === 0 || item.mrp === "") {
        const values = [...pricing];
        values[index].mrp = null;
        setPricing(values);
      }
    });
  }, [pricing]);

  const SUGGESTED_PRICING = gql`
    query fetchSapienPricing($id: ID!) {
      suggestedPricings(
        filters: {
          fitness_package_type: { type: { eq: "Group Class" } }
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
        filters: { fitness_package_type: { type: { eq: "Group Class" } } }
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
    if (classMode === "Online") {
      flattenData.suggestedPricings = flattenData.suggestedPricings.filter(
        (item) => item.Mode === classMode
      );
      flattenData.sapienPricings = flattenData.sapienPricings.filter(
        (item) => item.mode === classMode
      );
      newValue.forEach((item, index) => {
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
              flattenData.suggestedPricings[0]?.mrp *
              onlineClasses *
              (item.duration / 30);
          }
        }
        if (item.duration === 1) {
          item.sapienPricing = flattenData.sapienPricings[0]?.mrp;
        } else {
          item.sapienPricing =
            flattenData.sapienPricings[0]?.mrp *
            onlineClasses *
            (item.duration / 30);
        }
      });
    } else if (classMode === "Offline") {
      flattenData.suggestedPricings = flattenData.suggestedPricings.filter(
        (item) => item.Mode === classMode
      );
      flattenData.sapienPricings = flattenData.sapienPricings.filter(
        (item) => item.mode === classMode
      );
      newValue.forEach((item, index) => {
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
              flattenData.suggestedPricings[0]?.mrp *
              offlineClasses *
              (item.duration / 30);
          }
        }
        if (item.duration === 1) {
          item.sapienPricing = flattenData.sapienPricings[0]?.mrp;
        } else {
          item.sapienPricing =
            flattenData.sapienPricings[0]?.mrp *
            offlineClasses *
            (item.duration / 30);
        }
      });
    } else if (classMode === "Hybrid") {
      newValue.forEach((item, index) => {
        if (item.voucher !== 0 && item.price !== null) {
          item.suggestedPrice = parseInt(
            ((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2)
          );
        } else {
          if (item.duration === 1) {
            if (bookingDetails.freeDemo) {
              item.suggestedPrice = "free";
            } else {
              const onlinePrice = flattenData.suggestedPricings[0]?.mrp;
              const offlinePrice = flattenData.suggestedPricings[1]?.mrp;
              item.suggestedPrice = onlinePrice + offlinePrice;
            }
          } else {
            const onlinePrice =
              flattenData.suggestedPricings[0]?.mrp *
              onlineClasses *
              (item.duration / 30);
            const offlinePrice =
              flattenData.suggestedPricings[1]?.mrp *
              offlineClasses *
              (item.duration / 30);
            item.suggestedPrice = onlinePrice + offlinePrice;
          }
        }
        if (item.duration === 1) {
          const onlinePrice = flattenData.sapienPricings[0]?.mrp;
          const offlinePrice = flattenData.sapienPricings[1]?.mrp;
          item.sapienPricing = onlinePrice + offlinePrice;
        } else {
          const onlinePrice =
            flattenData.sapienPricings[0]?.mrp *
            onlineClasses *
            (item.duration / 30);
          const offlinePrice =
            flattenData.sapienPricings[1]?.mrp *
            offlineClasses *
            (item.duration / 30);
          item.sapienPricing = onlinePrice + offlinePrice;
        }
      });
    }

    setPricing(newValue);
  }

  function handlePricingUpdate(value: any, id: any) {
    let newPricing = [...pricing];
    newPricing[id].mrp = value;
    setPricing(newPricing);
  }

  function handleValidation() {
    const values = [...pricing];
    var res: boolean = false;
    // eslint-disable-next-line
    values.map((item: any) => {
      if (item.mrp !== null && item.mrp >= parseInt(item.sapienPricing)) {
        res = true;
      }
    });
    return res;
  }

  useEffect(() => {
    if (handleValidation()) {
      props.onChange(JSON.stringify(pricing));
    } else {
      props.onChange(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pricing]);

  function handleUpdatePricing(id: any, value: any) {
    if (parseInt(value) !== 0) {
      let newValue = [...pricing];
      newValue[id].voucher = parseInt(value);
      newValue[id].suggestedPrice = parseInt(
        ((newValue[id].sapienPricing * 100) / (100 - value)).toFixed(0)
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
      {
        <div>
          <Table responsive>
            <thead>
              <tr className="text-center">
                <th></th>
                {bookingDetails.instantBooking && <th>One Day</th>}
                <th>Monthly</th>
                <th>Quaterly</th>
                <th>Half Yearly</th>
                <th>Yearly</th>
              </tr>
            </thead>
            <tbody>
              {(classMode === "Online" || classMode === "Hybrid") && (
                <tr className="text-center">
                  <td>
                    <img src="/assets/Group-Online.svg" alt="group-online" />
                  </td>
                  {pricing.map((item, index: number) => {
                    return (
                      <td key={index}>
                        {item.duration === 1
                          ? "1 Class"
                          : `${onlineClasses * (item.duration / 30)} Classes`}
                      </td>
                    );
                  })}
                </tr>
              )}
              {(classMode === "Offline" || classMode === "Hybrid") && (
                <tr className="text-center">
                  <td>
                    {" "}
                    <img src="/assets/Group-Offline.svg" alt="group-offline" />
                  </td>
                  {pricing.map((item, index: number) => {
                    return (
                      <td key={index}>
                        {item.duration === 1
                          ? "1 Class"
                          : `${offlineClasses * (item.duration / 30)} Classes`}
                      </td>
                    );
                  })}
                </tr>
              )}
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
                        ? item.suggestedPrice === "free"
                          ? "free"
                          : "Base Price Not Set"
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
      }
    </>
  );
};

export default PricingTable;
