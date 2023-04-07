import { useQuery } from "@apollo/client";
import { useContext, useMemo, useRef, useState } from "react";
import { Badge, Row, Col, Form } from "react-bootstrap";
import Table from "../../../../components/table";
import AuthContext from "../../../../context/auth-context";
import { GET_TAGS_FOR_COHORT } from "../../graphQL/queries";
import FitnessAction from "../FitnessAction";
import ActionButton from "../../../../components/actionbutton";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import moment from "moment";

export default function Cohort() {
  const auth = useContext(AuthContext);
  const [userPackage, setUserPackage] = useState<any>([]);
  const [showHistory, setShowHistory] = useState(false);
  const fitnessActionRef = useRef<any>(null);

  const mainQuery = useQuery(GET_TAGS_FOR_COHORT, {
    variables: { id: auth.userid },
    onCompleted: (data) => loadData(data),
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
          start: moment(packageItem.fitnesspackage.Start_date).format(
            "MMM Do,YYYY"
          ),
          end: moment(packageItem.fitnesspackage.End_date).format(
            "MMM Do,YYYY"
          ),
          client:
            packageItem.client_packages.length > 0
              ? packageItem.client_packages.length
              : null,
          programName: packageItem.tag_name ? packageItem.tag_name : "N/A",
          programStatus:
            packageItem.fitnesspackage.Status === true ? "Assigned" : "N/A",
          renewal: calculateProgramRenewal(packageItem?.sessions),
        };
      }),
    ]);
  };

  const calculateProgramRenewal = (sessions) => {
    if (sessions.length === 0) {
      return "N/A";
    }

    const moments = sessions.map((d) => moment(d.session_date));
    const maxDate = moment.max(moments);

    return maxDate.format("MMM Do,YYYY");
  }

  const handleRedirect = (id: any) => {
    window.location.href = `/cohort/session/scheduler/${id}`;
  }

  const columns = useMemo(
    () => [
      {
        Header: "Cohort",
        columns: [
          { accessor: "packageName", Header: "Name" },
          { accessor: "start", Header: "Start" },
          { accessor: "end", Header: "End" },
        ],
      },

      { accessor: " ", Header: "" },

      {
        Header: "Program",
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
                  type: "Classic Class",
                  rowData: row.original,
                });
              };

              const clientsHandler = () => {
                fitnessActionRef.current.TriggerForm({
                  id: row.original.id,
                  actionType: "allClients",
                  type: "Classic Class",
                });
              };

              const arrayAction = [
                { actionName: "Manage", actionClick: manageHandler },
                { actionName: "Details", actionClick: detailsHandler },
                { actionName: "All Clients", actionClick: clientsHandler },
              ];
              return <ActionButton arrayAction={arrayAction}></ActionButton>;
            },
          },
        ],
      },
    ],
    []
  );

  function handleHistoryPackage(data: any) {
    const flattenData = flattenObj({ ...data });
    setUserPackage([
      ...flattenData.tags.map((packageItem) => {
        return {
          tagId: packageItem.id,
          id: packageItem.id,
          packageName: packageItem.fitnesspackage.packagename,
          duration: packageItem.fitnesspackage.duration,
          start: moment(packageItem.fitnesspackage.Start_date).format(
            "MMM Do,YYYY"
          ),
          end: moment(packageItem.fitnesspackage.End_date).format(
            "MMM Do,YYYY"
          ),
          client:
            packageItem.client_packages.length > 0
              ? packageItem.client_packages.length
              : null,
          programName: packageItem.tag_name ? packageItem.tag_name : "N/A",
          programStatus:
            packageItem.fitnesspackage.Status === true ? "Assigned" : "N/A",
          renewal: calculateProgramRenewal(packageItem.sessions),
        };
      }),
    ]);
  }

  if (!showHistory) {
    if (userPackage.length > 0) {
      userPackage.filter((item: any, index: any) =>
        moment(item.end, "MMM Do,YYYY").isBefore(moment()) === true
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
            id="switchEnabled2"
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
          <FitnessAction ref={fitnessActionRef} callback={mainQuery}/>
        </Col>
      </Row>
    </div>
  );
}
