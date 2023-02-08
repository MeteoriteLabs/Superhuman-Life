import { useQuery } from "@apollo/client";
import moment from "moment";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import ActionButton from "../../../components/actionbutton";
import BookingTable from "../../../components/table/BookingTable/BookingTable";
import authContext from "../../../context/auth-context";
import { GET_ALL_BOOKINGS } from "../GraphQL/queries";
import BookingAction from "./BookingAction";
import { flattenObj } from "../../../components/utils/responseFlatten";

export default function Movement(props) {
  const auth = useContext(authContext);
  const [userPackage, setUserPackage] = useState<any>([]);
  const [start, setStart] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 2;
  const dataLengthRef = useRef<number | null>(0);
  const bookingActionRef = useRef<any>(null);

   // eslint-disable-next-line
  const { data: get_bookings, refetch: refetchBookings } = useQuery(GET_ALL_BOOKINGS, {
    variables: {
      id: auth.userid,
      start: start,
      limit: limit,
    },
    onCompleted: (data) => loadData(data),
  });

  useEffect(() => {
    const scrollFunction = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setPage(page + 1);
        setStart(limit * page + 1);
      }
    };

    if (userPackage.length > 1) {
      for (let i = 0; i < userPackage.length; i++) {
        for (let j = i + 1; j < userPackage.length; j++) {
          if (userPackage[i].id === userPackage[j].id) {
            userPackage.splice(j, 1);
            break;
          }
        }
      }
    }
    dataLengthRef.current = userPackage.length;

    setTimeout(() => {
      window.addEventListener("scroll", scrollFunction);
    }, 1000);

    return () => window.removeEventListener("scroll", scrollFunction);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadData = (data: { clientBookings: any[] }) => {
    let existingData = [...userPackage];
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

    setUserPackage(existingData.concat(newData));
  };

  // New package count
  let newPackageCount = 0;
  userPackage.forEach((item: { booking_date: moment.MomentInput }) => {
    let booking_date: any = new Date(
      moment(item.booking_date).format("MM/DD/YYYY")
    );
    let currentDate: any = new Date(moment().format("MM/DD/YYYY"));
    const diffTime = Math.abs(booking_date - currentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 5) {
      newPackageCount++;
    }
  });

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
            bookingActionRef.current.TriggerForm({
              id: row.original.id,
              actionType: "manage",
            });
          };

          const viewHandler = () => {
            bookingActionRef.current.TriggerForm({
              id: row.original.id,
              actionType: "view",
            });
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
          <BookingTable
            columns={columns}
            data={userPackage}
            newPackageCount={newPackageCount}
          />

          <BookingAction ref={bookingActionRef} refetchBookings={refetchBookings} />
        </Col>
      </Row>
    </div>
  );
}
