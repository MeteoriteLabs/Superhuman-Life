import { useMemo, useState, useRef, useContext } from "react";
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
import Table from "../../../components/table";
import { useQuery, useLazyQuery } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import ActionButton from "../../../components/actionbutton/index";
import {
  GET_CONTACTS,
  GET_PAYMENT_SCHEDULES,
  FETCH_CHANGEMAKERS,
  GET_PAYMENT_SCHEDULES_FOR_CHANGEMAKER,
} from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import CreateEditPayee from "./CreateEditPayee";
import CreateChangemakerAsPayee from "./CreateChangemakerAsPayee";
import CreateContactAsPayee from "./CreateContactAsPayee";
import { useHistory } from "react-router-dom";

export default function Payee() {
  const auth = useContext(AuthContext);
  const searchInput = useRef<any>();
  const createEditPayeeComponent = useRef<any>(null);
  const createChangemakerAsPayeeComponent = useRef<any>(null);
  const createContactAsPayeeComponent = useRef<any>(null);

  const columns = useMemo<any>(
    () => [
      { accessor: "name", Header: "Payee" },
      { accessor: "type", Header: "Type" },
      {
        accessor: "isActive",
        Header: "Active",
        Cell: ({ row }: any) => {
          let statusColor = "";
          switch (row.values.isActive) {
            case true:
              statusColor = "success";
              break;

            case false:
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
                {row.values.isActive === true ? "Activated" : "Deactivated"}
              </Badge>
            </>
          );
        },
      },
      { accessor: "contactsdate", Header: "Added On" },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const history = useHistory();
          const routeChange = () => {
            let path = `payment_settings/?id=${row.original.id}&isChangemaker=${row.original.isChangemaker}`;
            history.push(path);
          };

          const arrayAction = [
            {
              actionName: "Manage",
              actionClick: routeChange,
            },
            {
              actionName: "Add payment schedule",
              actionClick: routeChange,
            },
            {
              actionName: "All transactions",
              actionClick: routeChange,
            },
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    []
  );

  const [datatable, setDataTable] = useState<{}[]>([]);

  function getDate(time: any) {
    let dateObj = new Date(time);
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    let date = dateObj.getDate();

    return `${date}/${month}/${year}`;
  }

  const [users, { data: get_changemakers }] = useLazyQuery(FETCH_CHANGEMAKERS, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const [
    getChangeMakersSchedule,
    {
      data: get_changemakers_payment_schedule,
      refetch: refetch_changemakers_payment_schedule,
    },
  ] = useLazyQuery(GET_PAYMENT_SCHEDULES_FOR_CHANGEMAKER, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      // calling fetch changemaker's useLazyQuery function
      users();
    },
  });

  const [getPaymentSchedules, { data: payment_schedule }] = useLazyQuery(
    GET_PAYMENT_SCHEDULES,
    {
      fetchPolicy: "network-only",

      onCompleted: (data) => {
        // calling changermaker's payment schedule uselazyquery function
        getChangeMakersSchedule({
          variables: {
            id: Number(auth.userid),
          },
        });
      },
    }
  );

  const { data: get_contacts, refetch: refetch_contacts } = useQuery(
    GET_CONTACTS,
    {
      variables: { id: auth.userid },
      onCompleted: (data) => {
        const flattenContactsData = flattenObj({ ...data });
        const contactsArray = flattenContactsData.contacts.map((currentValue) =>
          Number(currentValue.id)
        );

        // calling paymentSchedule's useLazyQuery function
        getPaymentSchedules({
          variables: {
            Destination_Contacts_ID: contactsArray,
            id: Number(auth.userid),
          },
        });
      },
    }
  );

  function loadData(data: any) {
    const flattenContactsData = flattenObj({ ...get_contacts?.contacts });

    const flattenContactsFinanceData = flattenObj({
      ...payment_schedule?.paymentSchedules,
    });

    const flattenChangemakersFinanceData = flattenObj({
      ...get_changemakers_payment_schedule?.paymentSchedules,
    });

    const flattenUsers = flattenObj({
      ...get_changemakers?.usersPermissionsUsers,
    });

    const concatenatedContactsAndFinanceArray = flattenContactsData.concat(
      flattenChangemakersFinanceData
    );

    setDataTable(
      [...concatenatedContactsAndFinanceArray].flatMap((Detail) => {
        return {
          isChangemaker: Detail.firstname ? false : true,
          id: Detail.firstname ? Detail.id : Detail.Destination_User_ID,
          contactsdate: getDate(Date.parse(Detail.createdAt)),
          name: Detail.firstname
            ? Detail.firstname + " " + Detail.lastname
            : flattenUsers.find(
                (currValue) =>
                  Number(currValue.id) === Number(Detail.Destination_User_ID)
              )
            ? (flattenUsers &&
              flattenUsers.length &&
              flattenUsers.find(
                (currValue) =>
                  Number(currValue.id) === Number(Detail.Destination_User_ID)
              ).First_Name
                ? flattenUsers &&
                  flattenUsers.length &&
                  flattenUsers.find(
                    (currValue) =>
                      Number(currValue.id) ===
                      Number(Detail.Destination_User_ID)
                  ).First_Name
                : "-") +
              " " +
              (flattenUsers.find(
                (currValue) =>
                  Number(currValue.id) === Number(Detail.Destination_User_ID)
              ).Last_Name
                ? flattenUsers &&
                  flattenUsers.length &&
                  flattenUsers.find(
                    (currValue) =>
                      Number(currValue.id) ===
                      Number(Detail.Destination_User_ID)
                  ).Last_Name
                : "-")
            : null,
          type: Detail.firstname ? Detail.type : "Changemaker",

          isActive: Detail.firstname
            ? flattenContactsFinanceData &&
              flattenContactsFinanceData.length &&
              flattenContactsFinanceData.findIndex(
                (currValue) =>
                  Number(currValue.Destination_Contacts_ID) ===
                  Number(Detail.id)
              ) !== -1
              ? true
              : false
            : true,
        };
      })
    );
  }

  return (
    <TabContent>
      <Container className="mt-3">
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
                variant={true ? "outline-secondary" : "light"}
                size="sm"
                onClick={() => {
                  createEditPayeeComponent.current.TriggerForm({
                    id: null,
                    type: "create",
                    modal_status: true,
                  });
                }}
              >
                <i className="fas fa-plus-circle"></i> Add New Payee
              </Button>
              <CreateEditPayee
                ref={createEditPayeeComponent}
                refetchContacts={refetch_contacts}
                refetchChangemakersPaymentSchedules={
                  refetch_changemakers_payment_schedule
                }
              ></CreateEditPayee>
            </Card.Title>
          </Col>
          <Col>
            <Card.Title className="text-center">
              <Button
                variant={true ? "outline-secondary" : "light"}
                size="sm"
                onClick={() => {
                  createChangemakerAsPayeeComponent.current.TriggerForm({
                    id: null,
                    type: "create",
                    modal_status: true,
                  });
                }}
              >
                <i className="fas fa-plus-circle"></i> Add Changemaker as Payee
              </Button>
              <CreateChangemakerAsPayee
                ref={createChangemakerAsPayeeComponent}
                refetchContacts={refetch_contacts}
                refetchChangemakersPaymentSchedules={
                  refetch_changemakers_payment_schedule
                }
              ></CreateChangemakerAsPayee>
            </Card.Title>
          </Col>
          <Col>
            <Card.Title className="text-center">
              <Button
                variant={true ? "outline-secondary" : "light"}
                size="sm"
                onClick={() => {
                  createContactAsPayeeComponent.current.TriggerForm({
                    id: null,
                    type: "create",
                    modal_status: true,
                  });
                }}
              >
                <i className="fas fa-plus-circle"></i> Add Contact as Payee
              </Button>
              <CreateContactAsPayee
                ref={createContactAsPayeeComponent}
                refetchContacts={refetch_contacts}
                refetchChangemakersPaymentSchedules={
                  refetch_changemakers_payment_schedule
                }
              ></CreateContactAsPayee>
            </Card.Title>
          </Col>
        </Row>
      </Container>
      <Table columns={columns} data={datatable} />
    </TabContent>
  );
}
