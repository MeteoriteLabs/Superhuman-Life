import { useMemo, useState, useRef, useContext, useEffect } from "react";
import {
  Badge,
  Button,
  TabContent,
  InputGroup,
  FormControl,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Table from "../../../components/table/leads-table";
import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton/index";
import CreateEditMessage from "./createoredit-leads";
import { GET_LEADS_NEW, UPDATE_SEEN_NEW } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";

export default function Leads() {
  const auth = useContext(AuthContext);
  const [searchFilter, setSearchFilter] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [nameArr, setNameArr] = useState<any>([]);
  const searchInput = useRef<any>();
  const createEditMessageComponent = useRef<any>(null);

  const [updateSeenStatus] = useMutation(UPDATE_SEEN_NEW, {
    onCompleted: (e: any) => {
      fetch.refetch();
    },
  });

  const columns = useMemo<any>(
    () => [
      { accessor: "leadsdate", Header: "Leads Date" },
      { accessor: "name", Header: "Name" },
      { accessor: "number", Header: "Number" },
      { accessor: "email", Header: "Email" },
      {
        accessor: "isseen",
        Header: "Is Read",
        Cell: (v: any) => (
          <Badge
            className="px-3 py-1"
            style={{ fontSize: "1rem", borderRadius: "10px" }}
            variant={v.value ? "success" : "danger"}
          >
            {v.value ? "Read" : "Unread"}
          </Badge>
        ),
      },
      {
        accessor: "source",
        Header: "Source",
        Cell: (v: any) => (
          <Badge
            className="px-3 py-1"
            style={{ fontSize: "1rem", borderRadius: "10px" }}
            variant="secondary"
          >
            {v.value}
          </Badge>
        ),
      },
      { accessor: "lastupdated", Header: "Last Updated" },
      {
        accessor: "status",
        Header: "Status",
        Cell: (v: any) => (
          <Badge
            className="px-3 py-1"
            style={{ fontSize: "1rem", borderRadius: "10px" }}
            variant="secondary"
          >
            {v.value}
          </Badge>
        ),
      },

      //    {
      //         id: "edit",
      //         Header: "Actions",
      //         Cell: ({ row }: any) => (
      //              <ActionButton
      //                   action1="Edit"
      //                   actionClick1={() => {
      //                        createEditMessageComponent.current.TriggerForm({
      //                             id: row.original.id,
      //                             type: "edit",
      //                        });
      //                   }}
      //                   action2="View"
      //                   actionClick2={() => {
      //                        createEditMessageComponent.current.TriggerForm({
      //                             id: row.original.id,
      //                             type: "view",
      //                        });
      //                   }}
      //                   action3="Delete"
      //                   actionClick3={() => {
      //                        createEditMessageComponent.current.TriggerForm({
      //                             id: row.original.id,
      //                             type: "delete",
      //                        });
      //                   }}
      //              />
      //         ),
      //    },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const editHandler = () => {
            createEditMessageComponent.current.TriggerForm({
              id: row.original.id,
              type: "edit",
            });
          };
          const viewHandler = () => {
            createEditMessageComponent.current.TriggerForm({
              id: row.original.id,
              type: "view",
            });
          };
          const deleteHandler = () => {
            createEditMessageComponent.current.TriggerForm({
              id: row.original.id,
              type: "delete",
            });
          };

          const markAsUnreadHandler = () => {
            updateSeenStatus({
              variables: {
                seen: false,
                id: row.original.id,
              },
            });
          };

          const markAsReadHandler = () => {
            updateSeenStatus({
              variables: {
                seen: true,
                id: row.original.id,
              },
            });
          };

          const arrayAction = [
            { actionName: "Edit", actionClick: editHandler },
            { actionName: "View", actionClick: viewHandler },
            { actionName: "Mark as Unread", actionClick: markAsUnreadHandler },
            { actionName: "Mark as Read", actionClick: markAsReadHandler },
            { actionName: "Delete", actionClick: deleteHandler },
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    []
  );

  function getDate(time: any) {
    const dateObj = new Date(time);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const date = dateObj.getDate();

    return `${date}/${month}/${year}`;
  }

  const [datatable, setDataTable] = useState<Record<string, unknown>[]>([]);

  const fetch = useQuery(GET_LEADS_NEW, {
    variables: { filter: searchFilter, id: auth.userid },
    onCompleted: loadData,
  });

  function refetchQueryCallback() {
    fetch.refetch();
  }

  function loadData(data: any) {
    const namearr: any = [];
    const flattenData = flattenObj({ ...data });
    setData([...flattenData.websiteContactForms]);
    setDataTable(
      [...flattenData.websiteContactForms].flatMap((Detail) => {
        if (!namearr.includes(Detail.Details?.leadsdetails?.name)) {
          namearr.push(Detail.Details?.leadsdetails?.name);
          namearr.push(Detail.Details?.leadsdetails?.name?.toLowerCase());
        }
        if (!namearr.includes(Detail.Details?.leadsdetails?.status)) {
          namearr.push(Detail.Details?.leadsdetails.status?.toLowerCase());
        }

        return {
          id: Detail.id,
          leadsdate: getDate(Date.parse(Detail.createdAt)),
          name: Detail.Details?.leadsdetails?.name,
          number: Detail.Details?.leadsdetails?.phonenumber,
          email: Detail.Details?.leadsdetails?.email,
          source: Detail.Details?.source,
          status: Detail.Details?.status,
          isseen: Detail?.isSeen,
          lastupdated: getDate(Date.parse(Detail.updatedAt)),
        };
      })
    );
    setNameArr(namearr);
  }
  useEffect(() => {
    if (searchFilter) {
      setDataTable(
        data.flatMap((Detail: any) => {
          if (
            (nameArr.includes(searchFilter) &&
              Detail.Details?.leadsdetails?.name.toLowerCase() ===
                searchFilter.toLowerCase()) ||
            (nameArr.includes(searchFilter) &&
              Detail.Details?.status.toLowerCase() ===
                searchFilter.toLowerCase())
          ) {
            return {
              id: Detail.id,
              leadsdate: getDate(Date.parse(Detail.createdAt)),
              name: Detail.Details?.leadsdetails.name,
              number: Detail.Details?.leadsdetails.phonenumber,
              email: Detail.Details?.leadsdetails.email,
              source: Detail.Details.source,
              status: Detail.Details.status,
              lastupdated: getDate(Date.parse(Detail.updatedAt)),
            };
          } else {
            return [];
          }
        })
      );


    }
    if (searchFilter === "") {
      setDataTable(
        data.flatMap((Detail: any) => {
          return {
            id: Detail.id,
            leadsdate: getDate(Date.parse(Detail.createdAt)),
            name: Detail.Details?.leadsdetails?.name,
            number: Detail.Details?.leadsdetails?.phonenumber,
            email: Detail.Details?.leadsdetails?.email,
            source: Detail.Details.source,
            status: Detail.Details.status,
            lastupdated: getDate(Date.parse(Detail.updatedAt)),
          };
        })
      );
    }
  }, [searchFilter, data, nameArr]);


  

  return (
    <TabContent>
      <Container>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                aria-describedby="basic-addon1"
                placeholder="Search"
                ref={searchInput}
              />
              <InputGroup.Prepend>
                <Button
                  variant="outline-secondary"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setSearchFilter(searchInput.current.value);
                  }}
                >
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup.Prepend>
            </InputGroup>
          </Col>
          <Col>
            <Card.Title className="text-center">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  createEditMessageComponent.current.TriggerForm({
                    id: null,
                    type: "create",
                    modal_status: true,
                  });
                }}
              >
                <i className="fas fa-plus-circle"></i> Add Lead
              </Button>
              <CreateEditMessage
                ref={createEditMessageComponent}
                callback={refetchQueryCallback}
              ></CreateEditMessage>
            </Card.Title>
          </Col>
        </Row>
      </Container>
      <Table columns={columns} data={datatable} />
    </TabContent>
  );
}
