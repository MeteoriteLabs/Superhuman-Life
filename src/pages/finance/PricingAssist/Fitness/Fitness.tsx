import React from 'react'
import ActionButton from '../../../../components/actionbutton';
import {  Row, Col } from "react-bootstrap";
import { useContext, useMemo, useRef, useState } from 'react'
import Table from '../../../../components/table/index'
import { useQuery } from '@apollo/client';
import { GET_ALL_SUGGESTED_PRICING } from '../../graphQL/queries';
import authContext from '../../../../context/auth-context';
import moment from 'moment';
import PricingAssistAction from '../PricingAssistAction'
import { GET_FITNESS_PACKAGE_TYPES } from '../../../../builders/package-builder/fitness/graphQL/queries';


export default function Fitness() {

    const auth = useContext(authContext);
    const [dataTable, setDataTable] = useState<any[]>([]);
    const pricingAssistAction = useRef<any>(null);



      // get fitness package type
    const {data:data2 } = useQuery(GET_FITNESS_PACKAGE_TYPES, {
        variables: { id: auth.userid },
    })
    


    const FetchData = () => useQuery(GET_ALL_SUGGESTED_PRICING, {
        variables: { id: auth.userid },
        onCompleted: data => loadData(data)
    })


    // const loadData = (data) => {
    //     setDataTable(
    //         [...data.suggestedPricings].map(item => {
    //             return {
    //                 id:item.id,
    //                 type: item.fitness_package_type.type,
    //                 duration: 1,
    //                 mode: item.Mode,
    //                 mrp: item.mrp,
    //                 updatedAt: moment(item.updateAt).format('MMMM DD,YYYY')
    //             }
    //         })
    //     )
    // }

    const loadData = (data) => {
        const personalTrainingOnline = data.suggestedPricings.data.filter(item => item.attributes.fitness_package_type.data.attributes.type === "Personal Training" && item.attributes.Mode === "Online");

        const personalTrainingOffline = data.suggestedPricings.data.filter(item => item.attributes.fitness_package_type.data.attributes.type === "Personal Training" && item.attributes.Mode === "Offline");

        const groupOnline = data.suggestedPricings.data.filter(item => item.attributes.fitness_package_type.data.attributes.type === "Group Class" && item.attributes.Mode === "Online");

        const groupOffline = data.suggestedPricings.data.filter(item => item.attributes.fitness_package_type.data.attributes.type === "Group Class" && item.attributes.Mode === "Offline");

        const classic = data.suggestedPricings.data.filter(item => item.attributes.fitness_package_type.data.attributes.type === "Classic" && item.attributes.Mode === "Online");

        const CohortOnline = data.suggestedPricings.data.filter(item => item.attributes.fitness_package_type.data.attributes.type === "Cohort" && item.attributes.Mode === "Online");

        const CohortOffline = data.suggestedPricings.data.filter(item => item.attributes.fitness_package_type.data.attributes.type === "Cohort" && item.attributes.Mode === "Offline");

        const liveStream = data.suggestedPricings.data.filter(item => item.attributes.fitness_package_type.data.attributes.type === "Live Stream Channel" && item.attributes.Mode === "Online");

        setDataTable(
            [
                {
                    id: personalTrainingOnline.length === 0 ? "" : personalTrainingOnline[0].id,
                    packageTypeID:data2.fitnessPackageTypes.data.filter(item =>item.attributes.type === "Personal Training").map(item =>item.id),
                    type: "Personal Training",
                    duration: 1,
                    mode: "Online",
                    mrp: personalTrainingOnline.length === 0 ? "--" : personalTrainingOnline[0].attributes.mrp,
                    updatedAt: personalTrainingOnline.length === 0 ? "--" : moment(personalTrainingOnline[0].updateAt).format('MMMM DD,YYYY')
                },
                {
                    id: personalTrainingOffline.length === 0 ? "" : personalTrainingOffline[0].id,
                    packageTypeID:data2.fitnessPackageTypes.data.filter(item =>item.attributes.type === "Personal Training").map(item =>item.id),
                    type: "Personal Training",
                    duration: 1,
                    mode: "Offline",
                    mrp: personalTrainingOffline.length === 0 ? "--" : personalTrainingOffline[0].attributes.mrp,
                    updatedAt: personalTrainingOffline.length === 0 ? "--" : moment(personalTrainingOffline[0].updateAt).format('MMMM DD,YYYY')
                },
                {
                    id: groupOnline.length === 0 ? "" : groupOnline[0].id,
                    packageTypeID:data2.fitnessPackageTypes.data.filter(item =>item.attributes.type === "Group Class").map(item =>item.id),
                    type: "Group Class",
                    duration: 1,
                    mode: "Online",
                    mrp: groupOnline.length === 0 ? "--" : groupOnline[0].attributes.mrp,
                    updatedAt: groupOnline.length === 0 ? "--" : moment(groupOnline[0].updateAt).format('MMMM DD,YYYY')
                },
                {
                    id: groupOffline.length === 0 ? "" : groupOffline[0].id,
                    packageTypeID:data2.fitnessPackageTypes.data.filter(item =>item.attributes.type === "Group Class").map(item =>item.id),
                    type: "Group Class",
                    duration: 1,
                    mode: "Offline",
                    mrp: groupOffline.length === 0 ? "--" : groupOffline[0].attributes.mrp,
                    updatedAt: groupOffline.length === 0 ? "--" : moment(groupOffline[0].updateAt).format('MMMM DD,YYYY')
                },
                {
                    id: classic.length === 0 ? "" : classic[0].id,
                    packageTypeID:data2.fitnessPackageTypes.data.filter(item =>item.attributes.type === "Classic").map(item =>item.id),
                    type: "Classic Class",
                    duration: 1,
                    mode: "Online",
                    mrp: classic.length === 0 ? "--" : classic[0].attributes.mrp,
                    updatedAt: classic.length === 0 ? "--" : moment(classic[0].updateAt).format('MMMM DD,YYYY')
                },
                {
                    id: CohortOnline.length === 0 ? "" : CohortOnline[0].id,
                    packageTypeID:data2.fitnessPackageTypes.data.filter(item =>item.attributes.type === "Cohort").map(item =>item.id),
                    type: "Cohort",
                    duration: 1,
                    mode: "Online",
                    mrp: CohortOnline.length === 0 ? "--" : CohortOnline[0].attributes.mrp,
                    updatedAt: CohortOnline.length === 0 ? "--" : moment(CohortOnline[0].updateAt).format('MMMM DD,YYYY')
                },
                {
                    id: CohortOffline.length === 0 ? "" : CohortOffline[0].id,
                    packageTypeID:data2.fitnessPackageTypes.data.filter(item =>item.attributes.type === "Cohort").map(item =>item.id),
                    type: "Cohort",
                    duration: 1,
                    mode: "Offline",
                    mrp: CohortOffline.length === 0 ? "--" : CohortOffline[0].attributes.mrp,
                    updatedAt: CohortOffline.length === 0 ? "--" : moment(CohortOffline[0].updateAt).format('MMMM DD,YYYY')
                },
                {
                    id: liveStream.length === 0 ? "" : liveStream[0].id,
                    packageTypeID:data2.fitnessPackageTypes.data.filter(item =>item.attributes.type === "Live Stream Channel").map(item =>item.id),
                    type: "Live Stream Channel",
                    duration: 1,
                    mode: "Online",
                    mrp: liveStream.length === 0 ? "--" : liveStream[0].attributes.mrp,
                    updatedAt: liveStream.length === 0 ? "--" : moment(liveStream[0].updateAt).format('MMMM DD,YYYY')
                },
            ]
        )
    }

    FetchData();

    
  



    const columns = useMemo(
        () => [
            {
                accessor: "type", Header: "Type", Cell: ({ row }: any) => {
                    let type = '';
                    let name = '';
                    switch (row.original.mode) {
                        case "Online": {
                            if (row.original.type === "Personal Training") {
                                type = "custompersonal-training-Online.svg";
                                name = "PT";
                            } else if (row.original.type === "Group Class") {
                                type = "customgroup-Online.svg";
                                name = "Group";
                            } else if (row.original.type === "Classic Class") {
                                type = "customgroup-Online.svg";
                                name = "Classic";
                            }
                            break;
                        }

                        case "Offline": {
                            if (row.original.type === "Personal Training") {
                                type = "custompersonal-training-Offline.svg";
                                name = "PT";
                            } else if (row.original.type === "Group Class") {
                                type = "customgroup-Offline.svg";
                                name = "Group";
                            }
                            break;
                        }
                    }


                    return <div className='d-flex justify-content-center align-items-center'>
                        <div>
                            <img src={`./assets/${type}`} alt={name} />
                            <p className='mb-0'>{name}</p>
                        </div>
                    </div>
                }
            },
            {
                accessor: 'duration', Header: 'Duration', Cell: ({ row }: any) => {
                    return <p className='mb-0'>{row.values.duration} class</p>
                }
            },
            {
                accessor: 'mrp', Header: 'Mrp', Cell: ({ row }: any) => {
                    return <p className='mb-0'>Rs {row.values.mrp}</p>
                }
            },
            { accessor: 'updatedAt', Header: 'Updated' },
            {
                id: "edit",
                Header: "Actions",
                Cell: ({ row }: any) => {
                    const actionClick1 = () => {
                        pricingAssistAction.current.TriggerForm({ id: row.original.id, actionType: 'edit', rowData: row.original })
                    };
                    const arrayAction = [
                        { actionName: 'Edit', actionClick: actionClick1 },
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
            <Row>
                <Col>
                    <Table columns={columns} data={dataTable} />
                    <PricingAssistAction ref={pricingAssistAction} />
                </Col>
            </Row>
        </div>
    )
}
