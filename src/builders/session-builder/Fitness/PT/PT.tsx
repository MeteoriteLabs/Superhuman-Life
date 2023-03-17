import { useQuery } from "@apollo/client";
import { useContext, useMemo, useRef, useState } from "react";
import { Badge, Row, Col, Form } from "react-bootstrap";
import AuthContext from "../../../../context/auth-context";
import PTTable from "../../../../components/table/PtTable/PTTable";
import { GET_SESSIONS_FROM_TAGS_FOR_ONE_ON_ONE_OR_ON_DEMAND } from "../../graphQL/queries";
import moment from "moment";
import ActionButton from "../../../../components/actionbutton";
import FitnessAction from "../FitnessAction";
import { flattenObj } from "../../../../components/utils/responseFlatten";

export default function PT() {
  const auth = useContext(AuthContext);
  const [userPackage, setUserPackage] = useState<any>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const fitnessActionRef = useRef<any>(null);

  const mainQuery = useQuery(
    GET_SESSIONS_FROM_TAGS_FOR_ONE_ON_ONE_OR_ON_DEMAND,
    {
      variables: {
        id: auth.userid,
      },
      onCompleted: (data) => {
        loadData(data);
      },
      fetchPolicy: "no-cache",
    }
  );

  const loadData = (data) => {
    const flattenData = flattenObj({ ...data });
    
    setUserPackage(
      [...flattenData.tags].map((packageItem) => {
        let renewDay: any = "";
        if (
          packageItem.client_packages &&
          packageItem.client_packages.length &&
          packageItem.client_packages[0].fitnesspackages &&
          packageItem.client_packages[0].fitnesspackages.length &&
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
            packageItem.client_packages[0].fitnesspackages.length
              ? packageItem.client_packages[0].fitnesspackages[0].id
              : null,
          packageName:
            packageItem.client_packages &&
            packageItem.client_packages.length &&
            packageItem.client_packages[0].fitnesspackages &&
            packageItem.client_packages[0].fitnesspackages.length
              ? packageItem.client_packages[0].fitnesspackages[0].packagename
              : null,
          duration:
            packageItem.client_packages &&
            packageItem.client_packages.length &&
            packageItem.client_packages[0].fitnesspackages &&
            packageItem.client_packages[0].fitnesspackages.length
              ? packageItem.client_packages[0].fitnesspackages[0].duration
              : null,
          effectiveDate:
            packageItem.client_packages &&
            packageItem.client_packages.length &&
            packageItem.client_packages[0].effective_date
              ? moment(packageItem.client_packages[0].effective_date).format(
                  "MMMM DD,YYYY"
                )
              : "N/A",
          packageStatus:
            packageItem.client_packages &&
            packageItem.client_packages.length &&
            packageItem.client_packages[0].fitnesspackages
              ? packageItem.client_packages[0].fitnesspackages.length &&
                packageItem.client_packages[0].fitnesspackages[0].Status
                ? "Active"
                : "Inactive"
              : null,
          packageRenewal: renewDay
            ? moment(renewDay).format("MMMM DD,YYYY")
            : "N/A",

          client:
            packageItem.client_packages && packageItem.client_packages.length
              ? packageItem.client_packages[0].users_permissions_user.username
              : null,
          clientId:
            packageItem.client_packages && packageItem.client_packages.length
              ? packageItem.client_packages[0].users_permissions_user.id
              : null,
          programName: packageItem.tag_name,
          programStatus: handleStatus(
            packageItem.sessions,
            packageItem.client_packages && packageItem.client_packages.length
              ? packageItem.client_packages[0].effective_date
              : null,
            renewDay
          ),
          programRenewal: calculateProgramRenewal(
            packageItem.sessions,
            packageItem.client_packages && packageItem.client_packages.length
              ? packageItem.client_packages[0].effective_date
              : null
          ),
        };
      })
    );
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

  function calculateProgramRenewal(sessions: any, effectiveDate: any) {
    let max: number = 0;
    for (var i = 0; i < sessions.length; i++) {
      if (sessions[i].day_of_program > max) {
        max = sessions[i].day_of_program;
      }
    }

    return moment(effectiveDate).add(max, "days").format("MMMM DD,YYYY");
  }

  function handleRedirect(id: any) {
    if (id === null) {
      alert("Please assign a program to this client first");
      return;
    }
    window.location.href = `/pt/session/scheduler/${id}`;
  }

  function handleBadgeRender(val: any) {
    if (val === "Not_Assigned") {
      return (
        <Badge
          className="px-3 py-1"
          style={{ fontSize: "1rem", borderRadius: "10px" }}
          variant="danger"
        >
          {val}
        </Badge>
      );
    } else if (val === "Almost Ending") {
      return (
        <Badge
          className="px-3 py-1"
          style={{ fontSize: "1rem", borderRadius: "10px" }}
          variant="warning"
        >
          {val}
        </Badge>
      );
    } else if (val === "Assigned") {
      return (
        <Badge
          className="px-3 py-1"
          style={{ fontSize: "1rem", borderRadius: "10px" }}
          variant="success"
        >
          {val}
        </Badge>
      );
    } else if (val === "Completed") {
      return (
        <Badge
          style={{
            padding: "0.8rem 3rem",
            borderRadius: "10px",
            fontSize: "1rem",
          }}
          variant="info"
        >
          {val}
        </Badge>
      );
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: "Package",
        columns: [
          {
            accessor: "client",
            Header: "Client",
          },

          { accessor: "packageName", Header: "Name", enableRowSpan: true },
          {
            accessor: "effectiveDate",
            Header: "Effective Date",
            enableRowSpan: true,
          },
          {
            accessor: "packageRenewal",
            Header: "Renewal Date",
            enableRowSpan: true,
          },
        ],
      },
      {
        Header: "Class Details",
        columns: [
          { accessor: "programName", Header: "Class Name" },
          {
            accessor: "programStatus",
            Header: "Status",
            Cell: (row: any) => {
              return <>{handleBadgeRender(row.value)}</>;
            },
          },
          { accessor: "programRenewal", Header: "Last Session Date" },
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
                  type: "One-On-One",
                  rowData: row.original,
                });
              };

              const arrayAction = [
                { actionName: "Manage", actionClick: manageHandler },
                { actionName: "Details", actionClick: detailsHandler },
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
    
    setUserPackage(
      [...flattenData.tags].map((packageItem) => {
        let renewDay: any = "";
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
          packageName:
            packageItem.client_packages[0].fitnesspackages[0].packagename,
          duration: packageItem.client_packages[0].fitnesspackages[0].duration,
          effectiveDate: moment(
            packageItem.client_packages[0].effective_date
          ).format("MMMM DD,YYYY"),
          packageStatus: packageItem.client_packages[0].fitnesspackages[0]
            .Status
            ? "Active"
            : "Inactive",
          packageRenewal: moment(renewDay).format("MMMM DD,YYYY"),

          client:
            packageItem.client_packages[0].users_permissions_user.username,
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
          ),
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
      <Row>
        <div className="mb-3">
          <Form>
            <Form.Check
              type="switch"
              id="custom-switch"
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
          <PTTable columns={columns} data={userPackage} />
          <FitnessAction ref={fitnessActionRef} />
        </Col>
      </Row>
    </div>
  );
}
