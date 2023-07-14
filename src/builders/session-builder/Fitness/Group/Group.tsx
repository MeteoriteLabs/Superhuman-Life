import { useQuery, useMutation } from '@apollo/client';
import React, { useContext, useMemo, useRef, useState  , useEffect} from 'react';
import { Badge, Row, Col, Button, Modal } from 'react-bootstrap';
import AuthContext from 'context/auth-context';
import GroupTable from 'components/table/GroupTable/GroupTable';
import { GET_TAGS_FOR_GROUP } from '../../graphQL/queries';
import { DELETE_TAG_BATCH } from '../../graphQL/mutation';
import moment from 'moment';
import ActionButton from 'components/actionbutton';
import FitnessAction from '../FitnessAction';
import { flattenObj } from 'components/utils/responseFlatten';

const Group: React.FC = () => {
    const auth = useContext(AuthContext);
    const [userPackage, setUserPackage] = useState<unknown[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [tagId, setTagId] = useState<string>('');
    const fitnessActionRef = useRef<any>(null);
    const [page, setPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const [deleteBatch] = useMutation(DELETE_TAG_BATCH, {
        onCompleted: () => {
            mainQuery.refetch();
        }
    });

    const mainQuery = useQuery(GET_TAGS_FOR_GROUP, {
        variables: {
            id: auth.userid,
            start: page * 10 - 10,
            limit: 10
        },
        onCompleted: (response) => {
            loadData(response);
            setTotalRecords(response.tags.meta.pagination.total);
        }
    });

    const loadData = (data: any) => {
        const flattenData = flattenObj({ ...data });

        setUserPackage([
            ...flattenData.tags.map((packageItem, index) => {
                let renewDay: any = '';
                if (packageItem.client_packages[index]?.fitnesspackages[0].length !== 0) {
                    renewDay = new Date(packageItem.client_packages[index]?.effective_date);
                    renewDay.setDate(
                        renewDay.getDate() +
                            packageItem.client_packages[index]?.fitnesspackages[0].duration
                    );
                }
                return {
                    tagId: packageItem.id,
                    id: packageItem?.fitnesspackage?.id,
                    packageName: packageItem.fitnesspackage.packagename,
                    duration: packageItem.client_packages[index]?.fitnesspackages[0].duration,
                    expiry: moment(
                        packageItem?.fitnesspackage?.expiry_date,
                        'YYYY-MM-DDTHH:mm'
                    ).format('MMMM DD, YYYY'),
                    packageStatus: packageItem.fitnesspackage.Status ? 'Active' : 'Inactive',
                    client: packageItem.client_packages.length
                        ? packageItem.client_packages.length
                        : 'N/A',
                    programName: packageItem.tag_name,
                    programStatus: handleStatus(
                        packageItem.sessions,
                        packageItem.client_packages[index]?.effective_date,
                        renewDay
                    ),
                    renewal: packageItem.id
                        ? calculateProgramRenewal(
                              packageItem.client_packages[index]?.effective_date,
                              packageItem.sessions
                          )
                        : 'N/A'
                };
            })
        ]);
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

    function calculateProgramRenewal(effective_date, sessions) {
        let max = 0;

        for (let i = 0; i < sessions?.length; i++) {
            if (sessions[i].day_of_program > max) {
                max = sessions[i].day_of_program;
            }
        }

        return moment(effective_date).add(max, 'days').format('MMMM DD,YYYY');
    }

    function handleRedirect(id: any) {
        window.location.href = `/group/session/scheduler/${id}`;
    }

    function handleDeleteBatch(tagId: string) {
        deleteBatch({
            variables: {
                id: tagId
            }
        });
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Package',
                columns: [
                    { accessor: 'packageName', Header: 'Name', enableRowSpan: true },
                    { accessor: 'expiry', Header: 'Expiry', enableRowSpan: true },
                    {
                        accessor: 'packageStatus',
                        Header: 'Status',
                        Cell: (row: any) => {
                            return (
                                <>
                                    {row.value === 'Active' ? (
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
                        },
                        enableRowSpan: true
                    },
                    {
                        accessor: 'action',
                        Header: 'Action',
                        enableRowSpan: true,
                        Cell: (row: any) => {
                            return (
                                <>
                                    <Button
                                        variant="outline-dark"
                                        size="sm"
                                        className="text-nowrap"
                                        onClick={() => {
                                            fitnessActionRef.current.TriggerForm({
                                                id: row.row.original.id,
                                                actionType: 'create',
                                                type: 'Group Class',
                                                duration: row.row.original.duration
                                            });
                                        }}
                                    >
                                        Add new
                                    </Button>
                                </>
                            );
                        }
                    }
                ]
            },
            { accessor: ' ', Header: '' },
            {
                Header: 'Class Details',
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
                                    type: 'Group Class',
                                    rowData: row.original
                                });
                            };

                            const allClientHandler = () => {
                                fitnessActionRef.current.TriggerForm({
                                    id: row.original.tagId,
                                    actionType: 'allClients',
                                    type: 'Group Class',
                                    rowData: row.original
                                });
                            };

                            const deleteBatchHandler = () => {
                                if (row.original.client === 'N/A') {
                                    setTagId(row.original.tagId);
                                    setShowDeleteModal(true);
                                }
                            };

                            const arrayAction = [
                                { actionName: 'Manage', actionClick: manageHandler },
                                { actionName: 'Details', actionClick: detailsHandler },
                                { actionName: 'All Clients', actionClick: allClientHandler },
                                { actionName: 'Delete Batch', actionClick: deleteBatchHandler }
                            ];

                            return <ActionButton arrayAction={arrayAction} />;
                        }
                    }
                ]
            }
        ],
        []
    );

    function refetchQueryCallback() {
        mainQuery.refetch();
    }

    const pageHandler = (selectedPageNumber: number) => {
        setPage(selectedPageNumber);
    };
    
    useEffect(() => {
        if (userPackage.length === 0 && page > 1) {
            setPage(page - 1);
        }
    }, [userPackage]);

    return (
        <>
            <div className="mt-5">
                <Row>
                    <Col>
                        <GroupTable columns={columns} data={userPackage} />
                        <FitnessAction ref={fitnessActionRef} callback={refetchQueryCallback} />
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
                            disabled={
                                totalRecords > page * 10 - 10 + userPackage.length ? false : true
                            }
                        >
                            Next
                        </Button>
                        <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
                            page * 10 - 10 + userPackage.length
                        }`}</span>
                    </Row>
                ) : null}
            </div>
            {
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={showDeleteModal}
                >
                    <Modal.Body>
                        <h4>Delete Batch</h4>
                        <p>Are you sure you want to delete this batch?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            onClick={() => {
                                setShowDeleteModal(false);
                            }}
                            variant="danger"
                        >
                            No
                        </Button>
                        <Button
                            onClick={() => {
                                handleDeleteBatch(tagId);
                                setShowDeleteModal(false);
                            }}
                            variant="success"
                        >
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
};

export default Group;
