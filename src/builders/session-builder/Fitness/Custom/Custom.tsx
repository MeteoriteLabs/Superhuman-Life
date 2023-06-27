import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react';
import { Badge, Row, Col, Form } from 'react-bootstrap';
import Table from '../../../../components/table';
import AuthContext from '../../../../context/auth-context';
import { GET_SESSIONS_FROM_TAGS } from '../../graphQL/queries';
import moment from 'moment';
import ActionButton from '../../../../components/actionbutton';
import FitnessAction from '../FitnessAction';
import { flattenObj } from '../../../../components/utils/responseFlatten';

export default function Custom() {
    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);
    const [showHistory, setShowHistory] = useState<boolean>(false);
    const fitnessActionRef = useRef<any>(null);

    const mainQuery = useQuery(GET_SESSIONS_FROM_TAGS, {
        variables: {
            id: auth.userid,
            tagType: 'Custom Fitness'
        },
        onCompleted: (data) => loadData(data)
    });

    const loadData = (data) => {
        const flattenData = flattenObj({ ...data });

        setUserPackage(
            [...flattenData.tags].map((packageItem) => {
                let renewDay: any = '';
                if (
                    packageItem.client_packages &&
                    packageItem.client_packages.length &&
                    packageItem.client_packages[0].fitnesspackages &&
                    packageItem.client_packages[0].fitnesspackages[0].length !== 0
                ) {
                    renewDay = new Date(packageItem.client_packages[0].effective_date);
                    renewDay.setDate(
                        renewDay.getDate() +
                            packageItem.client_packages[0].fitnesspackages[0].duration
                    );
                }
                return {
                    tagId: packageItem.id,
                    id:
                        packageItem.client_packages &&
                        packageItem.client_packages.length &&
                        packageItem.client_packages[0].fitnesspackages &&
                        packageItem.client_packages[0].fitnesspackages[0].id,
                    packageName:
                        packageItem.client_packages &&
                        packageItem.client_packages.length &&
                        packageItem.client_packages[0].fitnesspackages
                            ? packageItem.client_packages[0].fitnesspackages[0].packagename
                            : null,
                    duration:
                        packageItem.client_packages &&
                        packageItem.client_packages.length &&
                        packageItem.client_packages[0].fitnesspackages &&
                        packageItem.client_packages[0].fitnesspackages[0].duration,
                    effectiveDate:
                        packageItem.client_packages &&
                        packageItem.client_packages.length &&
                        packageItem.client_packages[0].fitnesspackages
                            ? moment(packageItem.client_packages[0].effective_date).format(
                                  'MMMM DD,YYYY'
                              )
                            : null,
                    packageStatus:
                        packageItem.client_packages &&
                        packageItem.client_packages.length &&
                        packageItem.client_packages[0].fitnesspackages &&
                        packageItem.client_packages[0].fitnesspackages[0].Status
                            ? 'Active'
                            : 'Inactive',
                    packageRenewal:
                        packageItem.client_packages && packageItem.client_packages.length
                            ? moment(renewDay).format('MMMM DD,YYYY')
                            : null,
                    client:
                        packageItem.client_packages && packageItem.client_packages.length
                            ? packageItem.client_packages[0].users_permissions_user.username
                            : null,
                    clientId:
                        packageItem.client_packages && packageItem.client_packages.length
                            ? packageItem.client_packages[0].users_permissions_user.id
                            : null,
                    programName: packageItem.tag_name,
                    programStatus:
                        packageItem.client_packages && packageItem.client_packages.length
                            ? handleStatus(
                                  packageItem.sessions,
                                  packageItem.client_packages[0].effective_date,
                                  renewDay
                              )
                            : null,
                    programRenewal:
                        packageItem.client_packages && packageItem.client_packages.length
                            ? calculateProgramRenewal(
                                  packageItem.sessions,
                                  packageItem.client_packages[0].effective_date
                              )
                            : null
                };
            })
        );
    };

    function handleStatus(sessions: any, effective_date: any, renewDay) {
        let effectiveDate: any;
        if (sessions.length === 0) {
            return 'Not_Assigned';
        } else if (sessions.length > 0) {
            let max = 0;
            for (let i = 0; i < sessions.length; i++) {
                if (sessions[i].day_of_program > max) {
                    max = sessions[i].day_of_program;
                }
            }
            effectiveDate = moment(effective_date).add(max, 'days').format('MMMM DD,YYYY');
            if (moment(effectiveDate).isBetween(moment(), moment().subtract(5, 'months'))) {
                return 'Almost Ending';
            } else {
                return 'Assigned';
            }
        } else {
            if (moment(effectiveDate) === moment(renewDay)) {
                return 'Completed';
            }
        }
    }

    function calculateProgramRenewal(sessions: any, effectiveDate: any) {
        let max = 0;
        for (let i = 0; i < sessions.length; i++) {
            if (sessions[i].day_of_program > max) {
                max = sessions[i].day_of_program;
            }
        }

        return moment(effectiveDate).add(max, 'days').format('MMMM DD,YYYY');
    }

    function handleRedirect(id: any) {
        if (id === 'N/A') {
            alert('No Program Assigned');
            return;
        }
        window.location.href = `/custom/session/scheduler/${id}`;
    }

    const columns = useMemo<any>(
        () => [
            {
                accessor: 'client',
                Header: 'Client'
            },
            {
                Header: 'Package',
                columns: [
                    {
                        accessor: 'packageName',
                        Header: 'Name'
                    },
                    { accessor: 'effectiveDate', Header: 'Effective Date' },
                    { accessor: 'packageRenewal', Header: 'Renewal Date' }
                ]
            },

            {
                Header: ' ',
                columns: [
                    {
                        accessor: 'programName',
                        Header: 'Class Name'
                    }
                ]
            },

            {
                Header: 'Class Details',
                columns: [
                    {
                        accessor: 'programStatus',
                        Header: 'Status',
                        Cell: (row: any) => {
                            return (
                                <>
                                    {row.value === 'Assigned' ? (
                                        <Badge
                                            className="px-3 py-1"
                                            style={{ fontSize: '1rem', borderRadius: '10px' }}
                                            variant="success"
                                        >
                                            {row.value}
                                        </Badge>
                                    ) : (
                                        <Badge
                                            className="px-3 py-1"
                                            style={{ fontSize: '1rem', borderRadius: '10px' }}
                                            variant="danger"
                                        >
                                            {row.value}
                                        </Badge>
                                    )}
                                </>
                            );
                        }
                    },
                    { accessor: 'programRenewal', Header: 'Last Session Date' },
                    {
                        id: 'edit',
                        Header: 'Actions',
                        Cell: ({ row }: any) => {
                            const manageHandler = () => {
                                handleRedirect(row.original.tagId);
                            };

                            const detailsHandler = () => {
                                fitnessActionRef.current.TriggerForm({
                                    id: row.original.id,
                                    actionType: 'details',
                                    type: 'Custom Fitness',
                                    rowData: row.original
                                });
                            };

                            const arrayAction = [
                                { actionName: 'Manage', actionClick: manageHandler },
                                { actionName: 'Details', actionClick: detailsHandler }
                            ];

                            return <ActionButton arrayAction={arrayAction}></ActionButton>;
                        }
                    }
                ]
            }
        ],
        []
    );

    function handleHistoryPackage(data: any) {
        const flattenData = flattenObj({ ...data });
        setUserPackage(
            [...flattenData.tags].map((packageItem) => {
                let renewDay: any = '';
                if (packageItem.client_packages[0].fitnesspackages[0].length !== 0) {
                    renewDay = new Date(packageItem.client_packages[0].effective_date);
                    renewDay.setDate(
                        renewDay.getDate() +
                            packageItem.client_packages[0].fitnesspackages[0].duration
                    );
                }
                return {
                    tagId: packageItem.id,
                    id: packageItem.client_packages[0].fitnesspackages[0].id,
                    packageName: packageItem.client_packages[0].fitnesspackages[0].packagename,
                    duration: packageItem.client_packages[0].fitnesspackages[0].duration,
                    effectiveDate: moment(packageItem.client_packages[0].effective_date).format(
                        'MMMM DD,YYYY'
                    ),
                    packageStatus: packageItem.client_packages[0].fitnesspackages[0].Status
                        ? 'Active'
                        : 'Inactive',
                    packageRenewal: moment(renewDay).format('MMMM DD,YYYY'),

                    client: packageItem.client_packages[0].users_permissions_user.username,
                    clientId: packageItem.client_packages[0].users_permissions_user.id,
                    programName: packageItem.tag_name,
                    programStatus: handleStatus(
                        packageItem.sessions,
                        packageItem.client_packages[0].effective_date,
                        renewDay
                    ),
                    programRenewal: calculateProgramRenewal(
                        packageItem.sessions,
                        packageItem.client_packages[0].effective_date
                    )
                };
            })
        );
    }

    if (!showHistory) {
        if (userPackage.length > 0) {
            userPackage.filter((item: any, index: any) =>
                moment(item.packageRenewal).isBefore(moment()) === true
                    ? userPackage.splice(index, 1)
                    : null
            );
        }
    }

    return (
        <div className="mt-5">
            <div className="mb-3">
                <Form>
                    <Form.Check
                        type="switch"
                        id="switchEnabled"
                        label="Show History"
                        defaultChecked={showHistory}
                        onClick={() => {
                            setShowHistory(!showHistory);
                            mainQuery.refetch().then((res: any) => {
                                handleHistoryPackage(res.data);
                            });
                        }}
                    />
                </Form>
            </div>
            <Row>
                <Col>
                    <Table columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                </Col>
            </Row>
        </div>
    );
}
