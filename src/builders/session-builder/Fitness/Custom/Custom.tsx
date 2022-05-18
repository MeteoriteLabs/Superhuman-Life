import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react'
import { Badge, Row, Col, Form } from "react-bootstrap";
import Table from '../../../../components/table';

import AuthContext from "../../../../context/auth-context"
import { GET_SESSIONS_FROM_TAGS } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction';
import { flattenObj } from '../../../../components/utils/responseFlatten';

export default function Custom(props) {

    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);
    const [showHistory, setShowHistory] = useState(false);

    const fitnessActionRef = useRef<any>(null);



    // const FetchData = () => {
        const mainQuery = useQuery(GET_SESSIONS_FROM_TAGS, {
            variables: {
                id: auth.userid,
                tagType: 'Custom Fitness'
            },
            onCompleted: (data) => loadData(data)
        });
        // useQuery(GET_ALL_CLIENT_PACKAGE_BY_TYPE, {
        //     variables: {
        //         id: auth.userid,
        //         type: 'Custom',
        //     },
        //     onCompleted: (data) => loadData(data)
        // })

    // }


    const loadData = (data) => {
        const flattenData = flattenObj({...data});
        console.log(flattenData);
        setUserPackage(
            [...flattenData.tags].map((packageItem) => {
                let renewDay: any = '';
                if (packageItem.client_packages[0].fitnesspackages[0].length !== 0) {
                    renewDay = new Date(packageItem.client_packages[0].effective_date);
                    renewDay.setDate(renewDay.getDate() + packageItem.client_packages[0].fitnesspackages[0].duration)
                }
                return {
                    tagId: packageItem.id,
                    id: packageItem.client_packages[0].fitnesspackages[0].id,
                    packageName: packageItem.client_packages[0].fitnesspackages[0].packagename,
                    duration: packageItem.client_packages[0].fitnesspackages[0].duration,
                    effectiveDate: moment(packageItem.client_packages[0].effective_date).format("MMMM DD,YYYY"),
                    packageStatus: packageItem.client_packages[0].fitnesspackages[0].Status ? "Active" : "Inactive",
                    packageRenewal: moment(renewDay).format("MMMM DD,YYYY"),

                    client: packageItem.client_packages[0].users_permissions_user.username,
                    clientId: packageItem.client_packages[0].users_permissions_user.id,
                    // level: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].level,
                    // discipline: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].fitnessdisciplines,
                    // description: packageItem.program_managers.length === 0 ? "" : packageItem?.program_managers[0]?.fitnessprograms[0].description,
                    programName: packageItem.tag_name,
                    // programId: packageItem.program_managers.length === 0 ? null : packageItem.program_managers[0].fitnessprograms[0].id,
                    programStatus: handleStatus(packageItem.sessions, packageItem.client_packages[0].effective_date, renewDay),
                    programRenewal:  calculateProgramRenewal(packageItem.sessions, packageItem.client_packages[0].effective_date),
                }
            })
        )
    }

    function handleStatus(sessions: any, effective_date: any, renewDay){
        let effectiveDate: any;
        if(sessions.length === 0){
            return "Not_Assigned"
        }else if(sessions.length > 0){
            let max: number = 0;
            for(var i=0; i<sessions.length; i++){
                if(sessions[i].day_of_program > max){
                    max = sessions[i].day_of_program;
                }
            }
            effectiveDate = moment(effective_date).add(max, 'days').format("MMMM DD,YYYY");
            if(moment(effectiveDate).isBetween(moment(), moment().subtract(5, 'months'))){
                return "Almost Ending"
            }else {
                return "Assigned"
            }
        }else {
            if(moment(effectiveDate) === moment(renewDay)){
                return "Completed"
            }
        }
    }

    function calculateProgramRenewal(sessions: any, effectiveDate: any) {
        // console.log('calculateProgramRenewal', duration, effectiveDate, renewalDate);
        
        // const dates: string[] = []; 

        let max: number = 0;
        for(var i=0; i<sessions.length; i++){
            if(sessions[i].day_of_program > max){
                max = sessions[i].day_of_program;
            }
        }

        return moment(effectiveDate).add(max, 'days').format("MMMM DD,YYYY");

        // for(var i=0; i<duration; i++){
        //     const t = moment(effectiveDate).add(i, 'days').format("MMMM DD,YYYY");
        //     dates.push(t);
        // }
        // return dates[renewalDate-1];
    }


    // FetchData();

    function handleRedirect(id: any) {
        if(id === 'N/A'){
            alert('No Program Assigned');
            return;
        }
        window.location.href = `/custom/session/scheduler/${id}`
    }

    const columns = useMemo<any>(() => [
        {
            accessor: "client",
            Header: "Client",
            Cell: (row: any) => {
                return <div className='text-center'>
                    <img src="https://picsum.photos/200/100" alt={row.value} style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                    <p className='mt-3'>{row.value}</p>
                </div>
            }
        },

        {
            Header: "Package",
            columns: [
                {
                    accessor: "packageName",
                    Header: "Name"
                },
                // {
                //     accessor: "packageStatus",
                //     Header: "Status",
                //     Cell: (row: any) => {
                //         return <>
                //             {(row.value === "Active" || row.value === "Private") ?
                //                 <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="success">{row.value}</Badge> :
                //                 <Badge style={{ padding: '0.8rem 3rem', borderRadius: '10px', fontSize: '1rem' }} variant="danger">{row.value}</Badge>
                //             }
                //         </>
                //     }
                // },
                { accessor: "effectiveDate", Header: "Effective Date" },
                { accessor: "packageRenewal", Header: "Renewal Date" },

            ]
        },

        {
            Header: " ",
            columns: [
                {
                    accessor: "programName",
                    Header: "Class Name",
                },
            ]
        },

        {
            Header: "Class Details",
            columns: [
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
                { accessor: "programRenewal", Header: "Last Session Date" },
                {
                    id: "edit",
                    Header: "Actions",
                    Cell: ({ row }: any) => {
                        const actionClick1 = () => {
                            handleRedirect(row.original.tagId);
                        };

                        const actionClick2 = () => {
                            fitnessActionRef.current.TriggerForm({ id: row.original.id, actionType: 'details', type: "Custom Fitness", rowData: row.original })
                        };

                        const arrayAction = [
                            { actionName: 'Manage', actionClick: actionClick1 },
                            { actionName: 'Details', actionClick: actionClick2 },
                        ]

                        return <ActionButton
                        arrayAction={arrayAction}
                        >
                        </ActionButton>
                    }
                }

            ]
        },
    ], []);


    return (
        <div className="mt-5">
            <div className='mb-3'>
                <Form>
                    <Form.Check 
                        type="switch"
                        id="custom-switch"
                        label="Show History"
                        defaultChecked={showHistory}
                        onClick={() => { setShowHistory(!showHistory); mainQuery.refetch(); }}
                    />
                </Form>
            </div>
            <Row>
                <Col>

                    <Table columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef} />
                </Col>

            </Row>
        </div>
    )
}
