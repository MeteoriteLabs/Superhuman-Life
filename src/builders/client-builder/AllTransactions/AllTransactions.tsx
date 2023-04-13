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
import { GET_TRANSACTIONS, GET_PAYMENT_SCHEDULE } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import { useHistory } from "react-router-dom";
import AuthContext from "../../../context/auth-context";
import moment from "moment";

export default function AllTransactions() {
  const auth = useContext(AuthContext);
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id: string | null = params.get("id");
  const isChangemaker: boolean = params.get("isChangemaker") === "true";

  const columns = useMemo<any>(
    () => [
      { accessor: "id", Header: "Transaction ID" },
      { accessor: "transactionDate", Header: "Transaction Date" },
      { accessor: "category", Header: "Category" },
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
          const history = useHistory();
          const routeChange = () => {
            const path = `receipt/?id=${row.original.id}`;
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
    []
  );

  const [datatable, setDataTable] = useState<Record<string, unknown>[]>([]);

  const [paymentSchedules, { data: get_payment_schedule }] = useLazyQuery(
    GET_PAYMENT_SCHEDULE,
    {
      onCompleted: (data) => {
        loadData(data);
      },
    }
  );

  const { data: get_transaction } = useQuery(GET_TRANSACTIONS, {
    variables: {
      senderId: auth.userid,
      receiverId: id,
      receiverType: isChangemaker ? "Changemaker" : "Contacts",
    },
    onCompleted: (data) => {
      paymentSchedules();
    },
  });

  function loadData(data: any) {
    const flattenTransactionData = flattenObj({ ...get_transaction });
    const flattenPaymentScheduleData = flattenObj({ ...get_payment_schedule });

    setDataTable(
      [...flattenTransactionData.transactions].flatMap((Detail) => {
        return {
          id: Detail.id,
          category: flattenPaymentScheduleData.paymentSchedules.find(
            (currentValue) => currentValue.id === Detail.PaymentScheduleID
          ).PaymentCatagory,
          amount: `${Detail.Currency} ${Detail.TransactionAmount}`,
          transactionDate: moment(Detail.TransactionDateTime).format(
            "DD/MM/YYYY, hh:mm"
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
