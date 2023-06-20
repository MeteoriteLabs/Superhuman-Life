import { useContext, useMemo, useState, useRef } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  TabContent
} from 'react-bootstrap';
import Table from '../../../components/table';
import { useQuery } from '@apollo/client';
import { GET_TABLEDATA } from './queries';
import AuthContext from '../../../context/auth-context';
import ActionButton from '../../../components/actionbutton';
import CreateEditExercise from './createoredit-exercise';
import { flattenObj } from '../../../components/utils/responseFlatten';
import moment from 'moment';
import { Exercise, FlattenExercise } from './@exercisesTypes';

interface CreateEditExerciseComponentRef {
  TriggerForm: (params: { id: number | null; type: string }) => void;
}

interface ExerciseTable {
  discipline: string[];
  equipment: string[];
  exerciseName: string;
  id: string;
  level: string;
  muscleGroup: string[];
  type: string;
  updatedOn: string;
}

export default function EventsTab(): JSX.Element {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState<ExerciseTable[]>([]);
  const createEditExerciseComponent = useRef<CreateEditExerciseComponentRef>();
  const [searchFilter, setSearchFilter] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const columns = useMemo(
    () => [
      { accessor: 'exerciseName', Header: 'Exercise Name' },
      { accessor: 'discipline', Header: 'Discipline' },
      { accessor: 'level', Header: 'Level' },
      { accessor: 'type', Header: 'Type' },
      { accessor: 'muscleGroup', Header: 'Muscle group' },
      { accessor: 'equipment', Header: 'Equipment' },
      { accessor: 'updatedOn', Header: 'Updated On' },
      {
        id: 'edit',
        Header: 'Actions',
        Cell: ({ row }: { row: { original: { id: number } } }) => {
          const editHandler = () => {
            createEditExerciseComponent.current &&
              createEditExerciseComponent.current.TriggerForm({
                id: row.original.id,
                type: 'edit'
              });
          };
          const viewHandler = () => {
            createEditExerciseComponent.current &&
              createEditExerciseComponent.current.TriggerForm({
                id: row.original.id,
                type: 'view'
              });
          };
          const deleteHandler = () => {
            createEditExerciseComponent.current &&
              createEditExerciseComponent.current.TriggerForm({
                id: row.original.id,
                type: 'delete'
              });
          };

          const arrayAction = [
            { actionName: 'Edit', actionClick: editHandler },
            { actionName: 'View', actionClick: viewHandler },
            { actionName: 'Delete', actionClick: deleteHandler }
          ];
          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        }
      }
    ],
    []
  );

  function getDate(time: string | number | Date) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec'
    ];
    const dateObj = new Date(time);
    const month = monthNames[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const date = dateObj.getDate();

    return `${date}-${month}-${year}`;
  }

  const fetch = useQuery(GET_TABLEDATA, {
    variables: { id: auth.userid, filter: searchFilter, start: page * 10 - 10, limit: 10 },
    onCompleted: (data) => {
      setTotalRecords(data.exercises.meta.pagination.total);
      loadData(data);
    }
  });

  function refetchQueryCallback() {
    fetch.refetch();
  }

  function loadData(data: Exercise[]) {
    const flattenData = flattenObj({ ...data }) as FlattenExercise;

    setTableData(
      [...flattenData.exercises].map((detail) => {
        return {
          id: detail.id,
          exerciseName: detail.exercisename,
          discipline: detail.fitnessdisciplines.map((disc) => {
            return disc.disciplinename + ' ';
          }),
          level: detail.exerciselevel,
          muscleGroup: detail.muscle_groups.map((muscle) => {
            return muscle.name + '  ';
          }),
          equipment: detail.equipment_lists.map((equipment) => {
            return equipment.name + ' ';
          }),
          updatedOn: moment(getDate(Date.parse(detail.updatedAt))).format('Do MMM YYYY'),
          type: detail.exercisetext ? 'Text' : 'Video'
        };
      })
    );
  }

  const pageHandler = (selectedPageNumber: number) => {
    setPage(selectedPageNumber);
  };

  return (
    <TabContent>
      <hr />
      <Container>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl aria-describedby="basic-addon1" placeholder="Search" ref={searchInput} />
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
          <Col>
            <Card.Title className="text-right">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  createEditExerciseComponent.current &&
                    createEditExerciseComponent.current.TriggerForm({ id: null, type: 'create' });
                }}>
                <i className="fas fa-plus-circle"></i> Create Exercise
              </Button>

              <CreateEditExercise
                ref={createEditExerciseComponent}
                callback={refetchQueryCallback}></CreateEditExercise>
            </Card.Title>
          </Col>
        </Row>
      </Container>
      <Table columns={columns} data={tableData} />

      {tableData && tableData.length ? (
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
            disabled={totalRecords > page * 10 - 10 + tableData.length ? false : true}>
            Next
          </Button>
          <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
            page * 10 - 10 + tableData.length
          }`}</span>
        </Row>
      ) : null}
    </TabContent>
  );
}
