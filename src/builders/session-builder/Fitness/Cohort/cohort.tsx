import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react';
import { Badge, Row, Col, Button } from 'react-bootstrap';
import Table from '../../../../components/table';
import AuthContext from '../../../../context/auth-context';
import { GET_TAGS_FOR_COHORT } from '../../graphQL/queries';
import FitnessAction from '../FitnessAction';
import ActionButton from '../../../../components/actionbutton';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';

export default function Cohort(): JSX.Element {
    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);
    const fitnessActionRef = useRef<any>(null);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const mainQuery = useQuery(GET_TAGS_FOR_COHORT, {
        variables: { id: auth.userid, start: page * 10 - 10, limit: 10 },
        onCompleted: (data) => {
            loadData(data);
            setTotalRecords(data.tags.meta.pagination.total);
        }
    });

    const loadData = (data: any) => {
        const flattenData = flattenObj({ ...data });

        setUserPackage([
            ...flattenData.tags.map((packageItem) => {
                return {
                    tagId: packageItem.id,
                    id: packageItem.id,
                    packageName: packageItem.fitnesspackage.packagename,
                    duration: packageItem.fitnesspackage.duration,
                    start: moment(packageItem.fitnesspackage.Start_date).format('MMM Do,YYYY'),
                    end: moment(packageItem.fitnesspackage.End_date).format('MMM Do,YYYY'),
                    client:
                        packageItem.client_packages && packageItem.client_packages.length
                            ? packageItem.client_packages.length
                            : null,
                    programName: packageItem.tag_name ? packageItem.tag_name : 'N/A',
                    programStatus: packageItem.fitnesspackage.Status === true ? 'Assigned' : 'N/A',
                    renewal: calculateProgramRenewal(packageItem?.sessions)
                };
            })
        ]);
    };

    const calculateProgramRenewal = (sessions) => {
        if (sessions.length === 0) {
            return 'N/A';
        }

        const moments = sessions.map((d) => moment(d.session_date));
        const maxDate = moment.max(moments);

        return maxDate.format('MMM Do,YYYY');
    };

    const handleRedirect = (id: string) => {
        window.location.href = `/cohort/session/scheduler/${id}`;
    };

    const columns = useMemo(
        () => [
            {
                Header: 'Cohort',
                columns: [
                    { accessor: 'packageName', Header: 'Name' },
                    { accessor: 'start', Header: 'Start' },
                    { accessor: 'end', Header: 'End' }
                ]
            },

            { accessor: ' ', Header: '' },

            {
                Header: 'Program',
                columns: [
                    {
                        accessor: 'client',
                        Header: 'Client'
                    },
                    { accessor: 'programName', Header: 'Class Name' },
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
                    { accessor: 'renewal', Header: 'Last Session Date' },
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
                                    type: 'Classic Class',
                                    rowData: row.original
                                });
                            };

                            const clientsHandler = () => {
                                fitnessActionRef.current.TriggerForm({
                                    id: row.original.id,
                                    actionType: 'allClients',
                                    type: 'Classic Class'
                                });
                            };

                            const arrayAction = [
                                { actionName: 'Manage', actionClick: manageHandler },
                                { actionName: 'Details', actionClick: detailsHandler },
                                { actionName: 'All Clients', actionClick: clientsHandler }
                            ];
                            return <ActionButton arrayAction={arrayAction}></ActionButton>;
                        }
                    }
                ]
            }
        ],
        []
    );

    const pageHandler = (selectedPageNumber: number) => {
        setPage(selectedPageNumber);
    };

    return (
        <div className="mt-5">
            <Row>
                <Col>
                    <Table columns={columns} data={userPackage} />
                    <FitnessAction ref={fitnessActionRef} callback={() => mainQuery} />
                </Col>
            </Row>
            {/* Pagination */}
            {userPackage && userPackage.length ? (
                <Row className="justify-content-end">
                    <Button
                        variant="outline-dark"
                        className="m-2"
                        onClick={() => pageHandler(page - 1)}
                        disabled={page === 1 ? true : false}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline-dark"
                        className="m-2"
                        onClick={() => pageHandler(page + 1)}
                        disabled={totalRecords > page * 10 - 10 + userPackage.length ? false : true}
                    >
                        Next
                    </Button>
                    <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
                        page * 10 - 10 + userPackage.length
                    }`}</span>
                </Row>
            ) : null}
        </div>
    );
}
