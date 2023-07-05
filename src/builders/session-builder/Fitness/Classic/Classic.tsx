import { useQuery } from '@apollo/client';
import { useContext, useMemo, useRef, useState } from 'react';
import { Badge, Row, Col, Button } from 'react-bootstrap';
import Table from '../../../../components/table';
import AuthContext from '../../../../context/auth-context';
import { GET_TAGS_FOR_CLASSIC } from '../../graphQL/queries';
import FitnessAction from '../FitnessAction';
import ActionButton from '../../../../components/actionbutton';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';

const Classic: React.FC = () => {
    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<any>([]);
    const fitnessActionRef = useRef<any>(null);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const mainQuery = useQuery(GET_TAGS_FOR_CLASSIC, {
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
                    client: packageItem.client_packages.length
                        ? packageItem.client_packages.length
                        : null,
                    packageName: packageItem.fitnesspackage.packagename,
                    duration: packageItem.fitnesspackage.duration,
                    expiry: moment(packageItem?.fitnesspackage?.expiry_date).format('MMMM DD,YYYY'),
                    programName: packageItem.tag_name ? packageItem.tag_name : 'N/A',
                    programStatus: packageItem.fitnesspackage.Status === true ? 'Assigned' : 'N/A',
                };
            })
        ]);
    };

    function handleRedirect(id: any) {
        window.location.href = `/classic/session/scheduler/${id}`;
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Package',
                columns: [
                    { accessor: 'packageName', Header: 'Name', enableRowSpan: true },
                    { accessor: 'duration', Header: 'Duration' },
                    { accessor: 'expiry', Header: 'Expiry' }
                ]
            },
            { accessor: ' ', Header: '' },

            {
                Header: 'Class Details',
                columns: [
                    { accessor: 'programName', Header: 'Class Name' },
                    {
                        accessor: 'client',
                        Header: 'Client'
                    },
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
};

export default Classic;
