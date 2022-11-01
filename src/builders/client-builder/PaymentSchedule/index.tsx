import { useMemo, useState, useRef, useContext } from "react";
import {
  Badge,
  Button,
  TabContent,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Table from "../../../components/table/leads-table";
import { useQuery } from "@apollo/client";
import ActionButton from "../../../components/actionbutton/index";
import { GET_PAYMENT_SCHEDULES } from "./queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import CreatePaymentSchedule from "./createPaymentSchedule";
import moment from "moment";
import AuthContext from "../../../context/auth-context";

export default function PaymentSchedule() {
  const auth = useContext(AuthContext);
  const createPaymentScheduleComponent = useRef<any>(null);
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id = params.get("id");

  const columns = useMemo<any>(
    () => [
      { accessor: "id", Header: "ID" },
      { accessor: "category", Header: "Payment Category" },
      { accessor: "frequency", Header: "Frequency" },
      { accessor: "cycle", Header: "Cycle" },
      { accessor: "amount", Header: "Amount" },
      { accessor: "paymentdate", Header: "Payment Date" },
      {
        accessor: "status",
        Header: "Status",
        Cell: ({ row }: any) => {
          let statusColor = "";
          switch (row.values.status) {
            case "Activated":
              statusColor = "success";
              break;

            case "Deactivated":
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
                {row.values.status === "Activated"
                  ? "Activated"
                  : "Deactivated"}
              </Badge>
            </>
          );
        },
      },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const deactivateHandler = () => {
            createPaymentScheduleComponent.current.TriggerForm({
              id: row.original.id,
              type: "deactivate",
              current_status:
                row.original.status === "Activated" ? true : false,
            });
          };

          const deleteHandler = () => {
            createPaymentScheduleComponent.current.TriggerForm({
              id: row.original.id,
              type: "delete",
            });
          };

          const arrayAction = [
            { actionName: "Deactivate", actionClick: deactivateHandler },
            { actionName: "Delete", actionClick: deleteHandler },
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [datatable, setDataTable] = useState<{}[]>([]);

  const fetch = useQuery(GET_PAYMENT_SCHEDULES, {
    skip: !id,
    variables: {
      Destination_Contacts_ID: Number(id),
      Source_User_ID: Number(auth.userid),
    },
    onCompleted: loadData,
  });

  function refetchQueryCallback() {
    fetch.refetch();
  }

  function loadData(data: any) {
    const flattenData = flattenObj({ ...data });
    setDataTable(
      [...flattenData.paymentSchedules].flatMap((Detail) => {
        return {
          id: Detail.id,
          category: Detail.PaymentCatagory,
          paymentdate: Detail.Payment_DateTime
            ? moment(Detail.Payment_DateTime).format("MMMM DD,YYYY")
            : "-",
          frequency: Detail.frequency === 1 ? "One Time Payment" : "Monthly",
          cycle: Detail.Payment_Cycle,
          amount: Detail.Total_Amount,
          status: Detail.isActive ? "Activated" : "Deactivated",
        };
      })
    );
  }

  return (
    <TabContent>
      <Container>
        <Row>
          <Col md={{ span: 3, offset: 9 }}>
            <Card.Title className="text-center">
              <Button
                variant={true ? "outline-secondary" : "light"}
                size="sm"
                onClick={() => {
                  createPaymentScheduleComponent.current.TriggerForm({
                    id: null,
                    type: "create",
                    modal_status: true,
                  });
                }}
              >
                <i className="fas fa-plus-circle"></i> Add Payment Schedule
              </Button>

              <CreatePaymentSchedule
                ref={createPaymentScheduleComponent}
                callback={refetchQueryCallback}
              ></CreatePaymentSchedule>
            </Card.Title>
          </Col>
        </Row>
      </Container>
      <Table columns={columns} data={datatable} />
    </TabContent>
  );
}
