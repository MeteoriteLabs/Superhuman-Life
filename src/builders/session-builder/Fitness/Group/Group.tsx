/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, useMutation } from "@apollo/client";
import { useContext, useMemo, useRef, useState } from "react";
import { Badge, Row, Col, Form, Button, Modal } from "react-bootstrap";

import AuthContext from "../../../../context/auth-context";
import GroupTable from "../../../../components/table/GroupTable/GroupTable";
import {
  GET_ALL_FITNESS_PACKAGE_BY_TYPE,
  GET_ALL_CLIENT_PACKAGE,
  GET_TAGS_FOR_GROUP,
} from "../../graphQL/queries";
import { UPDATE_STARTDATE, DELETE_TAG_BATCH } from "../../graphQL/mutation";
import moment from "moment";
import ActionButton from "../../../../components/actionbutton";
import FitnessAction from "../FitnessAction";
import { flattenObj } from "../../../../components/utils/responseFlatten";

export default function Group(props) {
  const auth = useContext(AuthContext);

  const [userPackage, setUserPackage] = useState<any>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagId, setTagId] = useState("");
  const fitnessActionRef = useRef<any>(null);

  const [deleteBatch] = useMutation(DELETE_TAG_BATCH, {
    onCompleted: (r: any) => {
      mainQuery.refetch();
    },
  });
  const [updateDate] = useMutation(UPDATE_STARTDATE, {
    onCompleted: (r: any) => {},
  });

  const mainQuery = useQuery(GET_TAGS_FOR_GROUP, {
    variables: {
      id: auth.userid,
    },
    onCompleted: (r: any) => loadData(r),
  });

  const { data: data1 } = useQuery(GET_ALL_FITNESS_PACKAGE_BY_TYPE, {
    variables: {
      id: auth.userid,
      type: "Group Class",
    },
  });

  // const { data: data2 } = useQuery(GET_ALL_PROGRAM_BY_TYPE, {
  //     variables: {
  //         id: auth.userid,
  //         type: 'Group Class'
  //     },

  // });

  const { data: data3 } = useQuery(GET_ALL_CLIENT_PACKAGE, {
    variables: {
      id: auth.userid,
      type: "Group Class",
    },
    // onCompleted: (data) => loadData()
  });

  const loadData = (data: any) => {
    // let arrayFitnessPackage: any[] = [];
    // let arrayData: any[] = [];

    // const flattenData1 = flattenObj({...data1});
    // const flattenData2 = flattenObj({...data2});
    // const flattenData3 = flattenObj({...data3});

    // let fitnessProgramItem: any = {};
    // for (let i = 0; i < flattenData1?.fitnesspackages.length; i++) {
    //     for (let j = 0; j < flattenData2?.programManagers?.length; j++) {
    //         if (flattenData1.fitnesspackages[i].id === flattenData2.programManagers[j].fitnesspackages[0].id) {
    //             fitnessProgramItem.proManagerFitnessId = flattenData2.programManagers[j].fitnessprograms[0].id;
    //             fitnessProgramItem.title = flattenData2.programManagers[j].fitnessprograms[0].title;
    //             fitnessProgramItem.start_dt = flattenData2.programManagers[j].fitnessprograms[0].start_dt;
    //             fitnessProgramItem.renewal_dt = flattenData2.programManagers[j].fitnessprograms[0].renewal_dt;
    //             fitnessProgramItem.published_at = flattenData2.programManagers[j].fitnessprograms[0].published_at
    //             fitnessProgramItem.proManagerId = flattenData2.programManagers[j].id;

    //             arrayData.push({ ...flattenData1.fitnesspackages[i], ...fitnessProgramItem });
    //         }
    //     }
    // }

    // let arrayA = arrayData.map(item => item.id);

    // const filterPackage = flattenData1?.fitnesspackages.filter((item: { id: string; }) => !arrayA.includes(item.id));
    // filterPackage.forEach(item => {
    //     arrayData.push(item)
    // })

    // for (let i = 0; i < arrayData.length; i++) {
    //     for (let j = 0; j < flattenData3.clientPackages?.length; j++) {
    //         if (flattenData3.clientPackages[j].program_managers.length > 0) {
    //             if (arrayData[i].proManagerFitnessId === flattenData3.clientPackages[j].program_managers[0].fitnessprograms[0].id) {
    //                 arrayFitnessPackage.push({ ...arrayData[i], ...flattenData3.clientPackages[j].users_permissions_user });
    //             } else {
    //                 arrayFitnessPackage.push(arrayData[i]);
    //                 break;
    //             }
    //         }
    //     }
    // }

    const flattenData = flattenObj({ ...data });

    function handleUsers(data: any) {
      let clients: any = [];
      for (var i = 0; i < data.length; i++) {
        clients.push(data[i].users_permissions_user.username);
      }
      // packageItem.client_packages[index]?.users_permissions_user
      return clients;
    }

    setUserPackage([
      ...flattenData.tags.map((packageItem, index) => {
        let renewDay: any = "";
        if (
          packageItem.client_packages[index]?.fitnesspackages[0].length !== 0
        ) {
          renewDay = new Date(
            packageItem.client_packages[index]?.effective_date
          );
          renewDay.setDate(
            renewDay.getDate() +
              packageItem.client_packages[index]?.fitnesspackages[0].duration
          );
        }
        return {
          tagId: packageItem.id,
          id: packageItem?.fitnesspackage?.id,
          packageName: packageItem.fitnesspackage.packagename,
          duration:
            packageItem.client_packages[index]?.fitnesspackages[0].duration,
          expiry: moment(
            packageItem?.fitnesspackage?.expiry_date,
            "YYYY-MM-DDTHH:mm"
          ).format("MMMM DD, YYYY"),
          packageStatus: packageItem.fitnesspackage.Status
            ? "Active"
            : "Inactive",

          // proManagerId: packageItem.proManagerId,
          // proManagerFitnessId: packageItem.proManagerFitnessId,
          client: packageItem.client_packages[index]?.users_permissions_user
            .username
            ? handleUsers(packageItem.client_packages)
            : "N/A",
          // start_dt: packageItem.effective_date,
          // renewal_dt: packageItem.renewal_dt,
          // time: packageItem.published_at ? moment(packageItem.published_at).format('h:mm:ss a') : "N/A",
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
            : "N/A",
        };
      }),
    ]);
  };

  function handleStatus(sessions: any, effective_date: any, renewDay) {
    let effectiveDate: any;
    if (sessions.length === 0) {
      return "Not_Assigned";
    } else if (sessions.length > 0) {
      let max: number = 0;
      for (var i = 0; i < sessions.length; i++) {
        if (sessions[i].day_of_program > max) {
          max = sessions[i].day_of_program;
        }
      }
      effectiveDate = moment(effective_date)
        .add(max, "days")
        .format("MMMM DD,YYYY");
      if (
        moment(effectiveDate).isBetween(
          moment(),
          moment().subtract(5, "months")
        )
      ) {
        return "Almost Ending";
      } else {
        return "Assigned";
      }
    } else {
      if (moment(effectiveDate) === moment(renewDay)) {
        return "Completed";
      }
    }
  }

  function calculateProgramRenewal(effective_date, sessions) {
    let max: number = 0;

    for (var i = 0; i < sessions?.length; i++) {
      if (sessions[i].day_of_program > max) {
        max = sessions[i].day_of_program;
      }
    }

    return moment(effective_date).add(max, "days").format("MMMM DD,YYYY");
    // const dates: string[] = [];

    // for(var i=0; i<duration; i++){
    //     const t = moment(effectiveDate).add(i, 'days').format("MMMM DD,YYYY");
    //     dates.push(t);
    // }
    // return dates[renewalDate-1];
  }

  let arr: any = [];
  // for (let i = 0; i < userPackage.length - 1; i++) {
  //     if (userPackage[i].id === userPackage[i + 1].id) {
  //         if (userPackage[i].proManagerFitnessId === userPackage[i + 1].proManagerFitnessId) {
  //             if (typeof userPackage[i].client === "string") {
  //                 arr[0] = userPackage[i].client;
  //             };
  //             arr.push(userPackage[i + 1].client);
  //             userPackage[i + 1].client = arr
  //             userPackage.splice(i, 1);
  //             i--;
  //         }
  //     }
  // }

  function handleRedirect(id: any) {
    // if(value === undefined){
    //     alert("Please assign client to this program")
    //     return;
    // }
    // if (startDate === null){
    //     let sdate = moment();
    //     let edate = moment(sdate).add(duration, 'days');

    //     updateDate({
    //         variables: {
    //             id: id,
    //             startDate: moment(sdate).format("YYYY-MM-DD"),
    //             endDate: moment(edate).format("YYYY-MM-DD")
    //         }
    //     });
    // }

    window.location.href = `/group/session/scheduler/${id}`;
  }

  function handleHistoryPackage(data: any) {
    const flattenData = flattenObj({ ...data });
    function handleUsers(data: any) {
      let clients: any = [];
      for (var i = 0; i < data.length; i++) {
        clients.push(data[i].users_permissions_user.username);
      }
      // packageItem.client_packages[index]?.users_permissions_user
      return clients;
    }

    setUserPackage([
      ...flattenData.tags.map((packageItem, index) => {
        let renewDay: any = "";
        if (
          packageItem.client_packages[index]?.fitnesspackages[0].length !== 0
        ) {
          renewDay = new Date(
            packageItem.client_packages[index]?.effective_date
          );
          renewDay.setDate(
            renewDay.getDate() +
              packageItem.client_packages[index]?.fitnesspackages[0].duration
          );
        }
        return {
          tagId: packageItem.id,
          id: packageItem.fitnesspackage?.id,
          packageName: packageItem.fitnesspackage.packagename,
          duration:
            packageItem.client_packages[index]?.fitnesspackages[0].duration,
          expiry: moment(
            packageItem?.fitnesspackage?.expiry_date,
            "YYYY-MM-DDTHH:mm"
          ).format("MMMM DD, YYYY"),
          packageStatus: packageItem.fitnesspackage.Status
            ? "Active"
            : "Inactive",

          // proManagerId: packageItem.proManagerId,
          // proManagerFitnessId: packageItem.proManagerFitnessId,
          clientData: packageItem.client_packages,
          client: packageItem.client_packages[index]?.users_permissions_user
            .username
            ? handleUsers(packageItem.client_packages)
            : "N/A",
          // start_dt: packageItem.effective_date,
          // renewal_dt: packageItem.renewal_dt,
          // time: packageItem.published_at ? moment(packageItem.published_at).format('h:mm:ss a') : "N/A",
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
            : "N/A",
        };
      }),
    ]);
  }

  function handleDeleteBatch(tagId: string) {
    deleteBatch({
      variables: {
        id: tagId,
      },
    });
  }

  const columns = useMemo(
    () => [
      {
        Header: "Package",
        columns: [
          { accessor: "packageName", Header: "Name", enableRowSpan: true },
          { accessor: "expiry", Header: "Expiry", enableRowSpan: true },
          {
            accessor: "packageStatus",
            Header: "Status",
            Cell: (row: any) => {
              return (
                <>
                  {row.value === "Active" ? (
                    <Badge
                      className="px-3 py-1"
                      style={{ fontSize: "1rem", borderRadius: "10px" }}
                      variant="success"
                    >
                      {row.value}
                    </Badge>
                  ) : (
                    <Badge
                      className="px-3 py-1"
                      style={{ fontSize: "1rem", borderRadius: "10px" }}
                      variant="danger"
                    >
                      {row.value}
                    </Badge>
                  )}
                </>
              );
            },
            enableRowSpan: true,
          },
          {
            accessor: "action",
            Header: "Action",
            enableRowSpan: true,
            Cell: (row: any) => {
              return (
                <>
                  <Button
                    variant="info"
                    size="sm"
                    className="text-nowrap"
                    onClick={() => {
                      fitnessActionRef.current.TriggerForm({
                        id: row.row.original.id,
                        actionType: "create",
                        type: "Group Class",
                        duration: row.row.original.duration,
                      });
                    }}
                  >
                    Add new
                  </Button>
                </>
              );
            },
          },
        ],
      },
      { accessor: " ", Header: "" },

      {
        Header: "Class Details",
        columns: [
          {
            accessor: "client",
            Header: "Client",
          },
          { accessor: "programName", Header: "Class Name" },
          {
            accessor: "programStatus",
            Header: "Status",
            Cell: (row: any) => {
              return (
                <>
                  {row.value === "Assigned" ? (
                    <Badge
                      className="px-3 py-1"
                      style={{ fontSize: "1rem", borderRadius: "10px" }}
                      variant="success"
                    >
                      {row.value}
                    </Badge>
                  ) : (
                    <Badge
                      className="px-3 py-1"
                      style={{ fontSize: "1rem", borderRadius: "10px" }}
                      variant="danger"
                    >
                      {row.value}
                    </Badge>
                  )}
                </>
              );
            },
          },
          { accessor: "renewal", Header: "Last Session Date" },
          {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => {
              const manageHandler = () => {
                handleRedirect(row.original.tagId);
              };
              const detailsHandler = () => {
                fitnessActionRef.current.TriggerForm({
                  id: row.original.id,
                  actionType: "details",
                  type: "Group Class",
                  rowData: row.original,
                });
              };

              const allClientHandler = () => {
                fitnessActionRef.current.TriggerForm({
                  id: row.original.tagId,
                  actionType: "allClients",
                  type: "Group Class",
                  rowData: row.original,
                });
              };

              const deleteBatchHandler = () => {
                if (row.original.client === "N/A") {
                  setTagId(row.original.tagId);
                  setShowDeleteModal(true);
                }
              };

              const arrayAction = [
                { actionName: "Manage", actionClick: manageHandler },
                { actionName: "Details", actionClick: detailsHandler },
                { actionName: "All Clients", actionClick: allClientHandler },
                { actionName: "Delete Batch", actionClick: deleteBatchHandler },
              ];

              return <ActionButton arrayAction={arrayAction} />;
            },
          },
        ],
      },
    ],
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (!showHistory) {
    if (userPackage.length > 0) {
      userPackage.filter((item: any, index: any) =>
        moment(item.expiry).isBefore(moment()) === true
          ? userPackage.splice(index, 1)
          : null
      );
    }
  }

  function refetchQueryCallback() {
    mainQuery.refetch();
  }

  return (
    <>
      <div className="mt-5">
        <Row>
          <div className="mb-3">
            <Form>
              <Form.Check
                type="switch"
                id="custom-switch3"
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
        </Row>
        <Row>
          <Col>
            <GroupTable columns={columns} data={userPackage} />
            <FitnessAction
              ref={fitnessActionRef}
              callback={refetchQueryCallback}
            />
          </Col>
        </Row>
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
}
