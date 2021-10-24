import React from 'react'
import ActionButton from '../../../../components/actionbutton';
import { Badge, Row, Col } from "react-bootstrap";
import { useContext, useMemo, useRef, useState } from 'react'
import Table from '../../../../components/table/index'
import { useQuery } from '@apollo/client';
import { GET_ALL_SUGGESTED_PRICING } from '../../graphQL/queries';
import authContext from '../../../../context/auth-context';
import moment from 'moment';
import PricingAssistAction from '../PricingAssistAction'


export default function Fitness() {

    const auth = useContext(authContext);
    const [dataTable, setDataTable] = useState<any[]>([]);
    const pricingAssistAction = useRef<any>(null)


    const FetchData = () => useQuery(GET_ALL_SUGGESTED_PRICING, {
        variables: { id: auth.userid },
        onCompleted: data => loadData(data)
    })


    const loadData = (data) => {
        setDataTable(
            [...data.suggestedPricings].map(item => {
                return {
                    id:item.id,
                    type: item.fitness_package_type.type,
                    duration: 1,
                    mode: item.Mode,
                    mrp: item.mrp,
                    updatedAt: moment(item.updateAt).format('MMMM DD,YYYY')
                }
            })
        )

    }

    FetchData()
  

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
                        pricingAssistAction.current.TriggerForm({ id: row.original.id, actionType: 'edit',  rowData: row.original })
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
