import { useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';
import { GET_ALL_PACKAGES } from '../../../resource-builder/graphQL/queries';
import AuthContext from "../../../../context/auth-context"
import GroupTable from '../../../../components/table/GroupTable/GroupTable';

// type Data = {
//     actor: string;
//     movie: ;
// };



export default function Group(props) {

    const auth = useContext(AuthContext);
 

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
            packageStatus: 'Active',
            startDate: "27/07/20",
            packageRenewal: "27/07/20",
            programs: [
                {
                    program: "Pirates of the Carribean 1",
                    student: "John",
                    status: "Not Assigned",
                    renewal: "25/04/20"
                },
                {
                    program: "Pirates of the Carribean 2",
                    student: "John",
                    status: "Assigned",
                    renewal: "26/04/20",
                },
              
            ]
        },

        {
            packageName: "Package Name 2",
            packageStatus: 'inActive',
            startDate: "28/07/20",
            packageRenewal: "28/07/20",
            programs: [
                {
                    program: "Pirates of the Carribean 1",
                    student: "John",
                    status: "Not Assigned",
                    renewal: "25/04/20"
                },
                {
                    program: "Pirates of the Carribean 2",
                    student: "John",
                    startDate: "7:00 am-8:00 am",
                    status: "Assigned",
                    renewal: "26/04/20",
                },
                {
                    program: "Pirates of the Carribean 3",
                    student: "John",
                    time: "7:00 am-8:00 am",
                    status: "Assigned",
                    renewal: "27/04/20",
                },
                {
                    program: "Pirates of the Carribean 4",
                    student: "John",
                    time: "7:00 am-8:00 am",
                    status: "Not Assigned",
                    renewal: "29/04/20",
                }
            ]
        },

    ];

    const newData: Array<any> = [];

    origData.forEach(obj => {
        obj.programs.forEach(program => {
            newData.push({
                packageName: obj.packageName,
                packageStatus: obj.packageStatus,
                startDate: obj.startDate,
                packageRenewal: obj.packageRenewal,

                students: program.student,
                programName: program.program,
                programStatus: program.status,
                programRenewal: program.renewal,
            });
        });

        
    console.log("🚀 ~ file: PT.tsx ~ line 111 ~ Group ~ newData", newData)
    });

    

    const data = useMemo(() => newData, []);

    const columns = useMemo(
        () => [
            {
                Header: "Package",
                columns: [
                    { accessor: "packageName", Header: 'Name', enableRowSpan: true },
                    {
                        accessor: "packageStatus",
                        Header: "Status",
                        Cell: (row: any) => {
                            return <>
                                {row.value === "Active" ?
                                    <Badge style={{ padding: '0.8rem 4rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                                    <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                                }
                            </>
                        },
                        enableRowSpan: true
                    },
                    { accessor: "startDate", Header: "Start Date", enableRowSpan: true },
                    { accessor: "packageRenewal", Header: 'Renewal Date', enableRowSpan: true },
                ]
            },

            { accessor: ' ', Header: '' },

            {
                Header: "Program",
                columns: [
                    { accessor: "students", Header: 'Students' },
                    { accessor: "programName", Header: 'Name' },
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
                    { accessor: "programRenewal", Header: "Renewal Date" },
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
