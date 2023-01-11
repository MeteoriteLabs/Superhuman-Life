import { useQuery } from "@apollo/client";
import { useContext, useMemo, useRef, useState } from "react";
import { Badge, Row, Col, Form } from "react-bootstrap";
import Table from "../../../../components/table";
import AuthContext from "../../../../context/auth-context";
import { GET_TAGS_FOR_CLASSIC } from "../../graphQL/queries";
import FitnessAction from "../FitnessAction";
import ActionButton from "../../../../components/actionbutton";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import moment from "moment";

export default function Classic(props) {
  const auth = useContext(AuthContext);
  const [userPackage, setUserPackage] = useState<any>([]);
  const [showHistory, setShowHistory] = useState(false);
  const fitnessActionRef = useRef<any>(null);

  const mainQuery = useQuery(GET_TAGS_FOR_CLASSIC, {
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
          expiry: moment(packageItem?.fitnesspackage?.expiry_date).format(
            "MMMM DD,YYYY"
          ),
          programName: packageItem.tag_name ? packageItem.tag_name : "N/A",
        };
      }),
    ]);
  };

  function handleRedirect(id: any) {
    window.location.href = `/classic/session/scheduler/${id}`;
  }

  const columns = useMemo(
    () => [
      {
        Header: "Package",
        columns: [
          { accessor: "packageName", Header: "Name", enableRowSpan: true },
          { accessor: "duration", Header: "Duration" },
          { accessor: "expiry", Header: "Expiry" },
        ],
      },

      { accessor: " ", Header: "" },

      {
        Header: "Class Details",
        columns: [
          { accessor: "programName", Header: "Class Name" },
          {
            accessor: "client",
            Header: "Client",
          },
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
          expiry: moment(packageItem?.fitnesspackage?.expiry_date).format(
            "MMMM DD,YYYY"
          ),
          programName: packageItem.tag_name ? packageItem.tag_name : "N/A",
        };
      }),
    ]);
  }

  if (!showHistory) {
    if (userPackage.length > 0) {
      userPackage.filter((item: any, index: any) =>
        moment(item.expiry).isBefore(moment()) === true
          ? userPackage.splice(index, 1)
          : null
      );
    }
  }

  return (
    <div className="mt-5">
      <Row>
        <div className="mb-3">
          <Form style={{ marginLeft: "10px" }}>
            <Form.Check
              type="switch"
              id="custom-switch4"
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
          <Table columns={columns} data={userPackage} />
          <FitnessAction ref={fitnessActionRef} />
        </Col>
      </Row>
    </div>
  );
}
