import React from 'react';
import { Badge, Row, Col, Button, InputGroup, FormControl, Container, Card } from 'react-bootstrap';
import { useContext, useMemo, useRef, useState } from 'react';
import Table from '../../../components/table/index';
import ActionButton from '../../../components/actionbutton';
import { useQuery } from '@apollo/client';
import { GET_ALL_VOUCHERS } from '../graphQL/queries';
import authContext from '../../../context/auth-context';
import moment from 'moment';
import VoucherAction from './VoucherAction';
import containsSubstring from '../../../components/utils/containsSubstring';

interface VoucherTs {
  TriggerForm: ({
    id,
    actionType,
    current_status
  }: {
    id?: string | number;
    actionType: string;
    current_status?: string;
  }) => void;
}
interface RowTs {
  row: {
    values: { discount_percentage?: string; expiry_date?: string; Status?: string; flat_discount: number; };
    original: { id: string; Status: string };
  };
}

export default function Vouchers(): JSX.Element {
  const auth = useContext(authContext);
  const [dataTable, setDataTable] = useState<Record<string, unknown>[]>([]);
  const voucherActionRef = useRef<VoucherTs>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const [AllVouchersData, setAllVouchersData] = useState<Record<string, unknown>>();
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const fetch = useQuery(GET_ALL_VOUCHERS, {
    variables: { id: auth.userid , start: page * 10 - 10, limit: page * 10 },
    onCompleted: (data) => {
      loadData(data);
      setAllVouchersData(data);
      setTotalRecords(data.vouchers.meta.pagination.total)
    }
  });

  const loadData = (data, filter?: string) => {
    setDataTable(
      [...data.vouchers.data]
        .map((voucher) => {
          const todayDate = moment(new Date());
          const expiryDate = moment(voucher.attributes.expiry_date);
          const diff = expiryDate.diff(todayDate);
          return {
            id: voucher.id,
            voucher_name: voucher.attributes.voucher_name,
            discount_percentage: voucher.attributes.discount_percentage,
            flat_discount: voucher.attributes.flat_discount,
            expiry_date: moment(voucher.attributes.expiry_date).format('MMMM DD,YYYY'),
            Usage_restriction: voucher.attributes.Usage_restriction,
            Status:
              diff <= 0 || voucher.attributes.Usage_restriction <= 0
                ? 'Expired'
                : voucher.attributes.Status
          };
        })
        .filter((voucher) => {
          if (filter) {
            return containsSubstring(voucher.voucher_name, filter);
          }
          return true;
        })
    );
  };

  function refetchQueryCallback() {
    fetch.refetch();
  }

  const columns = useMemo(
    () => [
      { accessor: 'voucher_name', Header: 'Code' },
      {
        accessor: 'discount_percentage',
        Header: 'Discount',
        Cell: ({ row }: RowTs) => {
          return <p className="mb-0">{row.values.discount_percentage ? `${row.values.discount_percentage} %` : "N/A" } </p>;
        }
      },
      {
        accessor: 'flat_discount',
        Header: 'Flat Discount',
        Cell: ({ row }: RowTs) => {
          return  <p className="mb-0">{row.values.flat_discount ? `INR ${row.values.flat_discount}`: "N/A" }</p> ;
        }
      },
      {
        accessor: 'expiry_date',
        Header: 'Expiry',
        Cell: ({ row }: RowTs) => {
          return <p className="mb-0">{row.values.expiry_date}</p>;
        }
      },
      { accessor: 'Usage_restriction', Header: 'Usage' },
      {
        accessor: 'Status',
        Header: 'Status',
        Cell: ({ row }: RowTs) => {
          let statusColor = '';
          switch (row.values.Status) {
            case 'Active':
              statusColor = 'success';
              break;

            case 'Expired':
              statusColor = 'danger';
              break;

            case 'Disabled':
              statusColor = 'warning';
              break;
          }
          return (
            <>
              <Badge
                className="px-3 py-1"
                style={{ fontSize: '1rem', borderRadius: '10px' }}
                variant={statusColor}>
                {row.values.Status}
              </Badge>
            </>
          );
        }
      },
      {
        id: 'edit',
        Header: 'Actions',
        Cell: ({ row }: RowTs) => {
          const viewHandler = () => {
            voucherActionRef.current?.TriggerForm({
              id: row.original.id,
              actionType: 'view'
            });
          };
          const editHandler = () => {
            voucherActionRef.current?.TriggerForm({
              id: row.original.id,
              actionType: 'edit'
            });
          };
          const deleteHandler = () => {
            voucherActionRef.current?.TriggerForm({
              id: row.original.id,
              actionType: 'delete'
            });
          };
          const statusChangeHandler = () => {
            voucherActionRef.current?.TriggerForm({
              id: row.original.id,
              actionType: 'toggle-status',
              current_status: row.original.Status
            });
          };
          const arrayAction = [
            { actionName: 'View', actionClick: viewHandler },
            { actionName: 'Edit', actionClick: editHandler },
            { actionName: 'Delete', actionClick: deleteHandler },
            { actionName: 'Status', actionClick: statusChangeHandler }
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        }
      }
    ],
    []
  );

  const pageHandler = (selectedPageNumber: number) => {
    setPage(selectedPageNumber);
  };

  return (
    <div className="mt-3">
      <Container className="mt-3">
        <Row>
          <Col xs={6}>
            <InputGroup className="mb-3">
              <FormControl aria-describedby="basic-addon1" placeholder="Search" ref={searchInput} />
              <InputGroup.Prepend>
                <Button
                  variant="outline-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    loadData(AllVouchersData, searchInput.current?.value);
                  }}>
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup.Prepend>
            </InputGroup>
          </Col>
          <Col xs={6}>
            <Card.Title className="text-right">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  voucherActionRef.current?.TriggerForm({ actionType: 'create' });
                }}>
                <i className="fas fa-plus-circle"></i> Create Voucher
              </Button>
            </Card.Title>
          </Col>
        </Row>
      </Container>

      <Row>
        <Col>
          <Table columns={columns} data={dataTable} />
          <VoucherAction ref={voucherActionRef} callback={refetchQueryCallback} />
        </Col>
       
      </Row>
       {/* Pagination */}
       {dataTable && dataTable.length ? (
        <Row className="justify-content-end">
          <Button
            variant="outline-dark"
            className="m-2"
            onClick={() => pageHandler(page - 1)}
            disabled={page === 1 ? true : false}>
            Previous
          </Button>

          <Button
            variant="outline-dark"
            className="m-2"
            onClick={() => pageHandler(page + 1)}
            disabled={totalRecords > (page * 10 - 10 + dataTable.length) ? false : true}>
            Next
          </Button>
          <span className="m-2 bold pt-2">{`${(page * 10 - 10)+1} - ${
            page * 10 - 10 + dataTable.length
          }`}</span>
        </Row>
      ) : null}
    </div>
  );
}
