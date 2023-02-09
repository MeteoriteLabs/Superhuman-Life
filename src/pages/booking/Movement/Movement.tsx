import { useQuery } from "@apollo/client";
import moment from "moment";
import { useContext, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Badge, Col, Row } from "react-bootstrap";
import ActionButton from "../../../components/actionbutton";
import BookingTable from "../../../components/table/BookingTable/BookingTable";
import authContext from "../../../context/auth-context";
import { GET_ALL_BOOKINGS } from "../GraphQL/queries";
import BookingAction from "./BookingAction";
import { flattenObj } from "../../../components/utils/responseFlatten";

export default function Movement() {
  let history = useHistory();
  const auth = useContext(authContext);
  const [userPackage, setUserPackage] = useState<any>([]);
  const bookingActionRef = useRef<any>(null);

  // eslint-disable-next-line
  const { data: get_bookings, refetch: refetchBookings } = useQuery(
    GET_ALL_BOOKINGS,
    {
      variables: {
        id: auth.userid,
      },
      onCompleted: (data) => loadData(data),
    }
  );

  const loadData = (data: { clientBookings: any[] }) => {
    const flattenData = flattenObj({ ...data });

    let newData = [
      ...flattenData.clientBookings.map((packageItem) => {
        const renewDay: Date = new Date(packageItem.effective_date);
        renewDay.setDate(renewDay.getDate() + packageItem.package_duration);
        return {
          id: packageItem.id,
          booking_date: packageItem.booking_date,
          client: packageItem.users_permissions_users[0]?.username,
          packageName: packageItem.fitnesspackages[0].packagename,
          fitness_package_type:
            packageItem.fitnesspackages[0].fitness_package_type.type,
          effectiveDate: packageItem.effective_date,
          packageRenewal: renewDay,
          duration: packageItem.package_duration,
          price: "Rs 4000",
          payment_status: "Paid",
          Status: packageItem.booking_status,
        };
      }),
    ];

    setUserPackage(newData);
  };

  const columns = useMemo(
    () => [
      {
        accessor: "client",
        Header: "Client",
        disableSortBy: true,
      },
      {
        accessor: "fitness_package_type",
        Header: "Type",
        Cell: (row: any) => {
          return (
            <>
              {row.value === "One-On-One" ? (
                <img src="./assets/PTType.svg" alt="PT" />
              ) : (
                ""
              )}
              {row.value === "Group Class" ? (
                <img src="./assets/GroupType.svg" alt="group" />
              ) : (
                ""
              )}
              {row.value === "Custom Fitness" ? (
                <img src="./assets/CustomType.svg" alt="custom" />
              ) : (
                ""
              )}
              {row.value === "Classic Class" ? (
                <img src="./assets/ClassicType.svg" alt="classic" />
              ) : (
                ""
              )}
            </>
          );
        },
      },
      { accessor: "packageName", Header: "Package Name", disableSortBy: true },
      {
        accessor: "booking_date",
        Header: "Booking Date ",
        Cell: (row: any) => {
          return (
            <div>
              <p>{moment(row.value).format("MMMM DD, YYYY")}</p>
              <p>{moment(row.value).format("hh:mm a")}</p>
            </div>
          );
        },
      },
      {
        accessor: "effectiveDate",
        Header: "Effective Date",
        Cell: (row: any) => {
          return <p>{moment(row.value).format("MMMM DD, YYYY")}</p>;
        },
      },
      {
        accessor: "packageRenewal",
        Header: "Renewal Date",
        Cell: (row: any) => {
          return <p>{moment(row.value).format("MMMM DD, YYYY")}</p>;
        },
      },
      { accessor: "duration", Header: "Duration ", disableSortBy: true },
      { accessor: "price", Header: "Price" },

      {
        accessor: "payment_status",
        Header: "Payment Status",
        Cell: (row: any) => {
          return (
            <>
              {row.value === "Paid" ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="success"
                >
                  {row.value}
                </Badge>
              ) : (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="danger"
                >
                  {row.value}
                </Badge>
              )}
            </>
          );
        },
      },
      {
        accessor: "Status",
        Header: "Status",
        Cell: (row: any) => {
          return (
            <>
              {row.value === "accepted" ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="success"
                >
                  {row.value}
                </Badge>
              ) : (
                ""
              )}
              {row.value === "rejected" ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="danger"
                >
                  {row.value}
                </Badge>
              ) : (
                ""
              )}
              {row.value === "pending" ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant="warning"
                >
                  {row.value}
                </Badge>
              ) : (
                ""
              )}
            </>
          );
        },
      },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const manageHandler = () => {
            history.push("/clients");
          };

          const viewHandler = () => {
            history.push("/receipt");
          };

          const acceptHandler = () => {
            bookingActionRef.current.TriggerForm({
              id: row.original.id,
              actionType: "accept",
            });
          };

          const rejectHandler = () => {
            bookingActionRef.current.TriggerForm({
              id: row.original.id,
              actionType: "reject",
            });
          };

          const arrayAction = [
            { actionName: "Go To Client", actionClick: manageHandler },
            { actionName: "View Invoice", actionClick: viewHandler },
            { actionName: "Accept", actionClick: acceptHandler },
            { actionName: "Reject", actionClick: rejectHandler },
          ];
          return (
            <ActionButton
              status={row.original.Status}
              arrayAction={arrayAction}
            ></ActionButton>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="mt-5">
      <Row>
        <Col>
          <BookingTable columns={columns} data={userPackage} />
          <BookingAction
            ref={bookingActionRef}
            refetchBookings={refetchBookings}
          />
        </Col>
      </Row>
    </div>
  );
}
