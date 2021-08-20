import { useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';
import { GET_ALL_PACKAGES } from '../../../resource-builder/graphQL/queries';
import AuthContext from "../../../../context/auth-context"
import GroupTable from '../../../../components/table/GroupTable';

// type Data = {
//     actor: string;
//     movie: ;
// };



export default function Group(props) {

    const auth = useContext(AuthContext);
    console.log(auth)

    // const { data } = useQuery(GET_ALL_PACKAGES, {
    //     variables: {
    //         id: auth.userid,
    //     }
    // });
    // console.log(data)



    // const FetchData = () => {
    //     useQuery(GET_ALL_PACKAGES, {
    //         variables: {
    //             id: auth.userid
    //         },
    //         onCompleted: (data => fillData(data))
    //     })

    // }

    // FetchData();


    // const fillData = (data) => {
    //     console.log(data)
    // }


    const origData = [
        {
            packageName: "Package Name 1",
            expiry: "30/12/20",
            programs: [
                {
                    program: "Pirates of the Carribean 1",
                    student:"John",
                    status:"Not Assigned",
                    renewal:"25/04/20"
                },
                {
                    program: "Pirates of the Carribean 2",
                    student:"John",
                    status:"Assigned",
                    renewal:"26/04/20",
                },
                {
                    program: "Pirates of the Carribean 3",
                    student:"John",
                    status:"Assigned",
                    renewal:"27/04/20",
                },
                {
                    program: "Pirates of the Carribean 4",
                    student:"John",
                    status:"Not Assigned",
                    renewal:"28/04/20",
                }
            ]
        },

        {
            packageName: "Package Name 2",
            expiry: "27/12/20",
            programs: [
                {
                    program: "Pirates of the Carribean 1",
                    student:"John",
                    status:"Not Assigned",
                    renewal:"25/04/20"
                },
                {
                    program: "Pirates of the Carribean 2",
                    student:"John",
                    status:"Assigned",
                    renewal:"26/04/20",
                },
                {
                    program: "Pirates of the Carribean 3",
                    student:"John",
                    status:"Assigned",
                    renewal:"27/04/20",
                },
                {
                    program: "Pirates of the Carribean 4",
                    student:"John",
                    status:"Not Assigned",
                    renewal:"28/04/20",
                }
            ]
        },

    ];

    const newData: Array<any> = [];

    origData.forEach(obj => {
        obj.programs.forEach(program => {
            newData.push({
                packageName: obj.packageName,
                expiry: obj.expiry,
                programName: program.program,
                students:program.student,
                programStatus:program.status,
                renewal:program.renewal
            });
        });
    });


    const data = useMemo(() => newData, []);

    const columns = useMemo(
        () => [
            {
                Header: "Package",
                columns: [
                    { accessor: "packageName", Header: 'Name', enableRowSpan: true },
                    { accessor: "expiry", Header: 'Expiry', enableRowSpan: true },
                    {
                        id: "packageEdit",
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
            {accessor:' ', Header:''},

            {
                Header: "Program",
                columns: [
                    { accessor: "programName", Header: 'Name' },
                    { accessor: "students", Header: 'Students' },
                    {
                        accessor: "programStatus",
                        Header: "Status",
                        Cell: (row: any) => {
                            return <>
                                {row.value === "Assigned" ?
                                    <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                                    <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                                }
                            </>
                        }
                    },
                    { accessor: "renewal", Header: "Renewal Date" },
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
        ],
        []
    );

    return (
        <div className="mt-5">
            <Row>
                <Col>
                    <GroupTable columns={columns} data={data} />
                </Col>

            </Row>
        </div>
    )
}
