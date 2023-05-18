import { useMemo, useState, useContext, useRef } from 'react';
import {
  Badge,
  Button,
  TabContent,
  InputGroup,
  FormControl,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import Table from '../../../components/table/leads-table';
import ActionButton from '../../../components/actionbutton/index';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_TRANSACTIONS, GET_CONTACTS, FETCH_CHANGEMAKERS } from './queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import AuthContext from '../../../context/auth-context';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

export default function Earnings(): JSX.Element {
  const auth = useContext(AuthContext);
  const searchInput = useRef<HTMLInputElement | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  interface Row {
    values: {
      status: string;
    };
    original: {
      id: number;
    };
  }

  interface Column {
    accessor?: string;
    Header: string;
    Cell?: ({ row }: { row: Row }) => JSX.Element;
  }
  interface Action {
    actionName: string;
    actionClick: () => void;
  }

  const columns: Column[] = useMemo(
    () => [
      { accessor: 'id', Header: 'T ID' },
      { accessor: 'name', Header: 'Name' },
      { accessor: 'transactionDate', Header: 'Transaction Date' },
      { accessor: 'remark', Header: 'Remark' },
      { accessor: 'paymentMode', Header: 'Payment Mode' },
      { accessor: 'amount', Header: 'Amount' },
      {
        accessor: 'status',
        Header: 'Status',
        Cell: ({ row }: { row: Row }) => {
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
        Cell: ({ row }: { row: Row }) => {
          const history = useHistory();
          const routeChange = () => {
            const path = `receipt/?id=${row.original.id}`;
            history.push(path);
          };

          const arrayAction: Action[] = [
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
          id: Number(auth.userid)
        }
      });
    }
  });

  const { data: get_transaction } = useQuery(GET_TRANSACTIONS, {
    variables: {
      receiverId: auth.userid,
      filter: searchFilter
    },
    onCompleted: () => {
      users({
        variables: {
          id: Number(auth.userid)
        }
      });
    }
  });

  function loadData() {
    contacts({
      variables: {
        id: Number(auth.userid)
      }
    });

    const flattenTransactionData = flattenObj({ ...get_transaction });
    const flattenChangemakerData = flattenObj({ ...get_changemakers });
    const flattenContactsData = flattenObj({ ...get_contacts });

    setDataTable(
      [...flattenTransactionData.transactions].flatMap((Detail) => {
        return {
          id: Detail.id,
          name:
            Detail.ReceiverType === 'Changemaker'
              ? flattenChangemakerData.usersPermissionsUsers.find(
                  (currentValue) => currentValue.id === Detail.SenderID
                )?.First_Name
              : flattenContactsData.contacts.find(
                  (currentValue) => currentValue.id === Detail.SenderID
                )?.firstname,

          amount: `${Detail.Currency} ${Detail.TransactionAmount}`,
          remark: Detail.TransactionRemarks,
          transactionDate: moment(Detail.TransactionDateTime).format('DD/MM/YYYY, hh:mm'),
          status: Detail.TransactionStatus,
          paymentMode: Detail.PaymentMode
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
                  onClick={(e) => {
                    e.preventDefault();
                    searchInput.current && setSearchFilter(searchInput.current.value);
                  }}>
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
