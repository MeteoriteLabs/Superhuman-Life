import React from 'react';
import ActionButton from '../../../../components/actionbutton';
import { Row, Col } from "react-bootstrap";
import { useContext, useMemo, useRef, useState } from 'react'
import Table from '../../../../components/table/index'
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_ALL_SUGGESTED_PRICING } from '../../graphQL/queries';
import authContext from '../../../../context/auth-context';
import moment from 'moment';
import PricingAssistAction from '../PricingAssistAction'
import { GET_FITNESS_PACKAGE_TYPES } from '../../../../builders/package-builder/fitness/graphQL/queries';
import OfferingsDisaplyImage from '../../../../components/customWidgets/offeringsDisplayImage';

import { flattenObj } from '../../../../components/utils/responseFlatten';

export default function Fitness() {

    const auth = useContext(authContext);
    const [dataTable, setDataTable] = useState<any[]>([]);
    const pricingAssistAction = useRef<any>(null);

    // get fitness package type
    const { data: fitness_package } = useQuery(GET_FITNESS_PACKAGE_TYPES, {
        variables: { id: auth.userid },

        onCompleted: data => {
            //called suggested pricing useLazyquery function
            getPackagePrice({ variables: { id: auth.userid } })
        }
    })

    // eslint-disable-next-line
    const [getPackagePrice, { data }] = useLazyQuery(
        GET_ALL_SUGGESTED_PRICING, {
        onCompleted: data => loadData(data)
    })

    // load function for suggested price query
    const loadData = (data: any) => {

        const flattenSuggestedPricing = flattenObj({ ...data });

        const flattenFitnessPackages = flattenObj({ ...fitness_package });

        const fitnessPackageObject = flattenFitnessPackages && flattenFitnessPackages.fitnessPackageTypes && flattenFitnessPackages.fitnessPackageTypes.length && flattenFitnessPackages.fitnessPackageTypes.filter((currentValue: any) => {
            return currentValue.PricingRequired === true
        }).map((currValue: any) => {
            return currValue.Modes.Channel.map((channelMode: String[]) => {

                const indexOfPackage = flattenSuggestedPricing.suggestedPricings.findIndex((element: any) => element.Mode === channelMode && element.fitness_package_type.type === currValue.type)

                return {
                    id: indexOfPackage !== -1 ? flattenSuggestedPricing.suggestedPricings[indexOfPackage].id : "",
                    packageTypeId: currValue.id,
                    type: currValue.type,
                    modes: channelMode,
                    mrp: indexOfPackage !== -1 ? flattenSuggestedPricing.suggestedPricings[indexOfPackage].mrp : "--",
                    updatedAt: indexOfPackage !== -1 ? moment(flattenSuggestedPricing.suggestedPricings[indexOfPackage].updatedAt).format('MMMM DD,YYYY') : "",
                    duration: currValue.Unit_Pricing_Calculation,
                }
            })
        });

        const flattenPackage = fitnessPackageObject && fitnessPackageObject?.length && fitnessPackageObject.flat(1);

        setDataTable(flattenPackage);
    }

    const columns = useMemo(

        () => [
            {
                accessor: "type", Header: "Type", Cell: ({ row }: any) => {
                    console.log(row.original)
                    return <div className='d-flex justify-content-center align-items-center'>
                        <div>
                            <OfferingsDisaplyImage mode={row.original?.modes} packageType={row.original?.type}/>
                            {/* <img src={`./assets/${type}`} alt={name} /> */}
                            <p className='mb-0'>{row.original?.type}</p>
                        </div>
                    </div>
                }
            },
            {
                accessor: 'duration', Header: 'Duration', Cell: ({ row }: any) => {
                    return <p className='mb-0'>{
                        row.values.duration
                    } </p>
                }
            },
            {
                accessor: 'mrp', Header: 'MRP', Cell: ({ row }: any) => {
                    return <p className='mb-0'>Rs {row.values.mrp}</p>
                }
            },
            { accessor: 'updatedAt', Header: 'Updated' },
            {
                id: "edit",
                Header: "Actions",
                Cell: ({ row }: any) => {
                    const editPackagePricing = () => {
                        pricingAssistAction.current.TriggerForm({ id: row.original.id, actionType: 'edit', rowData: row.original }
                        )
                    };
                    const arrayAction = [
                        { actionName: 'Edit', actionClick: editPackagePricing },
                    ]

                    return <ActionButton
                        arrayAction={arrayAction}
                    >
                    </ActionButton>
                }
            }
        ],
        []
    );

    return (
        <div className="mt-5">
            <p>This base pricing will be used to help you price your offerings. It will suggest you the calculated price based mode, duration and type of offering.</p>
            <Row>
                <Col>
                    <Table columns={columns} data={dataTable} />
                    <PricingAssistAction ref={pricingAssistAction} />
                </Col>
            </Row>
        </div>
    )
}
