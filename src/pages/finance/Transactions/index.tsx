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
import {
  GET_TRANSACTIONS,
  GET_CONTACTS,
  FETCH_CHANGEMAKERS,
  GET_PAYMENT_SCHEDULE,
} from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import moment from "moment";

export default function Transactions() {
  const auth = useContext(AuthContext);

  const columns = useMemo<any>(
    () => [
      { accessor: "name", Header: "Name" },
      { accessor: "towards", Header: "Towards" },
      {
        accessor: "type",
        Header: "Type",
        Cell: ({ row }: any) => {
          let typeColor = "";
          switch (row.values.type) {
            case "Credited":
              typeColor = "success";
              break;

            case "Debited":
              typeColor = "warning";
              break;
          }
          return (
            <>
              <Badge
                className="px-3 py-1"
                style={{ fontSize: "1rem", borderRadius: "10px" }}
                variant={typeColor}
              >
                {row.values.type === "Credited" ? "Credited" : "Debited"}
              </Badge>
            </>
          );
        },
      },
      { accessor: "remark", Header: "Remark" },
      { accessor: "amount", Header: "Amount" },
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

            case "Refund":
              statusColor = "warning";
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
                {row.values.status === "Success"
                  ? "Success"
                  : row.values.status === "Failed"
                  ? "Failed"
                  : "Refund"}
              </Badge>
            </>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [datatable, setDataTable] = useState<{}[]>([]);

  // const [paymentSchedule, { data: get_payment_schedule }] = useLazyQuery(
  //   GET_PAYMENT_SCHEDULE,
  //   {
  //     onCompleted: (data) => {
        
  //     },
  //   }
  // );

  const [contacts, { data: get_contacts }] = useLazyQuery(GET_CONTACTS, {
    onCompleted: (data) => {
      loadData(data);
      // paymentSchedule();
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
    
    const creditAndDebitTransactions =
      flattenTransactionData.transactions.filter((currentValue) => {
        
        return (
          currentValue.ReceiverID === auth.userid ||
          currentValue.SenderID === auth.userid
        );
      });

    setDataTable(
      [...creditAndDebitTransactions].flatMap((Detail) => {

        return {
          id: Detail.id,
          name:
            Detail.ReceiverID === auth.userid
              ? flattenChangemakerData.usersPermissionsUsers.find(
                  (currentValue) => currentValue.id === Detail.ReceiverID
                ).First_Name
              : Detail.ReceiverType === "Changemaker"
              ? flattenChangemakerData.usersPermissionsUsers.find(
                  (currentValue) => currentValue.id === Detail.ReceiverID
                ).First_Name
              : flattenContactsData.contacts.find(
                  (currentValue) => currentValue.id === Detail.ReceiverID
                ).firstname,
          towards: Detail.ReceiverType,
          amount: `${Detail.Currency} ${Detail.TransactionAmount}`,
          remark: Detail.TransactionRemarks,
          transactionDate: moment(Detail.TransactionDateTime).format(
            "MMMM DD,YYYY HH:mm:ss"
          ),
          status: Detail.TransactionStatus,
          type: Detail.ReceiverID === auth.userid ? "Credited" : "Debited",
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
