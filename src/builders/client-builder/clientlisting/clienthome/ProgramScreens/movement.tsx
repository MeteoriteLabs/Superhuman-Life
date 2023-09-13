import ActionButton from '../../../../../components/actionbutton/index';
import { useMemo, useState, useContext } from 'react';
import { useQuery } from '@apollo/client';
import { Badge } from 'react-bootstrap';
import ClientTable from '../../../../../components/table/client-table';
import { GET_CLIENT_DATA_NEW } from '../../queries';
import AuthContext from '../../../../../context/auth-context';
import { flattenObj } from '../../../../../components/utils/responseFlatten';

function Movement() {
    const last = window.location.pathname.split('/').pop();
    const auth = useContext(AuthContext);
    function getDate(time: any) {
        const dateObj = new Date(time);
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        const date = dateObj.getDate();

        return `${date}/${month}/${year}`;
    }
    function getRenewalDate(time: any, duration: any) {
        const date = new Date(time);
        date.setDate(date.getDate() + duration);
        return getDate(date);
    }
    function compareDates(time: any) {
        const date = new Date(time);
        const currentdate = new Date();
        if (date.getTime() < currentdate.getTime()) {
            return true;
        }
        return false;
    }
    const columns = useMemo<any>(
        () => [
            {
                Header: 'Package',
                columns: [
                    {
                        Header: 'Type',
                        accessor: 'packagetype',
                        Cell: (row: any) => {
                            return (
                                <>
                                    {row.value === 'One-On-One' ? (
                                        <img src="/assets/PTtype.svg" alt="PT" />
                                    ) : (
                                        ''
                                    )}
                                    {row.value === 'Group Class' ? (
                                        <img src="/assets/Grouptype.svg" alt="Group" />
                                    ) : (
                                        ''
                                    )}
                                    {row.value === 'Custom Fitness' ? (
                                        <img src="/assets/Customtype.svg" alt="Custom" />
                                    ) : (
                                        ''
                                    )}
                                    {row.value === 'Classic Class' ? (
                                        <img src="/assets/Classictype.svg" alt="Classic" />
                                    ) : (
                                        ''
                                    )}
                                    {row.value === 'Cohort' ? (
                                        <img src="/assets/cohort.svg" alt="Cohort" />
                                    ) : (
                                        ''
                                    )}
                                    {row.value === 'On-Demand PT' ? (
                                        <img src="/assets/pt.svg" alt="OnDemand" />
                                    ) : (
                                        ''
                                    )}
                                    {row.value === 'Live Stream Channel' ? (
                                        <img src="/assets/livestream.svg" alt="Live Stream" />
                                    ) : (
                                        ''
                                    )}
                                    {row.value === 'Event' ? (
                                        <img src="/assets/event-1.jpeg" alt="Event" />
                                    ) : (
                                        ''
                                    )}
                                </>
                            );
                        }
                    },
                    {
                        Header: 'Name',
                        accessor: 'packagename'
                    },
                    {
                        Header: 'Effective Date',
                        accessor: 'packagedate'
                    },
                    {
                        Header: 'Renewal Date',
                        accessor: 'packagerenewdate'
                    }
                ]
            },
            {
                Header: 'Program',
                columns: [
                    {
                        Header: 'Name',
                        accessor: 'programname'
                    },
                    {
                        Header: 'Renewal',
                        accessor: 'programrenewal'
                    },
                    {
                        Header: 'Status',
                        accessor: 'programstatus',
                        Cell: (v: any) => (
                            <Badge
                                className="p-2"
                                variant={v.value === 'Assigned' ? 'success' : 'danger'}
                            >
                                {v.value}
                            </Badge>
                        )
                    },
                    // {
                    //      id: "edit",
                    //      Header: "Action",
                    //      accessor: "action",
                    //      Cell: ({ row }: any) => <ActionButton action1="Manage" actionClick1={() => {}} />,
                    // },
                    {
                        id: 'edit',
                        Header: 'Actions',
                        Cell: ({ row }: any) => {
                            const actionClick1 = () => {
                                //handleRedirect(row.original.id);
                            };
                            const arrayAction = [
                                { actionName: 'Manage', actionClick: actionClick1 }
                            ];

                            return <ActionButton arrayAction={arrayAction}></ActionButton>;
                        }
                    }
                ]
            }
        ],
        []
    );

    const [dataActivetable, setActiveDataTable] = useState<Record<string, unknown>[]>([]);
    const [dataHistorytable, setHistoryDataTable] = useState<Record<string, unknown>[]>([]);

    function FetchData(_variables: Record<string, unknown> = { id: auth.userid, clientid: last }) {
        useQuery(GET_CLIENT_DATA_NEW, { variables: _variables, onCompleted: loadData });
    }

    function loadData(data: any) {
        const flattenData = flattenObj({ ...data });

        flattenData.clientPackages ? 
        setHistoryDataTable(
            [...flattenData.clientPackages].flatMap((Detail) =>
                !compareDates(getRenewalDate(Detail.effective_date, Detail.package_duration))
                    ? {
                       
                        id: Detail.fitnesspackages[0].users_permissions_user.id,

                        packagetype: Detail && Detail.fitnesspackages && Detail.fitnesspackages.length  && Detail.fitnesspackages[0].fitness_package_type ? Detail.fitnesspackages[0].fitness_package_type.type : null,


                        packagedate: getDate(Date.parse(Detail.effective_date)),
                        packagename:
                            Detail && Detail.fitnesspackages && Detail.fitnesspackages.length
                                ? Detail.fitnesspackages[0].packagename
                                : null,

                        packagerenewdate: getRenewalDate(
                            Detail.effective_date,
                            Detail.package_duration
                        ),

                        programname: Detail && Detail.fitnesspackages && Detail.fitnesspackages.length
                                ? Detail.fitnesspackages[0].__typename
                                : null,
                        programrenewal:
                           getRenewalDate(Detail.effective_date, Detail.package_duration),
                          

                        programstatus: Detail && Detail.fitnesspackages && Detail.fitnesspackages.length
                        ? Detail.fitnesspackages[0].Status.toString()
                        : null,

                      }
                    : []
            )
        ) : null;


        flattenData.clientPackages ? 
        setActiveDataTable(
            [...flattenData.clientPackages].flatMap((Detail) =>
                !compareDates(getRenewalDate(Detail.effective_date, Detail.package_duration))
                    ? {
                          id: Detail.fitnesspackages[0].users_permissions_user.id,

                          packagetype: Detail && Detail.fitnesspackages && Detail.fitnesspackages.length  && Detail.fitnesspackages[0].fitness_package_type ? Detail.fitnesspackages[0].fitness_package_type.type : null,


                          packagedate: getDate(Date.parse(Detail.effective_date)),
                          packagename:
                              Detail && Detail.fitnesspackages && Detail.fitnesspackages.length
                                  ? Detail.fitnesspackages[0].packagename
                                  : null,

                          packagerenewdate: getRenewalDate(
                              Detail.effective_date,
                              Detail.package_duration
                          ),

                          programname: Detail && Detail.fitnesspackages && Detail.fitnesspackages.length
                                  ? Detail.fitnesspackages[0].__typename
                                  : null,
                          programrenewal:
                             getRenewalDate(Detail.effective_date, Detail.package_duration),
                            

                          programstatus: Detail && Detail.fitnesspackages && Detail.fitnesspackages.length
                          ? Detail.fitnesspackages[0].Status.toString()
                          : null,
                      }
                    : []
            )
        ) : null;
    }

    FetchData({ id: auth.userid, clientid: last });
    return (
        <div>
            <div>
                <div className="border rounded border-dark bg-secondary pt-1">
                    <h5 className="text-white font-weight-bold ml-3 p-1 ">Active</h5>
                </div>
                <ClientTable columns={columns} data={dataActivetable} />
            </div>
            <div>
                <div className="border rounded border-dark bg-secondary pt-1">
                    <h5 className="text-white font-weight-bold ml-3 p-1 ">History</h5>
                </div>
                <ClientTable columns={columns} data={dataHistorytable} />
            </div>
        </div>
    );
}

export default Movement;
