import { useMemo, useState, useContext, useRef } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  TabContent,
  DropdownButton,
  Dropdown,
  ProgressBar
} from 'react-bootstrap';
import Table from '../../../components/table';
import AuthContext from '../../../context/auth-context';
import './fitness.css';
import ActionButton from '../../../components/actionbutton';
import CreateEditViewPersonalTraining from './personal-training/CreateEditView';
import CreateEditViewOnDemandPt from './onDemand-PT/CreateEditView';
import CreateEditViewGroupClass from './group/CreateEditView';
import CreateEditViewClassicClass from './classic/CreateOrEdit';
import CreateEditViewCustomFitness from './custom/CreateOrEdit';
import CreateEditViewChannel from './live-stream/CreateEditView-Channel';
import CreateEditViewCohort from './cohort/CreateEditView-Cohort';
import CreateEditViewEvent from './event/CreateEditViewEvent';
import { GET_FITNESS, GET_TAGS } from './graphQL/queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import moment from 'moment';
import Drawer from '../../../components/Drawer';
import DrawerTrigger from '../../../components/Drawer/DrawerTrigger';
import Backdrop from '../../../components/Drawer/Backdrop';
import Icon from '../../../components/Icons';
import Loader from '../../../components/Loader/Loader';

export default function FitnessTab() {
  const auth = useContext(AuthContext);
  const createEditViewPersonalTrainingRef = useRef<any>(null);
  const CreateEditViewOnDemandPtRef = useRef<any>(null);
  const CreateEditViewGroupClassRef = useRef<any>(null);
  const CreateEditViewClassicClassRef = useRef<any>(null);
  const CreateEditViewCustomFitnessRef = useRef<any>(null);
  const createEditViewChannelRef = useRef<any>(null);
  const createEditViewCohortRef = useRef<any>(null);
  const createEditViewEventRef = useRef<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<any>('');
  const [currentIndex, setCurrentIndex] = useState<any>('');
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [triggeredDetails, setTriggeredDetails] = useState<any>({});
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  function handleModalRender(
    id: string | null,
    actionType: string,
    type: string,
    current_status?: boolean | null
  ) {
    switch (type) {
      case 'One-On-One':
        createEditViewPersonalTrainingRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status
        });
        break;
      case 'On-Demand PT':
        CreateEditViewOnDemandPtRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status
        });
        break;
      case 'Group Class':
        CreateEditViewGroupClassRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status
        });
        break;
      case 'Classic Class':
        CreateEditViewClassicClassRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status
        });
        break;
      case 'Custom Fitness':
        CreateEditViewCustomFitnessRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status
        });
        break;
      case 'Live Stream Channel':
        createEditViewChannelRef.current.TriggerForm({
          id: id,
          type: actionType,
          packageType: type,
          current_status: current_status
        });
        break;
      case 'Cohort':
        createEditViewCohortRef.current.TriggerForm({
          id: id,
          type: actionType,
          packageType: type,
          current_status: current_status
        });
        break;
      case 'Event':
        createEditViewEventRef.current.TriggerForm({
          id: id,
          type: actionType,
          packageType: type,
          current_status: current_status
        });
        break;
    }
  }

  const columns = useMemo<any>(
    () => [
      { accessor: 'packagename', Header: 'Offering Name' },
      {
        accessor: 'type',
        Header: 'Type',
        Cell: ({ row }: any) => {
          return (
            <div>
              {row.original.type === 'Group Class' ? (
                <div>
                  <img loading="lazy" src="./assets/GroupType.svg" alt="GroupType" />
                </div>
              ) : (
                ''
              )}
              {row.original.type === 'On-Demand PT' ? (
                <div>
                  <img loading="lazy" src="./assets/PTType.svg" alt="on demand pt" />
                </div>
              ) : (
                ''
              )}
              {row.original.type === 'One-On-One' ? (
                <div>
                  <img loading="lazy" src="./assets/PTType.svg" alt="PTType" />
                </div>
              ) : (
                ''
              )}
              {row.original.type === 'Classic Class' ? (
                <div>
                  <img loading="lazy" src="./assets/RecordedType.svg" alt="Recorded Type" />
                </div>
              ) : (
                ''
              )}
              {row.original.type === 'Custom Fitness' ? (
                <div>
                  <img loading="lazy" src="./assets/CustomType.svg" alt="CustomType" />
                </div>
              ) : (
                ''
              )}
              {row.original.type === 'Cohort' ? (
                <div>
                  <img loading="lazy" src="./assets/cohort.svg" alt="CohortType" />
                </div>
              ) : (
                ''
              )}
              {row.original.type === 'Event' ? (
                <div>
                  <img loading="lazy" src="./assets/offeringImages/Event.svg" alt="EventType" />
                </div>
              ) : (
                ''
              )}
              {row.original.type === 'Live Stream Channel' ? (
                <div>
                  <img loading="lazy" src="./assets/livestream.svg" alt="live stream" />
                </div>
              ) : (
                ''
              )}
            </div>
          );
        }
      },
      {
        accessor: 'details',
        Header: 'No. of sessions',
        Cell: ({ row }: any) => {
          const sessionsObj = {};
          const startMoment = moment(row.original.startDate);
          const endMoment = moment(row.original.endDate).add(1, 'days');

          row.original.sessions.map((curr) => {
            return curr.sessions.map((item) => {
              sessionsObj[item.session_date] = (sessionsObj[item.session_date] || 0) + 1;

              return sessionsObj;
            });
          });

          const lengthOfobject = Object.keys(sessionsObj).length;

          const differenceBetweenStartDateandEndDate = endMoment.diff(startMoment, 'days');

            return (
              <div className="d-flex justify-content-center align-items-center">
                {row.original.type === 'Custom Fitness' ? (
                  row.original.mode === 'Online' ? (
                    <>
                      <div>
                        <img
                          src="./assets/offeringImages/one-on-one-online.svg"
                          alt="one on one online"
                          title={`${
                            row.original.ptonline * currentIndex[row.index]
                          } One-on-One online sessions`}
                        />
                        <br />
                        <p> {row.original.ptonline * currentIndex[row.index]} </p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/group-class-online.svg"
                          alt="one on one online"
                          title={`${
                            row.original.grouponline * currentIndex[row.index]
                          } group online sessions`}
                        />
                        <br />
                        <p> {row.original.grouponline * currentIndex[row.index]} </p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/classic-class-online.svg"
                          alt="recorded online sessions"
                          title={`${
                            row.original.recordedclasses * currentIndex[row.index]
                          } recorded sessions`}
                        />
                        <br />
                        <p> {row.original.recordedclasses * currentIndex[row.index]} </p>
                      </div>
                    </>
                  ) : row.original.mode === 'Offline' ? (
                    <>
                      <div>
                        <img
                          src="./assets/offeringImages/one-on-one-offline.svg"
                          alt="one on one offline"
                          title={`${
                            row.original.ptoffline * currentIndex[row.index]
                          } One-on-One offline sessions`}
                        />
                        <br />
                        <p> {row.original.ptoffline * currentIndex[row.index]} </p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/group-class-offline.svg"
                          alt="group offline"
                          title={`${
                            row.original.groupoffline * currentIndex[row.index]
                          } group offline sessions`}
                        />
                        <br />
                        <p> {row.original.groupoffline * currentIndex[row.index]} </p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/classic-class-online.svg"
                          alt="recorded online"
                          title={`${
                            row.original.recordedclasses * currentIndex[row.index]
                          } recorded sessions`}
                        />
                        <br />
                        <p> {row.original.recordedclasses * currentIndex[row.index]} </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <img
                          src="./assets/offeringImages/one-on-one-online.svg"
                          alt="one on one online"
                          title={`${
                            row.original.ptonline * currentIndex[row.index]
                          } One-on-One online sessions`}
                        />
                        <br />
                        <p>{row.original.ptonline * currentIndex[row.index]}</p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/one-on-one-offline.svg"
                          alt="one on one offline"
                          title={`${
                            row.original.ptoffline * currentIndex[row.index]
                          } One-on-One offline sessions`}
                        />
                        <br />
                        <p> {row.original.ptoffline * currentIndex[row.index]} </p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/group-class-online.svg"
                          alt="group online"
                          title={`${
                            row.original.grouponline * currentIndex[row.index]
                          } group online sessions`}
                        />
                        <br />
                        <p> {row.original.grouponline * currentIndex[row.index]} </p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/group-class-offline.svg"
                          alt="group offline"
                          title={`${
                            row.original.groupoffline * currentIndex[row.index]
                          } group offline sessions`}
                        />
                        <br />
                        <p> {row.original.groupoffline * currentIndex[row.index]} </p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/classic-class-online.svg"
                          alt="recorded online"
                          title={`${
                            row.original.recordedclasses * currentIndex[row.index]
                          } recorded sessions`}
                        />
                        <br />
                        <p> {row.original.recordedclasses * currentIndex[row.index]}</p>
                      </div>
                    </>
                  )
                ) : null}
                {row.original.type === 'Group Class' ? (
                  row.original.mode === 'Online' ? (
                    <>
                      <div>
                        <img
                          src="./assets/offeringImages/group-class-online.svg"
                          alt="group online"
                          title={`${
                            row.original.pricing &&
                            row.original.pricing[selectedDuration[row.index]]?.classes
                          } group online sessions`}
                        />
                        <br />
                        <p>
                          {' '}
                          {row.original.pricing &&
                            row.original.pricing[selectedDuration[row.index]]?.classes}{' '}
                        </p>
                      </div>
                    </>
                  ) : row.original.mode === 'Offline' ? (
                    <>
                      <div>
                        <img
                          src="./assets/offeringImages/group-class-offline.svg"
                          alt="group offline"
                          title={`${
                            row.original.pricing &&
                            row.original.pricing[selectedDuration[row.index]]?.classes
                          } group offline sessions`}
                        />
                        <br />
                        <p>
                          {' '}
                          {row.original.pricing &&
                            row.original.pricing[selectedDuration[row.index]]?.classes}{' '}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <img
                          src="./assets/offeringImages/group-class-online.svg"
                          title={`${
                            row.original.pricing &&
                            row.original.pricing[selectedDuration[row.index]].classes
                          } group online sessions`}
                          alt="group online"
                        />
                        <br />
                        <p>
                          {' '}
                          {row.original.pricing &&
                            row.original.pricing[selectedDuration[row.index]].classes}{' '}
                        </p>
                      </div>
                      <div>
                        <img
                          title={`${
                            row.original.pricing &&
                            row.original.pricing[selectedDuration[row.index]].classes
                          } group offline sessions`}
                          src="./assets/offeringImages/group-class-offline.svg"
                          alt="group offline"
                        />
                        <br />
                        <p>
                          {' '}
                          {row.original.pricing &&
                            row.original.pricing[selectedDuration[row.index]].classes}{' '}
                        </p>
                      </div>
                    </>
                  )
                ) : null}
                {row.original.type === 'Classic Class' ? (
                  <div>
                    <img
                      src="./assets/offeringImages/classic-class-online.svg"
                      title={`${
                        row.original.recordedclasses * currentIndex[row.index]
                      } recorded sessions`}
                      alt="recorded online"
                    />
                    <br />
                    <p> {row.original.recordedclasses * currentIndex[row.index]}</p>
                  </div>
                ) : null}
                {row.original.type === 'Cohort' || row.original.type === 'Event' ? (
                  <div
                    title={`${
                      Object.keys(sessionsObj).length
                        ? `Start date: ${moment(row.original.startDate).format(
                            'DD-MM-YYYY'
                          )} - End date: ${moment(row.original.endDate).format('DD-MM-YYYY')},${
                            differenceBetweenStartDateandEndDate - lengthOfobject
                              ? `${
                                  differenceBetweenStartDateandEndDate - lengthOfobject
                                } sessions to build`
                              : null
                          }`
                        : `No session, build sessions`
                    }`}>
                    <Icon name="info" style={{ width: '25px', height: '30px' }} />
                  </div>
                ) : null}
                {row.original.type === 'Live Stream Channel' ? (
                  <div
                    title={`${
                      Object.keys(sessionsObj).length
                        ? `${Object.keys(sessionsObj).length} sessions build`
                        : `No session, build sessions`
                    }`}>
                    <Icon name="info" style={{ width: '25px', height: '30px' }} />
                    <br />
                  </div>
                ) : null}
                {row.original.type === 'On-Demand PT' ? (
                  <div>
                    <div title="1 session">
                      <Icon name="info" style={{ width: '25px', height: '30px' }} />
                    </div>
                    <br />
                  </div>
                ) : null}
                {row.original.type === 'One-On-One' ? (
                  row.original.mode === 'Online' ? (
                    <>
                      <div>
                        <img
                          title={`${
                            row.original.ptonline * currentIndex[row.index]
                          } One-on-One online sessions`}
                          src="./assets/offeringImages/one-on-one-online.svg"
                          alt="one on one online"
                        />
                        <br />
                        <p> {row.original.ptonline * currentIndex[row.index]} </p>
                      </div>
                    </>
                  ) : row.original.mode === 'Offline' ? (
                    <>
                      <div>
                        <img
                          src="./assets/offeringImages/one-on-one-offline.svg"
                          alt="one on one offline"
                          title={`${
                            row.original.ptoffline * currentIndex[row.index]
                          } One-on-One offline sessions`}
                        />
                        <br />
                        <p> {row.original.ptoffline * currentIndex[row.index]} </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <img
                          src="./assets/offeringImages/one-on-one-online.svg"
                          alt="one on one online"
                          title={`${
                            row.original.ptonline * currentIndex[row.index]
                          } One-on-One online sessions`}
                        />
                        <br />
                        <p>{row.original.ptonline * currentIndex[row.index]}</p>
                      </div>
                      <div>
                        <img
                          src="./assets/offeringImages/one-on-one-offline.svg"
                          alt="one on one offline"
                          title={`${
                            row.original.ptoffline * currentIndex[row.index]
                          } One-on-One offline sessions`}
                        />
                        <br />
                        <p> {row.original.ptoffline * currentIndex[row.index]} </p>
                      </div>
                    </>
                  )
                ) : null}
              </div>
            );
        }
      },
      {
        accessor: 'duration',
        Header: 'Duration',
        Cell: ({ row }: any) => {
          return (
            <>
              {
                row.original.type === 'Event' ? (
                  '1 day event'
                ) : (
                  <Form.Group>
                    <Form.Control
                      id={row.index}
                      value={selectedDuration[row.index]}
                      as="select"
                      onChange={(e) => {
                        const updateSelectedDuration = [...selectedDuration];
                        const updateCurrentindex = [...currentIndex];

                        let value = 1;
                        if (e.target.value === '1') {
                          value *= 3;
                        } else if (e.target.value === '2') {
                          value *= 6;
                        } else if (e.target.value === '3') {
                          value *= 12;
                        }
                        updateSelectedDuration[row.index] = Number(e.target.value);
                        updateCurrentindex[row.index] = value;

                        setSelectedDuration(updateSelectedDuration);
                        setCurrentIndex(updateCurrentindex);
                      }}>
                      {row.values.duration.map((item: number, index: number) => {
                        return (
                          <option key={index} value={index}>
                            {item !== 0 && item} {item === 1 ? 'day' : 'days'}
                          </option>
                        );
                      })}
                    </Form.Control>
                  </Form.Group>
                )
                
              }
            </>
          );
        }
      },
      {
        accessor: 'mrp',
        Header: 'MRP',
        Cell: ({ row }: any) => {
          const pricing = row.values.mrp[selectedDuration[row.index]];

          return (
            <>
              <p
                className={`text-capitalize ${
                  pricing === 'free' ? 'text-success font-weight-bold' : ''
                }`}>
                {pricing === 'free' ? '' : '\u20B9'} {pricing}
              </p>
            </>
          );
        }
      },

      {
        accessor: 'sessions',
        Header: 'Status',
        Cell: (value: any) => {
          const sessionsObj = {};
          const startMoment = moment(value.row.original.startDate);
          const endMoment = moment(value.row.original.endDate).add(1, 'days');

          value.row.original.sessions.map((curr) => {
            return curr.sessions.map((item) => {
              sessionsObj[item.session_date] = (sessionsObj[item.session_date] || 0) + 1;

              return sessionsObj;
            });
          });

          const lengthOfobject = Object.keys(sessionsObj).length;

          const differenceBetweenStartDateandEndDate = endMoment.diff(startMoment, 'days');

          const manageHandler = (id: number, length: number, type: string) => {
            let name = '';
            if (type === 'Classic Class') {
              name = 'classic';
            } else if (type === 'Live Stream Channel') {
              name = 'channel';
            } else if (type === 'Cohort' || type === 'Event') {
              name = 'cohort';
            } else if (type === 'Group Class') {
              name = 'group';
            }
            if (length > 1) {
              window.open(`${name}/session/scheduler/${id}`, '_self');
            } else {
              window.open(`${name}/session/scheduler/${id}`, '_self');
            }
          };

          return value.row.original.type === 'Group Class' ||
            value.row.original.type === 'Live Stream Channel' ? (
            Object.keys(sessionsObj).length === 3 ? (
              <Badge
                className="px-3 py-1"
                style={{ fontSize: '1rem', borderRadius: '10px' }}
                variant={'success'}>
                {'Published'}
              </Badge>
            ) : (
              <>
                <ProgressBar
                  variant="success"
                  now={(lengthOfobject * 100) / 3}
                />
                {lengthOfobject}/3{' '}
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    manageHandler(
                      value.row.original.tagId,
                      value.row.original.tagId.length,
                      value.row.original.type
                    )
                  }>
                  sessions to publish
                </div>
              </>
            )
          ) : value.row.original.type !== 'One-On-One' &&
            value.row.original.type !== 'Custom Fitness' &&
            value.row.original.type !== 'On-Demand PT' ? (
            <div>
              {(value.row.original.type === 'Classic Class'
                ? value.row.original.duration[0]
                : differenceBetweenStartDateandEndDate) === Object.keys(sessionsObj).length ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: '1rem', borderRadius: '10px' }}
                  variant={'success'}>
                  {'Published'}
                </Badge>
              ) : (
                <>
                  <ProgressBar
                    variant="success"
                    now={(lengthOfobject * 100) / differenceBetweenStartDateandEndDate}
                  />
                  {lengthOfobject}/
                  {value.row.original.type === 'Classic Class'
                    ? value.row.original.duration[0]
                    : differenceBetweenStartDateandEndDate}{' '}
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      manageHandler(
                        value.row.original.tagId,
                        value.row.original.tagId.length,
                        value.row.original.type
                      )
                    }>
                    sessions to publish
                  </div>
                </>
              )}{' '}
            </div>
          ) : (
            <div>
              {value.row.original.status ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: '1rem', borderRadius: '10px' }}
                  variant={'success'}>
                  {'Published'}
                </Badge>
              ) : (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: '1rem', borderRadius: '10px' }}
                  variant={'danger'}>
                  {'Draft'}
                </Badge>
              )}
            </div>
          );
        }
      },
      {
        accessor: 'Preview',
        Header: 'Preview',
        Cell: ({ row }: any) => {
          return (
            <DrawerTrigger
              toggle={() => {
                setShowDrawer(!showDrawer);
                setTriggeredDetails({
                  type: row.original.type,
                  name: row.original.packagename,
                  level: row.original.level,
                  thumbnailId: row.original.thumbnailId,
                  pricing: row.original.pricing,
                  address: row.original.address,
                  ptonline: row.original.ptonline,
                  ptoffline: row.original.ptoffline,
                  grouponline: row.original.grouponline,
                  groupoffline: row.original.groupoffline,
                  recordedclasses: row.original.recordedclasses
                });
              }}
            />
          );
        }
      },
      {
        id: 'edit',
        Header: 'Actions',
        Cell: ({ row }: any) => {
          const editHandler = () => {
            handleModalRender(row.original.id, 'edit', row.original.type);
          };

          const statusChangeHandler = () => {
            handleModalRender(
              row.original.id,
              'toggle-status',
              row.original.type,
              row.original.status
            );
          };

          const viewHandler = () => {
            handleModalRender(row.original.id, 'view', row.original.type);
          };

          const deleteHandler = () => {
            handleModalRender(row.original.id, 'delete', row.original.type);
          };

          const manageHandler = (id: number, length: number, type: string) => {
            let name = '';
            if (type === 'Classic Class') {
              name = 'classic';
            } else if (type === 'Live Stream Channel') {
              name = 'channel';
            } else if (type === 'Cohort' || type === 'Event') {
              name = 'cohort';
            } else if (type === 'Group Class') {
              name = 'group';
            }
            if (length > 1) {
              window.open(`${name}/session/scheduler/${id}`, '_self');
            } else {
              window.open(`${name}/session/scheduler/${id}`, '_self');
            }
          };

          const arrayAction = [
            { actionName: 'Edit', actionClick: editHandler },
            { actionName: 'View', actionClick: viewHandler },
            { actionName: 'Delete', actionClick: deleteHandler }
          ];

          if (
            row.original.tagId.length >= 1 &&
            row.original.type !== 'One-On-One' &&
            row.original.type !== 'Custom Fitness' &&
            row.original.type !== 'On-Demand PT'
          ) {
            for (let i = 0; i < row.original.tagId.length; i++) {
              arrayAction.push({
                actionName: `Manage ${
                  row.original.tagId.length === 1 ? '' : row.original.tagname[i]
                }`,
                actionClick: () =>
                  manageHandler(row.original.tagId[i], row.original.tagId.length, row.original.type)
              });
            }
          } else if (
            row.original.type === 'One-On-One' ||
            row.original.type === 'Custom Fitness' ||
            row.original.type === 'On-Demand PT'
          ) {
            arrayAction.push({
              actionName: 'Status Change',
              actionClick: statusChangeHandler
            });
          }

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        }
      }
    ],
    // eslint-disable-next-line
    [selectedDuration, currentIndex]
  );

  const [dataTable, setDataTable] = useState<any>([]);

  // eslint-disable-next-line
  const [tags, { data: get_tags, refetch: refetch_tags, loading: tagsLoading }] = useLazyQuery(
    GET_TAGS,
    {
      fetchPolicy: 'cache-and-network',
      onCompleted: () => {
        const tagsFlattenData = flattenObj({ ...get_tags });
        const fitnessFlattenData = flattenObj({ ...get_fitness });

        setDataTable(
          [...fitnessFlattenData?.fitnesspackages].map((item) => {
            return {
              totalRecords: totalRecords,
              sessions: tagsFlattenData.tags.filter(
                (currentValue) => currentValue.fitnesspackage.id === item.id
              ),
              tagId: tagsFlattenData.tags
                .filter((currentValue) => currentValue.fitnesspackage.id === item.id)
                .map((currentValue) => [currentValue.id]),
              tagname: tagsFlattenData.tags
                .filter((currentValue) => currentValue.fitnesspackage.id === item.id)
                .map((currentValue) => [currentValue.tag_name]),
              thumbnailId: item.Thumbnail_ID,
              level: item.level,
              id: item.id,
              address: item.address,
              packagename: item.packagename,
              firstName: item.users_permissions_user.First_Name,
              lastName: item.users_permissions_user.Last_Name,
              ptonline: item.ptonline,
              ptoffline: item.ptoffline,
              grouponline: item.grouponline,
              groupoffline: item.groupoffline,
              recordedclasses: item.recordedclasses,
              status: item.Status,
              type: item.fitness_package_type.type,
              details: [
                item.ptonline,
                item.ptoffline,
                item.grouponline,
                item.groupoffline,
                item.recordedclasses,
                item.duration,
                item.mode
              ],
              duration: item.fitnesspackagepricing.map((i) => i.duration),
              mrp: item.fitnesspackagepricing.map((i) => i.mrp),
              Status: item.Status ? 'Active' : 'Inactive',
              publishingDate: item.publishing_date,
              mode: item.mode,
              days: item.duration,
              pricing: item.fitnesspackagepricing,
              freeClass: item.groupinstantbooking,
              startDate: item.Start_date,
              endDate: item.End_date
            };
          })
        );

        setSelectedDuration(new Array(fitnessFlattenData.fitnesspackages.length).fill(0));
        setCurrentIndex(new Array(fitnessFlattenData.fitnesspackages.length).fill(1));
      }
    }
  );

  const {
    data: get_fitness,
    refetch: refetchFitness,
    loading: fitnessLoading
  } = useQuery(GET_FITNESS, {
    variables: { id: auth.userid, start: page * 10 - 10, limit: 10 },
    onCompleted: (data) => {
      setTotalRecords(data.fitnesspackages.meta.pagination.total);
      tags({
        variables: { id: auth.userid, pageSize: data.fitnesspackages.meta.pagination.total }
      });
    }
  });

  const pageHandler = (selectedPageNumber: number) => {
    setPage(selectedPageNumber);
  };

  return (
    <>
      <Drawer show={showDrawer} close={() => setShowDrawer(false)} details={triggeredDetails} />

      {showDrawer ? <Backdrop close={() => setShowDrawer(false)} /> : null}
      <TabContent>
        <div className="justify-content-lg-center d-flex overflow-auto p-3">
          <DropdownButton
            className="mx-3"
            variant="outline-secondary"
            id="dropdown-basic-button"
            title={
              <span>
                <i className="fas fa-plus-circle"></i> One-On-One
              </span>
            }>
            <Dropdown.Item
              onClick={() => {
                handleModalRender(null, 'create', 'One-On-One');
              }}>
              Package subscription
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleModalRender(null, 'create', 'On-Demand PT');
              }}>
              On-Demand
            </Dropdown.Item>
          </DropdownButton>
          <Button
            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
            className="mx-3"
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              handleModalRender(null, 'create', 'Group Class');
            }}>
            <i className="fas fa-plus-circle"></i> Group
          </Button>
          <Button
            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
            className="mx-3"
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              handleModalRender(null, 'create', 'Classic Class');
            }}>
            <i className="fas fa-plus-circle"></i> Recorded
          </Button>
          <Button
            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
            className="mx-3"
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              handleModalRender(null, 'create', 'Custom Fitness');
            }}>
            <i className="fas fa-plus-circle"></i> Custom
          </Button>
          <Button
            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
            className="mx-3"
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              handleModalRender(null, 'create', 'Live Stream Channel');
            }}>
            <i className="fas fa-plus-circle"></i> Live Stream
          </Button>
          <Button
            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
            className="mx-3"
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              handleModalRender(null, 'create', 'Cohort');
            }}>
            <i className="fas fa-plus-circle"></i> Cohort
          </Button>
          <Button
            style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
            className="mx-3"
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              handleModalRender(null, 'create', 'Event');
            }}>
            <i className="fas fa-plus-circle"></i> Event
          </Button>
        </div>
        <Container>
          <Row>
            <Col>
              <Card.Title className="text-center">
                <CreateEditViewChannel
                  totalRecords={totalRecords}
                  ref={createEditViewChannelRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}></CreateEditViewChannel>
                <CreateEditViewCohort
                  totalRecords={totalRecords}
                  ref={createEditViewCohortRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}></CreateEditViewCohort>
                <CreateEditViewEvent
                  totalRecords={totalRecords}
                  ref={createEditViewEventRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}></CreateEditViewEvent>

                <CreateEditViewPersonalTraining
                  ref={createEditViewPersonalTrainingRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
                <CreateEditViewOnDemandPt
                  ref={CreateEditViewOnDemandPtRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
                <CreateEditViewGroupClass
                  totalRecords={totalRecords}
                  ref={CreateEditViewGroupClassRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
                <CreateEditViewClassicClass
                  totalRecords={totalRecords}
                  ref={CreateEditViewClassicClassRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
                <CreateEditViewCustomFitness
                  totalRecords={totalRecords}
                  ref={CreateEditViewCustomFitnessRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
              </Card.Title>
            </Col>
          </Row>
        </Container>

        {fitnessLoading || tagsLoading ? (
          <Loader msg="Fitness packages loading..." style={{ marginTop: '30vh' }} />
        ) : (
          <Table
            columns={columns}
            data={dataTable}
            fitnessloading={fitnessLoading}
            tagsLoading={tagsLoading}
          />
        )}
      </TabContent>

      {/* Pagination */}
      {fitnessLoading || tagsLoading ? null : dataTable && dataTable.length ? (
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
            disabled={totalRecords > page * 10 - 10 + dataTable.length ? false : true}>
            Next
          </Button>
          <span className="m-2 bold pt-2">{`${page * 10 - 10 + 1} - ${
            page * 10 - 10 + dataTable.length
          }`}</span>
        </Row>
      ) : null}
    </>
  );
}
