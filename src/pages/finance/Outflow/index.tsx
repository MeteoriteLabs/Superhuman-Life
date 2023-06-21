import { useMemo, useState, useContext, useRef } from 'react';
import {
  Badge,
  Button,
  TabContent,
  InputGroup,
  FormControl,
  Container,
  Row,
  Col,
  Form
} from 'react-bootstrap';
import Table from '../../../components/table/leads-table';
import ActionButton from '../../../components/actionbutton/index';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_TRANSACTIONS, GET_CONTACTS, FETCH_CHANGEMAKERS } from './queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import AuthContext from '../../../context/auth-context';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import containsSubstring from '../../../components/utils/containsSubstring';

export default function Expenses(): JSX.Element {
  const auth = useContext(AuthContext);

  const searchInput = useRef<HTMLInputElement>(null);
  const [currentFilter, setCurrentFilter] = useState<string>('name');
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const columns = useMemo(
    () => [
      { accessor: 'id', Header: 'T ID' },
      { accessor: 'name', Header: 'Name' },
      { accessor: 'paymentMode', Header: 'Payment Mode' },
      { accessor: 'transactionDate', Header: 'Transaction Date' },
      { accessor: 'remark', Header: 'Remark' },
      { accessor: 'amount', Header: 'Amount' },
      {
        accessor: 'status',
        Header: 'Status',
        Cell: ({ row }: { row: { values: { status: string } } }) => {
          let statusColor = '';
          switch (row.values.status) {
            case 'Success':
              statusColor = 'success';
              break;

            case 'Refund':
              statusColor = 'warning';
              break;

            case 'Failed':
              statusColor = 'danger';
              break;
          }
          return (
            <>
              <Badge
                className="px-3 py-1"
                style={{ fontSize: '1rem', borderRadius: '10px' }}
                variant={statusColor}>
                {row.values.status === 'Success'
                  ? 'Success'
                  : row.values.status === 'Failed'
                  ? 'Failed'
                  : 'Refund'}
              </Badge>
            </>
          );
        }
      },
      {
        id: 'edit',
        Header: 'Actions',
        Cell: ({ row }: { row: { original: { id: string } } }) => {
          const history = useHistory();
          const routeChange = () => {
            const path = `receipt/?id=${row.original.id}`;
            history.push(path);
          };

          const arrayAction = [
            {
              actionName: 'Receipt',
              actionClick: routeChange
            },
            {
              actionName: 'Help',
              actionClick: routeChange
            }
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        }
      }
    ],
    []
  );

  const [datatable, setDataTable] = useState<Record<string, unknown>[]>([]);

  const [contacts, { data: get_contacts }] = useLazyQuery(GET_CONTACTS, {
    onCompleted: () => {
      loadData();
    }
  });

  const [users, { data: get_changemakers }] = useLazyQuery(FETCH_CHANGEMAKERS, {
    onCompleted: () => {
      contacts({
        variables: {
          id: auth.userid
        }
      });
    }
  });

  const { data: get_transaction } = useQuery(GET_TRANSACTIONS, {
    variables: {
      senderId: auth.userid,
      start: page * 10 - 10,
      limit: 10
    },
    onCompleted: (data) => {
      users({
        variables: {
          // id: Number(auth.userid)
        }
      });
      setTotalRecords(data.transactions.meta.pagination.total);
    }
  });

  function loadData(filter?: string) {
    const flattenTransactionData = flattenObj({ ...get_transaction });
    const flattenChangemakerData = flattenObj({ ...get_changemakers });
    const flattenContactsData = flattenObj({ ...get_contacts });

    setDataTable(
      [...flattenTransactionData.transactions]
        .flatMap((Detail) => {
          return {
            id: Detail.id,
            name:
              Detail.ReceiverType === 'Changemaker'
                ? flattenChangemakerData.usersPermissionsUsers.find(
                    (currentValue) => currentValue.id === Detail.ReceiverID
                  )?.First_Name
                : flattenContactsData.contacts.find(
                    (currentValue) => currentValue.id === Detail.ReceiverID
                  )?.firstname,

            amount: `${Detail.Currency} ${Detail.TransactionAmount}`,
            paymentMode: Detail.PaymentMode,
            remark: Detail.TransactionRemarks,
            transactionDate: moment(Detail.TransactionDateTime).format('DD/MM/YYYY, hh:mm'),
            status: Detail.TransactionStatus
          };
        })
        .filter((currentValue) => {
          if (filter) {
            if (currentFilter === 'name') {
              return containsSubstring(currentValue.name, filter);
            } else {
              return currentValue.id === filter;
            }
          } else {
            return true;
          }
        })
    );
  }
  const pageHandler = (selectedPageNumber: number) => {
    setPage(selectedPageNumber);
  };

  return (
    <TabContent>
      <Container className="mt-3">
        <Row>
          <Col lg={2}>
            <Form.Control
              as="select"
              aria-label="Default select example"
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}>
              <option value="id">Id</option>
              <option value="name">Name</option>
            </Form.Control>
          </Col>
          <Col lg={4}>
            <InputGroup className="mb-3">
              <FormControl aria-describedby="basic-addon1" placeholder="Search" ref={searchInput} />
              <InputGroup.Prepend>
                <Button
                  variant="outline-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    loadData(searchInput.current?.value);
                  }}>
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup.Prepend>
            </InputGroup>
          </Col>
        </Row>
      </Container>
      <Table columns={columns} data={datatable} />
      {datatable && datatable.length ? (
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
            disabled={totalRecords > page * 10 - 10 + datatable.length ? false : true}>
            Next
          </Button>
          <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
            page * 10 - 10 + datatable.length
          }`}</span>
        </Row>
      ) : null}
    </TabContent>
  );
}
