import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col } from "react-bootstrap";
import Table from '../../../../components/table';
import AuthContext from "../../../../context/auth-context"
import { GET_PACKAGE_BY_TYPE } from '../../graphQL/queries';
import moment from 'moment'
import FitnessAction from '../FitnessAction';
import ActionButton from '../../../../components/actionbutton';

export default function Classic(props) {

    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);

    const fitnessActionRef = useRef<any>(null);

    const FetchData = () => {
        useQuery(GET_PACKAGE_BY_TYPE, {
            variables: {
                id: auth.userid,
                type: 'Classic Class',
            },
            onCompleted: (data) => loadData(data)
        })

    }




    const loadData = (data) => {
        console.log('Classic query data', data);
        setUserPackage(
            [...data.userPackages].map((packageItem) => {
                let renewDay: any = '';
                if (packageItem.fitnesspackages.length !== 0) {
                    renewDay = new Date(packageItem.effective_date);
                    renewDay.setDate(renewDay.getDate() + packageItem.fitnesspackages[0].duration)
                }

                if (packageItem.program_managers.length === 0) {
                    return {
                        id: packageItem.fitnesspackages[0].id,
                        packageName: packageItem.fitnesspackages[0].packagename,
                        duration: packageItem.fitnesspackages[0].duration,
                        expiry: moment(packageItem.expiry_date).format("MMMM DD,YYYY"),
                        packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",


                        // programId:packageItem.fitnessprograms[0].id,
                        client: packageItem.users_permissions_user.username,
                        programName: 'N/A',
                        // users_permissions_user: packageItem.fitnessprograms[0].users_permissions_user.id,
                        programStatus: 'N/A',
                        programRenewal: 'N/A',
                    }
                } else {
                    return {
                        id: packageItem.fitnesspackages[0].id,
                        packageName: packageItem.program_managers[0].fitnesspackages[0].packagename,
                        duration: packageItem.fitnesspackages[0].duration,
                        expiry: moment(packageItem.expiry_date).format("MMMM DD,YYYY"),
                        packageStatus: packageItem.fitnesspackages[0].Status ? "Active" : "Inactive",

                        
                        // programId:packageItem.fitnessprograms[0].id,
                        client: packageItem.users_permissions_user.username,
                        programName: packageItem.program_managers[0].fitnessprograms[0].title,
                        // users_permissions_user: packageItem.fitnessprograms[0].users_permissions_user.id,
                        programStatus: "Assigned",
                        programRenewal: "26/04/20"
                    }
                }
            })
        )
    }


    FetchData();


    let arr:any = []
    for (let i = 0; i < userPackage.length - 1; i++) {
        if (userPackage[i].id === userPackage[i + 1].id) {
            if (userPackage[i].programName === userPackage[i + 1].programName) {
                if (typeof userPackage[i].client === "string") {
                    arr[0] = userPackage[i].client;
                };
                arr.push(userPackage[i + 1].client);
                userPackage[i + 1].client = arr
                userPackage.splice(i, 1);
                i--;
            }
        }
        //  else {
        //     arr = []
        // }
    }

    const columns = useMemo(
        () => [
            {
                Header: "Package",
                columns: [
                    { accessor: "packageName", Header: 'Name', enableRowSpan: true },
                    { accessor: 'duration', Header: 'Duration' },
                    { accessor: 'expiry', Header: 'Expiry' },
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
                ]
            },

            { accessor: ' ', Header: '' },

            {
                Header: "Program",
                columns: [
                    {
                        accessor: "client",
                        Header: "Client",
                        Cell: (row) => {
                            return <div >
                                {typeof row.value === "string" ?
                                    <img
                                        src="https://picsum.photos/200/100" alt='profile-pic'
                                        style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                                    :
                                    <div className='position-relative' style={{ width: '8rem', height: '5rem' }}>
                                        {row.value.slice(0, 4).map((item, index) => {
                                            let postionLeft = 20;
                                            return <img
                                                key={index}
                                                src="https://picsum.photos/200/100" alt='profile-pic'
                                                style={{ width: '60px', height: '60px', borderRadius: '50%', left: `${postionLeft * index}%` }}
                                                className='position-absolute'
                                            />
                                        })}
                                    </div>
                                }
                                    {typeof row.value === 'string' ?  <p className='text-center'>{row.value}</p> :  <p className='text-center'>{row.value.length} people</p>}
                            
                            </div>
                        }
                    },
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
                    {
                        id: "edit",
                        Header: "Actions",
                        Cell: ({ row }: any) => {
                            return <ActionButton
                                action1='Manage'
                                // actionClick1={() => {
                                //     fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'manage', type: "Personal Training", rowData:""})
                                // }}

                                action2='Details'
                                actionClick2={() => {
                                    fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Personal Training", rowData: row.original })
                                }}
                            >
                            </ActionButton>
                        }
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

                    <Table columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef} />
                </Col>

            </Row>
        </div>
    )
}
