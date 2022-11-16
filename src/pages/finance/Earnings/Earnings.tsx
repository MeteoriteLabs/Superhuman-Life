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
import { GET_TRANSACTIONS, GET_CONTACTS, FETCH_CHANGEMAKERS } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";
import moment from "moment";
import { useHistory } from "react-router-dom";

export default function Earnings() {
  const auth = useContext(AuthContext);

  const columns = useMemo<any>(
    () => [
      { accessor: "id", Header: "T ID" },
      { accessor: "name", Header: "Name" },
      { accessor: "transactionDate", Header: "Transaction Date" },
      { accessor: "remark", Header: "Remark" },
      { accessor: "paymentMode", Header: "Payment Mode" },
      { accessor: "amount", Header: "Amount" },
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
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const history = useHistory();
          const routeChange = () => {
            let path = `receipt/?id=${row.original.id}`;
            history.push(path);
          };

          const arrayAction = [
            {
              actionName: "Receipt",
              actionClick: routeChange,
            },
            {
              actionName: "Help",
              actionClick: routeChange,
            },
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
    variables: {
      receiverId: auth.userid,
    },
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

    setDataTable(
      [...flattenTransactionData.transactions].flatMap((Detail) => {
        return {
          id: Detail.id,
          name:
            Detail.ReceiverType === "Changemaker"
              ? flattenChangemakerData.usersPermissionsUsers.find(
                  (currentValue) => currentValue.id === Detail.SenderID
                )?.First_Name
              : flattenContactsData.contacts.find(
                  (currentValue) => currentValue.id === Detail.SenderID
                )?.firstname,

          amount: `${Detail.Currency} ${Detail.TransactionAmount}`,
          remark: Detail.TransactionRemarks,
          transactionDate: moment(Detail.TransactionDateTime).format(
            "DD/MM/YYYY, hh:mm"
          ),
          status: Detail.TransactionStatus,
          paymentMode: Detail.PaymentMode,
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
