import { useQuery } from '@apollo/client';
import { useContext, useMemo } from 'react'
import { Badge, Button, Dropdown, OverlayTrigger, Popover, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';
import { GET_ALL_PACKAGES } from '../../../resource-builder/graphQL/queries';
import AuthContext from "../../../../context/auth-context"
import PTTable from '../../../../components/table/PtTable/PTTable'

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



    // const dataTable = useMemo<any>(() => [
    //     {
    //         id: '1',
    //         packageName: "Package Name 1",
    //         packageStatus: 'Active',
    //         startDate: "28/07/20",
    //         packageRenewal: "27/07/20",

    //         programs: [
    //             {
    //                 programName: "Pirates of the Carribean 2",
    //                 client: "John",
    //                 programStatus: "Assigned",
    //                 programRenewal: "26/04/20",
    //             },
    //             {
    //                 programName: "Pirates of the Carribean 4",
    //                 client: "Mary",
    //                 programStatus: "Not Assigned",
    //                 programRenewal: "25/04/20"
    //             }
    //         ]
    //     },


    //     {
    //         id: '2',
    //         packageName: "Package Name 2",
    //         packageStatus: 'Active',
    //         startDate: "28/07/20",
    //         packageRenewal: "27/07/20",

    //         programs: [{
    //             programName: "Pirates of the Carribean 3",
    //             client: "Harry",
    //             programStatus: "Not Assigned",
    //             programRenewal: "25/04/20"
    //         }]
    //     },

    // ], []);


    const dataTable2 = useMemo<any>(() => [
        {
            id: '1',
            packageName: "Package Name 1",
            packageStatus: 'Active',
            startDate: "28/07/20",
            packageRenewal: "27/07/20",

            programName: "Pirates of the Carribean 2",
            client: "John",
            programStatus: "Assigned",
            programRenewal: "26/04/20",

        },

        {
            id: '1',
            packageName: "Package Name 1",
            packageStatus: 'Active',
            startDate: "28/07/20",
            packageRenewal: "27/07/20",


            programName: "Pirates of the Carribean 3",
            client: "Mary",
            programStatus: "Assigned",
            programRenewal: "26/04/20",

        },


        {
            id: '2',
            packageName: "Package Name 2",
            packageStatus: 'Active',
            startDate: "28/07/20",
            packageRenewal: "27/07/20",


            programName: "Pirates of the Carribean 3",
            client: "Harry",
            programStatus: "Not Assigned",
            programRenewal: "25/04/20"

        },


     

    ], []);






    // const newData: Array<any> = [];

    // dataTable.forEach(obj => {
    //     obj.programs.forEach(program => {
    //         newData.push({
    //             id: obj.id,
    //             packageName: obj.packageName,
    //             packageStatus: obj.packageStatus,
    //             startDate: obj.startDate,
    //             packageRenewal: obj.packageRenewal,


    //             client: program.client,
    //             programName: program.programName,
    //             programStatus: program.programStatus,
    //             programRenewal: program.programRenewal,
    //         });
    //     });
    // });


    // console.log("newData", dataTable2)


    const columns = useMemo(
        () => [
            {
                Header: "Package",
                columns: [
                    { accessor: 'id', Header: "ID" },
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
                    { accessor: "client", Header: 'Client' },
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
                    <PTTable columns={columns} data={dataTable2} />
                </Col>
            </Row>
        </div>
    )
}




class Package {
    createPackage = (packageName, packageStatus, startDate, packageRenewal, programName, client, programStatus, programRenewal) => {
        let updatePackage: any = {};
        updatePackage.packageName = packageName;
        updatePackage.packageStatus = packageStatus;
        updatePackage.startDate = startDate;
        updatePackage.packageRenewal = packageRenewal;
        updatePackage.programName = programName;
        updatePackage.client = client;
        updatePackage.programStatus = programStatus;
        updatePackage.programRenewal = programRenewal;
        return updatePackage
    }
}

export const updatePackage = new Package();