import { useMemo, useState, useRef, useContext, useEffect } from 'react';
import {
  Badge,
  Button,
  TabContent,
  InputGroup,
  FormControl,
  Card,
  Container,
  Row,
  Col
} from 'react-bootstrap';
import Table from '../../../components/table/leads-table';
import { useQuery } from '@apollo/client';
import ActionButton from '../../../components/actionbutton/index';
import CreateEditContact from './createEditContact';
import { GET_CONTACTS } from './queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../../context/auth-context';

export default function Contacts() {
  const [searchFilter, setSearchFilter] = useState<any>(null);
  const [data, setData] = useState<any>([]);
  const [nameArr, setNameArr] = useState<any>([]);

  const auth = useContext(AuthContext);
  const searchInput = useRef<any>();
  const createEditContactComponent = useRef<any>(null);

  const columns = useMemo<any>(
    () => [
      { accessor: 'contactsdate', Header: 'Contacts Date' },
      { accessor: 'name', Header: 'Name' },
      { accessor: 'number', Header: 'Number' },
      { accessor: 'email', Header: 'Email' },
      { accessor: 'type', Header: 'Type' },
      {
        accessor: 'appStatus',
        Header: 'App Status',
        Cell: ({ row }: any) => {
          let statusColor = '';
          switch (row.values.appStatus) {
            case 'Invited':
              statusColor = 'success';
              break;

            case 'NotInvited':
              statusColor = 'danger';
              break;
          }
          return (
            <>
              <Badge
                className="px-3 py-1"
                style={{ fontSize: '1rem', borderRadius: '10px' }}
                variant={statusColor}>
                {row.values.appStatus === 'NotInvited' ? 'Not Invited' : 'Invited'}
              </Badge>
            </>
          );
        }
      },
      {
        id: 'edit',
        Header: 'Actions',
        Cell: ({ row }: any) => {
          const editHandler = () => {
            createEditContactComponent.current.TriggerForm({
              id: row.original.id,
              type: 'edit'
            });
          };
          const viewHandler = () => {
            createEditContactComponent.current.TriggerForm({
              id: row.original.id,
              type: 'view'
            });
          };
          const deleteHandler = () => {
            createEditContactComponent.current.TriggerForm({
              id: row.original.id,
              type: 'delete'
            });
          };

          const history = useHistory();
          const routeChange = () => {
            const path = `payment_settings/?id=${row.original.id}&isChangemaker=false`;
            history.push(path);
          };

          const arrayAction = [
            { actionName: 'Edit', actionClick: editHandler },
            { actionName: 'View', actionClick: viewHandler },
            { actionName: 'Delete', actionClick: deleteHandler },
            { actionName: 'Payment Settings', actionClick: routeChange }
          ];

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        }
      }
    ],
    []
  );

  function getDate(time: any) {
    const dateObj = new Date(time);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const date = dateObj.getDate();

    return `${date}/${month}/${year}`;
  }

  const [datatable, setDataTable] = useState<Record<string, unknown>[]>([]);

  const fetch = useQuery(GET_CONTACTS, {
    variables: { filter: searchFilter, id: auth.userid },
    onCompleted: loadData
  });

  function refetchQueryCallback() {
    fetch.refetch();
  }

  function loadData(data: any) {
    const namearr: any = [];
    const flattenData = flattenObj({ ...data });
    setData([...flattenData.contacts]);

    setDataTable(
      [...flattenData.contacts].flatMap((Detail) => {
        if (!namearr.includes(Detail.firstname)) {
          namearr.push(Detail.firstname);
          namearr.push(Detail.firstname.toLowerCase());
        }
        if (!namearr.includes(Detail.appDownloadStatus)) {
          namearr.push(Detail.appDownloadStatus.toLowerCase());
        }
        return {
          id: Detail.id,
          contactsdate: getDate(Date.parse(Detail.createdAt)),
          name: Detail.firstname + ' ' + Detail.lastname,
          number: Detail.phone,
          email: Detail.email,
          type: Detail.type,
          appStatus: Detail.appDownloadStatus
        };
      })
    );
    setNameArr(namearr);
  }

  useEffect(() => {
    if (searchFilter) {
      setDataTable(
        data.flatMap((Detail: any) => {
          if (
            (nameArr.includes(searchFilter) &&
              Detail.firstname.toLowerCase() === searchFilter.toLowerCase()) ||
            (nameArr.includes(searchFilter) &&
              Detail.appDownloadStatus.toLowerCase() === searchFilter.toLowerCase())
          ) {
            return {
              id: Detail.id,
              contactsdate: getDate(Date.parse(Detail.createdAt)),
              name: Detail.firstname + ' ' + Detail.lastname,
              number: Detail.phone,
              email: Detail.email,
              type: Detail.type,
              appStatus: Detail.appDownloadStatus
            };
          } else {
            return [];
          }
        })
      );
    }
    if (searchFilter === '') {
      setDataTable(
        data.flatMap((Detail: any) => {
          return {
            id: Detail.id,
            contactsdate: getDate(Date.parse(Detail.createdAt)),
            name: Detail.firstname + ' ' + Detail.lastname,
            number: Detail.phone,
            email: Detail.email,
            type: Detail.type,
            appStatus: Detail.appDownloadStatus
          };
        })
      );
    }
  }, [searchFilter, data, nameArr]);

  return (
    <TabContent>
      <Container>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl aria-describedby="basic-addon1" placeholder="Search" ref={searchInput} />
              <InputGroup.Prepend>
                <Button
                  variant="outline-secondary"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setSearchFilter(searchInput.current.value);
                  }}>
                  <i className="fas fa-search"></i>
                </Button>
              </InputGroup.Prepend>
            </InputGroup>
          </Col>
          <Col>
            <Card.Title className="text-center">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  createEditContactComponent.current.TriggerForm({
                    id: null,
                    type: 'create',
                    modal_status: true
                  });
                }}>
                <i className="fas fa-plus-circle"></i> Add Contact
              </Button>

              <CreateEditContact
                ref={createEditContactComponent}
                callback={refetchQueryCallback}></CreateEditContact>
            </Card.Title>
          </Col>
        </Row>
      </Container>
      <Table columns={columns} data={datatable} />
    </TabContent>
  );
}
