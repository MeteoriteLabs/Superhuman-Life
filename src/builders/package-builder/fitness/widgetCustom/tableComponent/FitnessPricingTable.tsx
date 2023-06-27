import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import './fitnessPricing.css';
import Voucher from './Voucher';
import ClassesSessions from './ClassesSessions';
import SuggestedPricing from './SuggestedPricing';
import MRP from './MRP';
import * as _ from 'lodash';
import CustomPricingTable from './PricingTable/CustomPricingTable';
import RecordedPricingTable from './PricingTable/RecordedPricingTable';
import PTGroupPricingTable from './PricingTable/PTGroupPricingTable';
import { useQuery } from '@apollo/client';
import { GET_SAPIENT_PRICES } from '../../graphQL/queries';
import { flattenObj } from '../../../../../components/utils/responseFlatten';

type FitnessPricing = {
    duration: number;
    voucher: string;
    mrp: number | string;
};

interface UserData {
    ptonline: any;
    ptoffline: any;
    mode: any;
    grouponline: any;
    groupoffline: any;
    recordedclasses: any;
    duration: any;
    fitness_package_type: any;
    fitnesspackagepricing: any;
}
const FitnessPricingTable: React.FC<{
    userData: UserData;
    setUserData: any;
    actionType: any;
    type: any;
    formData: any;
    packageTypeName: any;
    pricingDetailRef: any;
    widgetProps: any;
    auth: any;
}> = (props) => {
    const [fitnesspackagepricing, setFitnesspackagepricing] = useState<FitnessPricing[]>([
        {
            duration: 30,
            voucher: '',
            mrp: 0
        },
        {
            duration: 90,
            voucher: '',
            mrp: 0
        },
        {
            duration: 180,
            voucher: '',
            mrp: 0
        },
        {
            duration: 360,
            voucher: '',
            mrp: 0
        }
    ]);

    const [minPrice, setMinPrice] = useState<number[]>([]);
    const [arrSapientPrice, setArraySapientPrice] = useState<any[]>([]);

    const [onlineClassesType, setOnlineClassesType] = useState<number>(0);
    const [offlineClassesType, setOffineClassesType] = useState<number>(0);
    const [index, setIndex] = useState<number>(0);

    useQuery(GET_SAPIENT_PRICES, {
        onCompleted: (data) => fetchData(data)
    });

    const arrayDuration = fitnesspackagepricing?.map((fitness) => fitness.duration);

    const calculateSuggestPrice = (
        arrayData: { mode: 'Online' | 'Offline'; mrp: number }[],
        arrayClasses: number[]
    ) => {
        const mrp: number[] = [];

        // eslint-disable-next-line array-callback-return
        arrayData.map((item) => {
            if (item.mode === 'Online') {
                mrp.push(item.mrp * arrayClasses[0]);
            } else if (item.mode === 'Offline') {
                mrp.push(item.mrp * arrayClasses[1]);
            }
        });

        return mrp.reduce((acc, cur) => acc + cur);
    };

    const calculateArraySuggestPrice = (sapientPrice: number, arrayDuration: number[]) => {
        const arraySapient: number[] = [];
        arraySapient[0] = Number(sapientPrice);
        for (let i = 1; i < arrayDuration.length; i++) {
            if (i === 1) {
                sapientPrice = Number(sapientPrice) * 3;
            } else {
                sapientPrice = Number(sapientPrice) * 2;
            }
            arraySapient.push(Number(sapientPrice));
        }

        // get dicount vouchers from vouchers collection.
        const updatePrice = [...arraySapient];
        if (props.actionType === 'edit') {
            if (props.userData.fitnesspackagepricing) {
                const arrayVoucher = props.userData.fitnesspackagepricing.map(
                    (item) => item.voucher
                );
                for (let i = 0; i < updatePrice.length; i++) {
                    if (arrayVoucher[i] === '0%') {
                        updatePrice[i] = Number(arraySapient[i]);
                    } else if (arrayVoucher[i] === '10%') {
                        updatePrice[i] = Number(((arraySapient[i] * 100) / (100 - 10)).toFixed(2));
                    } else if (arrayVoucher[i] === '20%') {
                        updatePrice[i] = Number(((arraySapient[i] * 100) / (100 - 20)).toFixed(2));
                    }
                }
            }

            setMinPrice(updatePrice);
        } else {
            setMinPrice(arraySapient);
        }

        setArraySapientPrice(arraySapient);

        return arraySapient;
    };

    // PT
    const PTSuggestedPricing = (data: any) => {
        const arrayPTdata = data.sapienPricings.filter(
            (item: {
                fitness_package_type: {
                    type: 'One-On-One' | 'Group Class' | 'Classic Class';
                };
            }) => item.fitness_package_type.type === 'One-On-One'
        );
        const arrayPTClasses = [props.userData.ptonline, props.userData.ptoffline];
        const sapientPrice = calculateSuggestPrice(arrayPTdata, arrayPTClasses);

        calculateArraySuggestPrice(sapientPrice, arrayDuration);
    };

    const groupSuggestedPricing = (data: { sapienPricings: any[] }) => {
        const arrayGroupData = data.sapienPricings.filter(
            (item: {
                fitness_package_type: {
                    type: 'One-On-One' | 'Group Class' | 'Classic Class';
                };
            }) => item.fitness_package_type.type === 'Group Class'
        );
        const arrayGroupClasses = [props.userData.grouponline, props.userData.groupoffline];
        const sapientPrice = calculateSuggestPrice(arrayGroupData, arrayGroupClasses);

        calculateArraySuggestPrice(sapientPrice, arrayDuration);
    };

    const classicSuggestPricing = (data: { sapienPricings: any[] }) => {
        const arrayClassicData = data.sapienPricings.filter(
            (item: {
                fitness_package_type: {
                    type: 'One-On-One' | 'Group Class' | 'Classic Class';
                };
            }) => item.fitness_package_type.type === 'Classic Class'
        );
        const arrayClassic = [props.userData.recordedclasses];
        const sapientPrice = calculateSuggestPrice(arrayClassicData, arrayClassic);

        calculateArraySuggestPrice(sapientPrice, [props.userData.duration]);
    };

    //custom
    const customSuggestPrice = (data) => {
        const arrayCustomPrice: number[] = [];
        const arrayPTdata = data.sapienPricings.filter(
            (item: {
                fitness_package_type: {
                    type: 'One-On-One' | 'Group Class' | 'Classic Class';
                };
            }) => item.fitness_package_type.type === 'One-On-One'
        );
        const arrayGroupData = data.sapienPricings.filter(
            (item: {
                fitness_package_type: {
                    type: 'One-On-One' | 'Group Class' | 'Classic Class';
                };
            }) => item.fitness_package_type.type === 'Group Class'
        );
        const arrayClassicData = data.sapienPricings.filter(
            (item: {
                fitness_package_type: {
                    type: 'One-On-One' | 'Group Class' | 'Classic Class';
                };
            }) => item.fitness_package_type.type === 'Classic Class'
        );

        for (let i = 0; i < arrayPTdata.length; i++) {
            if (arrayPTdata[i].mode === 'Online') {
                arrayCustomPrice.push(arrayPTdata[i].mrp * props.userData.ptonline);
            } else {
                arrayCustomPrice.push(arrayPTdata[i].mrp * props.userData.ptoffline);
            }
        }

        for (let i = 0; i < arrayGroupData.length; i++) {
            if (arrayGroupData[i].mode === 'Online') {
                arrayCustomPrice.push(arrayGroupData[i].mrp * props.userData.grouponline);
            } else {
                arrayCustomPrice.push(arrayGroupData[i].mrp * props.userData.groupoffline);
            }
        }

        for (let i = 0; i < arrayClassicData.length; i++) {
            arrayCustomPrice.push(arrayClassicData[i].mrp * props.userData.recordedclasses);
        }

        const totalCustomPrice = arrayCustomPrice.reduce((acc, cur) => acc + cur);
        calculateArraySuggestPrice(totalCustomPrice, arrayDuration);
    };

    const fetchData = (data) => {
        const flattenedData = flattenObj({ ...data });

        if (props.userData.fitness_package_type === 'One-On-One') {
            PTSuggestedPricing(flattenedData);
        }
        //  group
        else if (props.userData.fitness_package_type === 'Group Class') {
            groupSuggestedPricing(flattenedData);
        }
        //record/ classic
        else if (props.userData.fitness_package_type === 'Classic Class') {
            classicSuggestPricing(flattenedData);
        }
        // custom
        else if (props.userData.fitness_package_type === 'Custom Fitness') {
            customSuggestPrice(flattenedData);
        }
    };

    useEffect(() => {
        if (props.pricingDetailRef) {
            props.pricingDetailRef.current = {
                getFitnessPackagePricing: () => fitnesspackagepricing
            };
        }
    }, [props.pricingDetailRef, fitnesspackagepricing]);

    useEffect(() => {
        let updatePricing: any = '';

        if (props.actionType === 'create') {
            if (props.userData.fitnesspackagepricing) {
                updatePricing = _.cloneDeep(props.userData.fitnesspackagepricing);
            } else {
                updatePricing = [...fitnesspackagepricing];
            }

            updatePricing[0].duration = props.userData.duration;
        } else if (props.actionType === 'view') {
            if (props.formData.fitnesspackagepricing) {
                updatePricing = props.formData.fitnesspackagepricing;
            }
        } else {
            if (props.userData.fitnesspackagepricing) {
                updatePricing = props.userData.fitnesspackagepricing;
            }
        }
        setFitnesspackagepricing(updatePricing);
    }, [props.userData, props.actionType, props.userData.duration, props.formData]);

    useEffect(() => {
        if (props.type === 'One-On-One') {
            setOnlineClassesType(props.userData.ptonline);
            setOffineClassesType(props.userData.ptoffline);
        } else if (props.type === 'Group Class') {
            setOnlineClassesType(props.userData.grouponline);
            setOffineClassesType(props.userData.groupoffline);
        }
    }, [
        props.userData.ptonline,
        props.userData.ptoffline,
        props.userData.groupoffline,
        props.userData.grouponline,
        props.type
    ]);

    if (props.userData.mode === 'Online' && props.userData.ptoffline > 0) {
        const ptoffline = 0;
        props.setUserData({ ...props.userData, ptoffline });
    } else if (props.userData.mode === 'Offline' && props.userData.ptonline > 0) {
        const ptonline = 0;
        props.setUserData({ ...props.userData, ptonline });
    }

    return (
        <>
            <Table className="text-center">
                <thead>
                    <tr>
                        <th>Details</th>
                        {props.type === 'Classic Class' ||
                        props.userData.mode === 'Online Workout' ||
                        props.userData.mode === 'Offline Workout' ? (
                            <th>{props.userData.duration} days</th>
                        ) : (
                            <>
                                <th>Monthly</th>
                                <th>Quaterly</th>
                                <th>Half Yearly</th>
                                <th>Yearly</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {props.type !== 'Custom Fitness' ? (
                        props.type === 'Classic Class' ? (
                            <RecordedPricingTable
                                recordedclasses={props.userData.recordedclasses}
                                packageTypeName={props.packageTypeName}
                                type={props.type}
                                mode={props.userData.mode}
                            />
                        ) : (
                            <PTGroupPricingTable
                                type={props.type}
                                mode={props.userData.mode}
                                onlineClassesType={onlineClassesType}
                                offlineClassesType={offlineClassesType}
                                packageTypeName={props.packageTypeName}
                            />
                        )
                    ) : (
                        <CustomPricingTable
                            ptonline={props.userData.ptonline}
                            ptoffline={props.userData.ptoffline}
                            grouponline={props.userData.grouponline}
                            groupoffline={props.userData.groupoffline}
                            recordedclasses={props.userData.recordedclasses}
                            packageTypeName={props.packageTypeName}
                            type={props.type}
                            mode={props.userData.mode}
                        />
                    )}

                    <tr>
                        <td></td>
                        <Voucher
                            type={props.type}
                            mode={props.userData.mode}
                            actionType={props.actionType}
                            minPrice={minPrice}
                            setMinPrice={setMinPrice}
                            fitnesspackagepricing={fitnesspackagepricing}
                            setFitnesspackagepricing={setFitnesspackagepricing}
                            arrSapientPrice={arrSapientPrice}
                            setIndex={setIndex}
                        />
                    </tr>
                    <tr>
                        <td className="font-weight-bold">Total Sessions</td>
                        <ClassesSessions
                            type={props.type}
                            mode={props.userData.mode}
                            ptonline={props.userData.ptonline}
                            ptoffline={props.userData.ptoffline}
                            grouponline={props.userData.grouponline}
                            groupoffline={props.userData.groupoffline}
                            recordedclasses={props.userData.recordedclasses}
                            classicClasses={props.userData.recordedclasses}
                        />
                    </tr>
                    <tr>
                        <td>Suggested Pricing</td>
                        <SuggestedPricing
                            type={props.type}
                            mode={props.userData.mode}
                            auth={props.auth}
                            fitnesspackagepricing={fitnesspackagepricing}
                            userData={props.userData}
                        />
                    </tr>
                    <tr>
                        <td>Set MRP</td>
                        <MRP
                            index={index}
                            type={props.type}
                            mode={props.userData.mode}
                            actionType={props.actionType}
                            fitnesspackagepricing={fitnesspackagepricing}
                            setFitnesspackagepricing={setFitnesspackagepricing}
                            widgetProps={props.widgetProps}
                            minPrice={minPrice}
                            userData={props.userData}
                        />
                    </tr>
                </tbody>
            </Table>
        </>
    );
};

export default FitnessPricingTable;
