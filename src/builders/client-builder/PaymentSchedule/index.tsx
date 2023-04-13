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
import AuthContext from "../../../context/auth-context";

export default function PaymentSchedule() {
  const auth = useContext(AuthContext);
  const createPaymentScheduleComponent = useRef<any>(null);
  const query = window.location.search;
  const params = new URLSearchParams(query);
  const id = params.get("id");
  const isChangemaker: boolean = params.get("isChangemaker") === "true";

  const columns = useMemo<any>(
    () => [
      { accessor: "category", Header: "Payment Category" },
      { accessor: "frequency", Header: "Frequency" },
      {
        accessor: "cycle",
        Header: "Cycle",
        Cell: ({ row }: any) => {
          let cycle: string;
          switch (row.values.cycle) {
            case 1:
              cycle = "1st of every month";
              break;

            case 2:
              cycle = "2nd of every month";
              break;

            case 3:
              cycle = "3rd of every month";
              break;

            case 4:
              cycle = "4th of every month";
              break;

            case 5:
              cycle = "5th of every month";
              break;

            default:
              cycle = "-NA-";
              break;
          }
          return <>{cycle}</>;
        },
      },
      { accessor: "amount", Header: "Amount" },
      { accessor: "paymentdate", Header: "Next Payment Date" },
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
            {
              actionName:
                row.original.status === "Activated"
                  ? "Deactivate"
                  : "Reactivate",
              actionClick: deactivateHandler,
            },
            { actionName: "Delete", actionClick: deleteHandler },
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    []
  );

  const [datatable, setDataTable] = useState<Record<string, unknown>[]>([]);

  const fetch = useQuery(GET_PAYMENT_SCHEDULES, {
    skip: !id,
    variables: {
      Source_User_ID: Number(auth.userid),
    },
    onCompleted: loadData,
  });

  function refetchQueryCallback() {
    fetch.refetch();
  }

  function getDate(time: number) {
    const dateObj = new Date(time);
    const  month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const date = dateObj.getDate();
    return `${date}/${month}/${year}`;
  }

  function loadData(data: any) {
    const flattenData = flattenObj({ ...data.paymentSchedules });

    const getSchedule = flattenData.filter((currentValue) =>
      !isChangemaker
        ? currentValue.Destination_Contacts_ID === Number(id)
        : currentValue.Destination_User_ID === Number(id)
    );

    setDataTable(
      [...getSchedule].flatMap((Detail) => {
        return {
          id: Detail.id,
          category: Detail.PaymentCatagory,
          paymentdate: Detail.isActive
            ? Detail.Payment_DateTime
              ? getDate(Date.parse(Detail.Payment_DateTime))
              : `${Detail.Payment_Cycle}
                /${
                  Number(new Date().getMonth() + 2) >= 13
                    ? 1
                    : Number(new Date().getMonth() + 2)
                }/
                ${
                  Number(new Date().getMonth() + 2) >= 13
                    ? Number(new Date().getFullYear()) + 1
                    : Number(new Date().getFullYear())
                }`
            : "-NA-",
          frequency: Detail.frequency === 1 ? "Monthly" : "One Time Payment",
          cycle: Detail.Payment_Cycle,
          amount: `INR ${Detail.Total_Amount}`,
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
                variant="outline-secondary"
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
