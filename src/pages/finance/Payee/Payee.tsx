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
import { GET_CONTACTS, GET_PAYMENT_SCHEDULES } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import CreateEditPayee from "./CreateEditPayee";

export default function Payee() {
  const auth = useContext(AuthContext);
  const [searchFilter, setSearchFilter] = useState("");
  const searchInput = useRef<any>();
  const createEditPayeeComponent = useRef<any>(null);

  const columns = useMemo<any>(
    () => [
      { accessor: "id", Header: "ID" },
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
                {row.values.isActive === true
                  ? "Activated"
                  : "Deactivated"}
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
          const manageHandler = () => {
            createEditPayeeComponent.current.TriggerForm({
              id: row.original.id,
              type: "edit",
            });
          };
          const addPaymentScheduleHandler = () => {
            createEditPayeeComponent.current.TriggerForm({
              id: row.original.id,
              type: "view",
            });
          };
          const allTransactionsHandler = () => {
            createEditPayeeComponent.current.TriggerForm({
              id: row.original.id,
              type: "all transactions",
            });
          };

          const arrayAction = [
            {
              actionName: "Manage",
              actionClick: manageHandler,
            },
            {
              actionName: "Add payment schedule",
              actionClick: addPaymentScheduleHandler,
            },
            {
              actionName: "All transactions",
              actionClick: allTransactionsHandler,
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

  // eslint-disable-next-line
  const [getPaymentSchedules, { data: paymentSchedule }] = useLazyQuery(
    GET_PAYMENT_SCHEDULES,
    {
      onCompleted: (data) => { loadData(data) }
    }
  );

  const { data: get_contacts } = useQuery(GET_CONTACTS, {
    variables: { id: auth.userid },
    onCompleted: (data) => getPaymentSchedules({ variables: { id: auth.userid } })
  });

  if(get_contacts) {
    console.log('get_contacts',get_contacts);
    const flattenContactsData = flattenObj({ ...get_contacts });
    console.log('get_contacts',flattenContactsData);
    // const contactIds = get_contacts
  }

  function loadData(data: any) {
    
    const flattenContactsData = flattenObj({ ...get_contacts });
    console.log('flattenContactsData',flattenContactsData)
    const flattenFinanceData = flattenObj({ ...data.paymentSchedules });
    console.log('flattenFinanceData',flattenFinanceData);

    setDataTable(
      [...flattenContactsData.contacts].flatMap((Detail) => {

        return {
          id: Detail.id,
          contactsdate: getDate(Date.parse(Detail.createdAt)),
          name: Detail.firstname + " " + Detail.lastname,
          type: Detail.type,
          appDownloadStatus: Detail.appDownloadStatus,
          isActive: flattenFinanceData.filter((currValue) => currValue.Destination_Contacts_ID == Detail.id).findIndex((currValue) => currValue.isActive === true) !== -1 ? true : false
        };
      })
    );
  }

  // function refetchQueryCallback() {
  //   fetch.refetch();
  // }

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
                <i className="fas fa-plus-circle"></i> Add Payee
              </Button>
              <CreateEditPayee
                ref={createEditPayeeComponent}
                // callback={refetchQueryCallback}
              ></CreateEditPayee>
            </Card.Title>
          </Col>
        </Row>
      </Container>
      <Table columns={columns} data={datatable} />
    </TabContent>
  );
}
