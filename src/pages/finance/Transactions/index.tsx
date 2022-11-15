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
import { useQuery, useLazyQuery } from "@apollo/client";
import ActionButton from "../../../components/actionbutton/index";
import { GET_TRANSACTIONS, GET_CONTACTS, FETCH_CHANGEMAKERS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { useHistory } from "react-router-dom";
import AuthContext from "../../../context/auth-context";
import moment from "moment";

export default function Transactions() {
  const auth = useContext(AuthContext);

  const columns = useMemo<any>(
    () => [
      { accessor: "name", Header: "Name" },
      { accessor: "towards", Header: "Towards" },
      { accessor: "frequency", Header: "Frequency" },
      { accessor: "amount", Header: "Amount" },
      { accessor: "dueDate", Header: "Due Date" },
      { accessor: "transactionDate", Header: "Transaction Date" },
      {
        accessor: "status",
        Header: "Status",
        Cell: ({ row }: any) => {
          let statusColor = "";
          switch (row.values.status) {
            case "Success":
              statusColor = "success";
              break;

            case "Failed":
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
                {row.values.status === "Success" ? "Success" : "Failed"}
              </Badge>
            </>
          );
        },
      },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const editHandler = () => {};
          const viewHandler = () => {};
          const deleteHandler = () => {};

          const history = useHistory();
          const routeChange = () => {
            let path = `payment_settings/?id=${row.original.id}`;
            history.push(path);
          };

          const arrayAction = [
            { actionName: "Edit", actionClick: editHandler },
            { actionName: "View", actionClick: viewHandler },
            { actionName: "Delete", actionClick: deleteHandler },
            { actionName: "Payment Settings", actionClick: routeChange },
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function getDate(time: any) {
    let dateObj = new Date(time);
    let month = dateObj.getMonth() + 1;
    let year = dateObj.getFullYear();
    let date = dateObj.getDate();

    return `${date}/${month}/${year}`;
  }

  const [datatable, setDataTable] = useState<{}[]>([]);

  const [contacts, { data: get_contacts }] = useLazyQuery(GET_CONTACTS, {
    
    onCompleted: (data) => {
      loadData(data);
    },
  });

  const [users, { data: get_changemakers }] = useLazyQuery(FETCH_CHANGEMAKERS, {
    
    onCompleted: (data) => {
      contacts({
        variables: {
          id: Number(auth.userid),
        },
      });
    },
  });

  const { data: get_transaction } = useQuery(GET_TRANSACTIONS, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      users({
        variables: {
          id: Number(auth.userid),
        },
      });
    },
  });

  function loadData(data: any) {
    contacts({
      variables: {
        id: Number(auth.userid),
      },
    });

    const flattenTransactionData = flattenObj({ ...get_transaction });
    const flattenChangemakerData = flattenObj({ ...get_changemakers });
    const flattenContactsData = flattenObj({ ...get_contacts });
    console.log(flattenTransactionData);
    console.log(flattenChangemakerData.usersPermissionsUsers);
    console.log(flattenContactsData)

    setDataTable(
      [...flattenTransactionData.transactions].flatMap((Detail) => {
        const changemaker = Detail.ReceiverType === "Changemaker" ? flattenChangemakerData.usersPermissionsUsers.find((currentValue) => currentValue.id === Detail.ReceiverID): null;
        const contacts = Detail.ReceiverType === "Contacts" ? flattenContactsData.contacts.find((currentValue) => currentValue.id === Detail.ReceiverID) : null;

        return {
          id: Detail.id,
          //   contactsdate: getDate(Date.parse(Detail.createdAt)),
          //   name: Detail.firstname + " " + Detail.lastname,
          //   number: Detail.phone,
          name: Detail.ReceiverType === "Changemaker" ? `${changemaker.First_Name} ${changemaker.Last_Name}` : `${contacts.firstname} ${contacts.lastname}`,
          towards: Detail.ReceiverType,
          amount: `${Detail.Currency} ${Detail.TransactionAmount}`,

          transactionDate: moment(Detail.TransactionDateTime).format(
            "MMMM DD,YYYY HH:mm:ss"
          ),
          status: Detail.TransactionStatus,
        };
      })
    );
  }

  return (
    <TabContent>
      <Container className="mt-3">
        <Row>
          <Col lg={3}>
            <InputGroup className="mb-3">
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
