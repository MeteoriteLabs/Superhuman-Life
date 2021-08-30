import { useQuery } from '@apollo/client';
import { useContext, useMemo, useState } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';
import AuthContext from "../../../../context/auth-context"
import { GET_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment'

export default function Classic(props) {

    const auth = useContext(AuthContext);

    const [userPackage, setUserPackage]: any[] = useState('')


    // const { data } = useQuery(GET_PACKAGE_BY_TYPE, {
    //     variables: {
    //         id: auth.userid,
    //         type: 'Classic Class'
    //     }
    // });
    // console.log(data)





    const FetchData = () => {
        useQuery(GET_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Classic Class'
            },
            onCompleted: (data) => loadData(data)
        })

    }

 


    const loadData = (data) => {
        console.log(data);
        setUserPackage(
            [...data.userPackages]?.map((packageItem, index) => {
                return {
                    packageName: packageItem.fitnesspackages[0].packagename,
                    duration: packageItem.fitnesspackages[0].duration.toString(),
                    expiry:moment(packageItem.fitnesspackages[0].expiry_date).format("DD/MM/YY"),
                    packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",

                    client:packageItem.fitnessprograms[0].users_permissions_user.username,
                    programName:packageItem.fitnessprograms[0].title,
                    programStatus: "Assigned",
                    programRenewal: "25/07/20",
                }
            })
        )
    }

    
    // FetchData();

    const columns = useMemo<any>(() => [

        {
            Header: "Package",
            columns: [
                {
                    accessor: "packageName",
                    Header: "Name"
                },
                { accessor: "duration", Header: "Duration" },
                { accessor: "expiry", Header: "Expiry" },
                {
                    accessor: "packageStatus",
                    Header: "Status",
                    Cell: (row: any) => {
                        return <>
                            {(row.value === "Active" || row.value === "Private") ?
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                            }
                        </>


                    }
                },
            ]
        },

        {
            Header: " ",
            columns: [
                {
                    accessor: "blank",
                    Header: " ",
                },

            ]
        },
        {
            Header: "Program",
            columns: [
                { accessor: 'programName', Header: "Name" },
                {
                    accessor: "client",
                    Header: "Client",
                    Cell: (v: any) => {
                        return <div className='text-center'>
                            <img src={v.value} alt={v.value} style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                        </div>
                    }
                },
                {
                    accessor: "programStatus",
                    Header: "Status",
                    Cell: (row: any) => {
                        return <>
                            {row.value === "Assigned" ?
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                                <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                            }
                        </>
                    }
                },
                { accessor: "programRenewal", Header: "Renewal" },
                {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => (
                        <OverlayTrigger
                            trigger="click"
                            placement="right"
                            overlay={
                                <Popover id="action-popover">
                                    <Popover.Content>
                                        <Dropdown.Item>Assign</Dropdown.Item>
                                        <Dropdown.Item>Edit</Dropdown.Item>
                                        <Dropdown.Item>View</Dropdown.Item>
                                    </Popover.Content>
                                </Popover>
                            }
                        >
                            <Button variant="white">
                                <i className="fas fa-ellipsis-v"></i>
                            </Button>
                        </OverlayTrigger>
                    ),
                }

            ]
        },
    ], []);

    const dataTable = useMemo<any>(() => [
        {
            "packageName": "Package Name",
            "duration": "10 days",
            "expiry": "25/07/20",
            "packageStatus": "Active",

            "programName": "Package Name",
            "client": 'https://picsum.photos/200',
            "programStatus": "Not Assigned",
            "programRenewal": "25/07/20",
        },
        {
            "packageName": "Package Name",
            "duration": "1 days",
            "expiry": "25/07/20",
            "packageStatus": "Inactive",

            "programName": "Package Name",
            "client": 'https://picsum.photos/200',
            "programStatus": "Assigned",
            "programRenewal": "25/07/20",
        },
        {
            "packageName": "Package Name",
            "duration": "10 days",
            "expiry": "25/07/20",
            "packageStatus": "Active",

            "programName": "Package Name",
            "client": 'https://picsum.photos/200',
            "programStatus": "Not Assigned",
            "programRenewal": "25/07/20",
        },

    ], []);

    
    // console.log(userPackage);
    // console.log(dataTable)

    return (
        <div className="mt-5">
            <Row>
                <Col>

                    <Table columns={columns} data={dataTable} />
                </Col>

            </Row>
        </div>
    )
}
