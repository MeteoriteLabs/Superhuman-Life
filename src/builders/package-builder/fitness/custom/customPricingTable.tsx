import React, { useState, useContext, useEffect } from 'react';
import { Form, Table, FormControl, InputGroup } from 'react-bootstrap';
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

    function handleReturnType(val: any) {
        if (typeof val === 'string') {
            return JSON.parse(val);
        } else {
            return val;
        }
    }
    const classDetails = JSON.parse(props.formContext.programDetails);

    const classMode =
        classDetails.mode === '0' ? 'Online' : classDetails.mode === '1' ? 'Offline' : 'Hybrid';
    const ptOnlineClasses = classDetails.ptOnline;
    const ptOfflineClasses = classDetails.ptOffline;
    const groupOnlineClasses = classDetails.groupOnline;
    const groupOfflineClasses = classDetails.groupOffline;
    const recorded = classDetails.recorded;

    const auth = useContext(AuthContext);
    const [vouchers, setVouchers] = useState<any>([]);
    const [pricing, setPricing] = useState<any>(
        props.value && props.value !== 'free'
            ? handleReturnType(props.value)
            : [
                  {
                      mrp: null,
                      suggestedPrice: null,
                      voucher: 0,
                      duration: 30,
                      sapienPricing: null
                  },
                  {
                      mrp: null,
                      suggestedPrice: null,
                      voucher: 0,
                      duration: 90,
                      sapienPricing: null
                  },
                  {
                      mrp: null,
                      suggestedPrice: null,
                      voucher: 0,
                      duration: 180,
                      sapienPricing: null
                  },
                  {
                      mrp: null,
                      suggestedPrice: null,
                      voucher: 0,
                      duration: 360,
                      sapienPricing: null
                  }
              ]
    );

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

    useEffect(() => {
        // eslint-disable-next-line
        pricing.map((item, index) => {
            if (item.mrp === 0 || item.mrp === '') {
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
                    fitness_package_type: {
                        type: { in: ["One-On-One", "Classic Class", "Group Class"] }
                    }
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
                filters: {
                    fitness_package_type: {
                        type: { in: ["One-On-One", "Classic Class", "Group Class"] }
                    }
                }
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
            }
        });
    }

    function handleSuggestedPricingCalculation(
        mode: string,
        item: any,
        suggestedPricings: any,
        duration: number
    ) {
        let ptOnlinePrice: number,
            ptOfflinePrice: number,
            groupOnlinePrice: number,
            groupOfflinePrice: number,
            classicPrice: number;
        if (mode === 'Online') {
            ptOnlinePrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'One-On-One'
                    )
                ]?.mrp *
                ptOnlineClasses *
                (duration / 30);
            groupOnlinePrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Group Class'
                    )
                ]?.mrp *
                groupOnlineClasses *
                (duration / 30);
            classicPrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Classic Class'
                    )
                ]?.mrp *
                recorded *
                (duration / 30);
            return ptOnlinePrice + groupOnlinePrice + classicPrice;
        } else if (mode === 'Offline') {
            ptOfflinePrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'One-On-One'
                    )
                ]?.mrp *
                ptOfflineClasses *
                (duration / 30);
            groupOfflinePrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Group Class'
                    )
                ]?.mrp *
                groupOfflineClasses *
                (duration / 30);
            classicPrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Classic Class'
                    )
                ]?.mrp *
                recorded *
                (duration / 30);
            return ptOfflinePrice + groupOfflinePrice + classicPrice;
        } else if (mode === 'Hybrid') {
            ptOnlinePrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) =>
                            x.fitness_package_type.type === 'One-On-One' && x.Mode === 'Online'
                    )
                ]?.mrp *
                ptOnlineClasses *
                (duration / 30);
            groupOnlinePrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) =>
                            x.fitness_package_type.type === 'Group Class' && x.Mode === 'Online'
                    )
                ]?.mrp *
                groupOnlineClasses *
                (duration / 30);
            ptOfflinePrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) =>
                            x.fitness_package_type.type === 'One-On-One' && x.Mode === 'Offline'
                    )
                ]?.mrp *
                ptOfflineClasses *
                (duration / 30);
            groupOfflinePrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) =>
                            x.fitness_package_type.type === 'Group Class' && x.Mode === 'Offline'
                    )
                ]?.mrp *
                groupOfflineClasses *
                (duration / 30);
            classicPrice =
                suggestedPricings[
                    suggestedPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Classic Class'
                    )
                ]?.mrp *
                recorded *
                (duration / 30);
            return (
                ptOnlinePrice + groupOnlinePrice + ptOfflinePrice + groupOfflinePrice + classicPrice
            );
        }
    }

    function handleSapienPricingCalculation(
        mode: string,
        item: any,
        sapienPricings: any,
        duration: number
    ) {
        let ptOnlinePrice: number,
            ptOfflinePrice: number,
            groupOnlinePrice: number,
            groupOfflinePrice: number,
            classicPrice: number;
        if (mode === 'Online') {
            ptOnlinePrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'One-On-One'
                    )
                ].mrp *
                ptOnlineClasses *
                (duration / 30);
            const groupOnlinePrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Group Class'
                    )
                ].mrp *
                groupOnlineClasses *
                (duration / 30);
            const classicPrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Classic Class'
                    )
                ].mrp *
                recorded *
                (duration / 30);
            return ptOnlinePrice + groupOnlinePrice + classicPrice;
        } else if (mode === 'Offline') {
            ptOfflinePrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'One-On-One'
                    )
                ].mrp *
                ptOfflineClasses *
                (duration / 30);
            groupOfflinePrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Group Class'
                    )
                ].mrp *
                groupOfflineClasses *
                (duration / 30);
            classicPrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Classic Class'
                    )
                ].mrp *
                recorded *
                (duration / 30);
            return ptOfflinePrice + groupOfflinePrice + classicPrice;
        } else if (mode === 'Hybrid') {
            ptOnlinePrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) =>
                            x.fitness_package_type.type === 'One-On-One' && x.mode === 'Online'
                    )
                ].mrp *
                ptOnlineClasses *
                (duration / 30);
            groupOnlinePrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) =>
                            x.fitness_package_type.type === 'Group Class' && x.mode === 'Online'
                    )
                ].mrp *
                groupOnlineClasses *
                (duration / 30);
            ptOfflinePrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) =>
                            x.fitness_package_type.type === 'One-On-One' && x.mode === 'Offline'
                    )
                ].mrp *
                ptOfflineClasses *
                (duration / 30);
            groupOfflinePrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) =>
                            x.fitness_package_type.type === 'Group Class' && x.mode === 'Offline'
                    )
                ].mrp *
                groupOfflineClasses *
                (duration / 30);
            classicPrice =
                sapienPricings[
                    sapienPricings.findIndex(
                        (x: any) => x.fitness_package_type.type === 'Classic Class'
                    )
                ].mrp *
                recorded *
                (duration / 30);
            return (
                ptOnlinePrice + groupOnlinePrice + ptOfflinePrice + groupOfflinePrice + classicPrice
            );
        }
    }

    function loadData(data) {
        const flattenData = flattenObj({ ...data });

        const newValue = [...pricing];
        if (classMode === 'Online') {
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
                    // flattenData.suggestedPricings[0]?.mrp * onlineClasses * (item.duration / 30);
                    item.suggestedPrice = handleSuggestedPricingCalculation(
                        classMode,
                        item,
                        flattenData.suggestedPricings,
                        item.duration
                    );
                }
                item.sapienPricing = handleSapienPricingCalculation(
                    classMode,
                    item,
                    flattenData.sapienPricings,
                    item.duration
                );
            });
        } else if (classMode === 'Offline') {
            flattenData.suggestedPricings = flattenData.suggestedPricings.filter(
                (item) =>
                    item.Mode === classMode || item.fitness_package_type.type === 'Classic Class'
            );
            flattenData.sapienPricings = flattenData.sapienPricings.filter(
                (item) =>
                    item.mode === classMode || item.fitness_package_type.type === 'Classic Class'
            );
            newValue.forEach((item, index) => {
                if (item.voucher !== 0 && item.price !== null) {
                    item.suggestedPrice = parseInt(
                        ((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2)
                    );
                } else {
                    item.suggestedPrice = handleSuggestedPricingCalculation(
                        classMode,
                        item,
                        flattenData.suggestedPricings,
                        item.duration
                    );
                }
                item.sapienPricing = handleSapienPricingCalculation(
                    classMode,
                    item,
                    flattenData.sapienPricings,
                    item.duration
                );
            });
        } else if (classMode === 'Hybrid') {
            newValue.forEach((item, index) => {
                if (item.voucher !== 0 && item.price !== null) {
                    item.suggestedPrice = parseInt(
                        ((item.sapienPricing * 100) / (100 - item.voucher)).toFixed(2)
                    );
                } else {
                    item.suggestedPrice = handleSuggestedPricingCalculation(
                        classMode,
                        item,
                        flattenData.suggestedPricings,
                        item.duration
                    );
                }
                item.sapienPricing = handleSapienPricingCalculation(
                    classMode,
                    item,
                    flattenData.sapienPricings,
                    item.duration
                );
            });
        }

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
        if (handleValidation()) {
            props.onChange(JSON.stringify(pricing));
        } else {
            props.onChange(null);
        }
    }, [pricing]);

    function handleUpdatePricing(id: any, value: any) {
        if (parseInt(value) !== 0) {
            const newValue = [...pricing];
            newValue[id].voucher = parseInt(value);
            // ((arraySapient[i] * 100) / (100 - 10)).toFixed(2)
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
            {
                <div>
                    <div className="d-flex justify-content-end p-2">
                        {/* <Button disabled={inputDisabled} variant='outline-info' onClick={() => {window.location.href = '/finance'}}>Add suggest pricing</Button> */}
                    </div>
                    <Table responsive>
                        <thead>
                            <tr className="text-center">
                                <th></th>
                                <th>Monthly</th>
                                <th>Quaterly</th>
                                <th>Half Yearly</th>
                                <th>Yearly</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(classMode === 'Online' || classMode === 'Hybrid') && (
                                <tr className="text-center">
                                    <td>
                                        <img
                                            src="/assets/personal-training-online.svg"
                                            alt="personal-training-online"
                                        />
                                    </td>
                                    {pricing.map((item, index: number) => {
                                        return (
                                            <td key={index}>
                                                {ptOnlineClasses * (item.duration / 30)} Classes
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                            {(classMode === 'Offline' || classMode === 'Hybrid') && (
                                <tr className="text-center">
                                    <td>
                                        <img
                                            src="/assets/personal-training-offline.svg"
                                            alt="personal-training-online"
                                        />
                                    </td>
                                    {pricing.map((item, index: number) => {
                                        return (
                                            <td key={index}>
                                                {ptOfflineClasses * (item.duration / 30)} Classes
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                            {(classMode === 'Online' || classMode === 'Hybrid') && (
                                <tr className="text-center">
                                    <td>
                                        <img
                                            src="/assets/Group-Online.svg"
                                            alt="personal-training-online"
                                        />
                                    </td>
                                    {pricing.map((item, index: number) => {
                                        return (
                                            <td key={index}>
                                                {groupOnlineClasses * (item.duration / 30)} Classes
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                            {(classMode === 'Offline' || classMode === 'Hybrid') && (
                                <tr className="text-center">
                                    <td>
                                        <img
                                            src="/assets/Group-Offline.svg"
                                            alt="personal-training-online"
                                        />
                                    </td>
                                    {pricing.map((item, index: number) => {
                                        return (
                                            <td key={index}>
                                                {groupOfflineClasses * (item.duration / 30)} Classes
                                            </td>
                                        );
                                    })}
                                </tr>
                            )}
                            <tr className="text-center">
                                <td>
                                    {' '}
                                    <img
                                        src="/assets/classic.svg"
                                        alt="personal-training-offline"
                                    />
                                </td>
                                {pricing.map((item, index: number) => {
                                    return (
                                        <td key={index}>
                                            {recorded * (item.duration / 30)} Classes
                                        </td>
                                    );
                                })}
                            </tr>
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
                                                {vouchers.map((voucher, index) => {
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
                            {/* <tr className="text-center">
                <td>
                  <b>Suggested</b>
                </td>
                {pricing.map((item, index: number) => {
                  return (
                    <td key={index}>
                      {isNaN(item.suggestedPrice)
                        ? 'Base Price Not Set'
                        : `₹ ${item.suggestedPrice}`}
                    </td>
                  );
                })}
              </tr> */}
                            <tr>
                                <td className="text-center">
                                    <b>Set MRP</b>
                                </td>
                                {pricing.map((item, index: number) => {
                                    return (
                                        <td key={index}>
                                            <InputGroup
                                                style={{ minWidth: '200px' }}
                                                className="mb-3"
                                            >
                                                <InputGroup.Prepend>
                                                    <InputGroup.Text id="basic-addon1">
                                                        {'\u20B9'}
                                                    </InputGroup.Text>
                                                </InputGroup.Prepend>
                                                <FormControl
                                                    className={`${
                                                        pricing[index]?.mrp <
                                                            pricing[index]?.sapienPricing &&
                                                        pricing[index]?.mrp !== null
                                                            ? 'is-invalid'
                                                            : pricing[index]?.mrp >=
                                                              pricing[index]?.sapienPricing
                                                            ? 'is-valid'
                                                            : ''
                                                    }`}
                                                    aria-label="Default"
                                                    type="number"
                                                    min={0}
                                                    aria-describedby="inputGroup-sizing-default"
                                                    value={pricing[index]?.mrp}
                                                    disabled={inputDisabled}
                                                    onChange={(e) => {
                                                        handlePricingUpdate(e.target.value, index);
                                                    }}
                                                />
                                            </InputGroup>
                                            {pricing[index]?.mrp < pricing[index]?.sapienPricing &&
                                                pricing[index]?.mrp !== null && (
                                                    <span
                                                        style={{ fontSize: '12px', color: 'red' }}
                                                    >
                                                        cannot be less than ₹{' '}
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
