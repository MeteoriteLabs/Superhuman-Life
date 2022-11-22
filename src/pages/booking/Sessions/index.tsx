import { useMemo, useState, useContext } from "react";
import {
  Badge,
  Button,
  TabContent,
  InputGroup,
  FormControl,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Table from "../../../components/table/leads-table";
import ActionButton from "../../../components/actionbutton/index";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GET_ALL_TAGS, GET_TAGS, GET_ALL_CLIENTS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
// import moment from "moment";
import { useHistory } from "react-router-dom";

export default function Sessions() {
  const auth = useContext(AuthContext);

  const columns = useMemo<any>(
    () => [
      { accessor: "name", Header: "Name" },
      { accessor: "offering", Header: "Offering" },
      { accessor: "program", Header: "Program" },
      { accessor: "type", Header: "Type" },
      { accessor: "sessionDate", Header: "Session Date" },
      { accessor: "sessionTime", Header: "Session Time" },
      {
        accessor: "status",
        Header: "Status",
        Cell: ({ row }: any) => {
          let statusColor = "";
          switch (row.values.status) {
            case "Booked":
              statusColor = "success";
              break;

            case "Attended":
              statusColor = "primary";
              break;

            case "Rescheduled":
              statusColor = "info";
              break;

            case "Canceled":
              statusColor = "secondary";
              break;

            case "Rejected":
              statusColor = "danger";
              break;
          }
          return (
            <>
              <Badge
                className="px-3 py-1"
                style={{ fontSize: "1rem", borderRadius: "10px" }}
                variant={statusColor}
              >
                {row.values.status}
              </Badge>
            </>
          );
        },
      },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const history = useHistory();
          const routeChange = () => {
            let path = `clients`;
            history.push(path);
          };

          const arrayAction = [
            {
              actionName: "Reschedule",
              actionClick: routeChange,
            },
            {
              actionName: "Cancel",
              actionClick: routeChange,
            },
            {
              actionName: "Manage Program",
              actionClick: routeChange,
            },
            {
              actionName: "Go to client",
              actionClick: routeChange,
            },
          ];

          const arrayActionForCancelledAndAttended = [
            {
              actionName: "Manage Program",
              actionClick: routeChange,
            },
            {
              actionName: "Go to client",
              actionClick: routeChange,
            },
          ];

          return (
            <ActionButton
              arrayAction={
                row.values.status === "Canceled" ||
                row.values.status === "Attended"
                  ? arrayActionForCancelledAndAttended
                  : arrayAction
              }
            ></ActionButton>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [datatable, setDataTable] = useState<{}[]>([]);

  // const { data: get_tags } = useQuery(GET_ALL_TAGS, {
  //   variables: {
  //     id: Number(auth.userid),
  //   },
  //   onCompleted: (data) => {
  //     loadData(data);
  //     console.log(data)
  //   },
  // });

  const [
    getTags,
    {
      data: get_tags,
    },
  ] = useLazyQuery(GET_TAGS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      // calling fetch changemaker's useLazyQuery function
      loadData(data);
    },
  });

  const { data: get_clients } = useQuery(GET_ALL_CLIENTS, {
    variables: {
      id: Number(auth.userid),
    },
    onCompleted: (data) => {
      const flattenClientsData = flattenObj({ ...data.clientPackages });
      console.log(flattenClientsData)
      getTags()
      // loadData(flattenClientsData);
    },
  });

  function loadData(data: any) {
    // const flattenTagsData = flattenObj({ ...get_tags });
    console.log(data);
    setDataTable(
      [...data
      ].flatMap((Detail) => {
        return {
          id: Detail.fitnesspackages[0].id,
          name: Detail.fitnesspackages[0].users_permissions_user.username,
          // program: Detail.tag_name,
          offering: Detail.fitnesspackages[0].packagename,
          status: "Canceled",
        };
      })
    );
  }

  return (
    <TabContent>
      <Container className="mt-3">
        <Row>
          <Col lg={3}>
            <InputGroup className="mb-3 mt-3">
              <FormControl
                aria-describedby="basic-addon1"
                placeholder="Search"
                // ref={searchInput}
              />
              <InputGroup.Prepend>
                <Button
                  variant="outline-secondary"
                  onClick={(e: any) => {
                    e.preventDefault();
                  }}
                >
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup.Prepend>
            </InputGroup>
          </Col>
        </Row>
      </Container>
      <Table columns={columns} data={datatable} />
    </TabContent>
  );
}
