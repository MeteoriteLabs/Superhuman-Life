import React from "react";
import { Badge, Row, Col, Button } from "react-bootstrap";
import { useContext, useMemo, useRef, useState } from "react";
import Table from "../../../components/table/index";
import ActionButton from "../../../components/actionbutton";
import { useQuery } from "@apollo/client";
import { GET_ALL_VOUCHERS } from "../graphQL/queries";
import authContext from "../../../context/auth-context";
import moment from "moment";
import VoucherAction from "./VoucherAction";

export default function Vouchers() {
  const auth = useContext(authContext);
  const [dataTable, setDataTable] = useState<any[]>([]);
  const voucherActionRef = useRef<any>(null);

  const fetch = useQuery(GET_ALL_VOUCHERS, {
    variables: { id: auth.userid },
    onCompleted: (data) => loadData(data),
  });

  const loadData = (data) => {
    setDataTable(
      [...data.vouchers.data].map((voucher) => {
        const todayDate = moment(new Date());
        const expiryDate = moment(voucher.attributes.expiry_date);
        const diff = expiryDate.diff(todayDate);
        return {
          id: voucher.id,
          voucher_name: voucher.attributes.voucher_name,
          discount_percentage: voucher.attributes.discount_percentage,
          expiry_date: moment(voucher.attributes.expiry_date).format(
            "MMMM DD,YYYY"
          ),
          Usage_restriction: voucher.attributes.Usage_restriction,
          Status:
            diff <= 0 || voucher.attributes.Usage_restriction <= 0
              ? "Expired"
              : voucher.attributes.Status,
        };
      })
    );
  };

  function refetchQueryCallback() {
    fetch.refetch();
  }

  const columns = useMemo(
    () => [
      { accessor: "voucher_name", Header: "Code" },
      {
        accessor: "discount_percentage",
        Header: "Discount",
        Cell: ({ row }: any) => {
          return <p className="mb-0">{row.values.discount_percentage} %</p>;
        },
      },
      {
        accessor: "expiry_date",
        Header: "Expiry",
        Cell: ({ row }: any) => {
          return <p className="mb-0">{row.values.expiry_date}</p>;
        },
      },
      { accessor: "Usage_restriction", Header: "Usage" },
      {
        accessor: "Status",
        Header: "Status",
        Cell: ({ row }: any) => {
          let statusColor = "";
          switch (row.values.Status) {
            case "Active":
              statusColor = "success";
              break;

            case "Expired":
              statusColor = "danger";
              break;

            case "Disabled":
              statusColor = "warning";
              break;
          }
          return (
            <>
              <Badge
                className="px-3 py-1"
                style={{ fontSize: "1rem", borderRadius: "10px" }}
                variant={statusColor}
              >
                {row.values.Status}
              </Badge>
            </>
          );
        },
      },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const viewHandler = () => {
            voucherActionRef.current.TriggerForm({
              id: row.original.id,
              actionType: "view",
            });
          };
          const editHandler = () => {
            voucherActionRef.current.TriggerForm({
              id: row.original.id,
              actionType: "edit",
            });
          };
          const deleteHandler = () => {
            voucherActionRef.current.TriggerForm({
              id: row.original.id,
              actionType: "delete",
            });
          };
          const statusChangeHandler = () => {
            voucherActionRef.current.TriggerForm({
              id: row.original.id,
              actionType: "toggle-status",
              current_status: row.original.Status,
            });
          };
          const arrayAction = [
            { actionName: "View", actionClick: viewHandler },
            { actionName: "Edit", actionClick: editHandler },
            { actionName: "Delete", actionClick: deleteHandler },
            { actionName: "Status", actionClick: statusChangeHandler },
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    []
  );

  return (
    <div className="mt-3">
      <div className="d-flex justify-content-end mb-3 mr-5">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            voucherActionRef.current.TriggerForm({ actionType: "create" });
          }}
        >
          <i className="fas fa-plus-circle"></i> Create Voucher
        </Button>
      </div>
      <Row>
        <Col>
          <Table columns={columns} data={dataTable} />
          <VoucherAction
            ref={voucherActionRef}
            callback={refetchQueryCallback}
          />
        </Col>
      </Row>
    </div>
  );
}
