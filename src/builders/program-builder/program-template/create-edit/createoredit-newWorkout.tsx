import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import ModalView from '../../../../components/modal';
import {
    GET_SCHEDULEREVENTS,
    CREATE_WORKOUT,
    CREATE_SESSION,
    UPDATE_TAG_SESSIONS,
    CREATE_SESSION_BOOKING,
    GET_TEMPLATE_SESSIONS,
    UPDATE_FITNESSPORGRAMS_SESSIONS
} from '../queries';
import AuthContext from '../../../../context/auth-context';
import { schema, widgets } from '../schema/newWorkoutSchema';
import { Subject } from 'rxjs';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';
import { AvailabilityCheck } from './availabilityCheck';
import { Modal, Button } from 'react-bootstrap';
import Toaster from '../../../../components/Toaster';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

function CreateEditNewWorkout(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const programSchema: {
        [name: string]: any;
    } = require(window.location.pathname.includes('session')
        ? '../json/sessionManager/newWorkout.json'
        : '../json/newWorkout.json');
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const program_id = window.location.pathname.split('/').pop();
    let frmDetails: any;
    const [templateSessionsIds, setTemplateSessionsIds] = useState<any>([]);
    // userId here is the new sessionID.
    const [userId, setUserId] = useState<string>('');
    const [dropConflict, setDropConflict] = useState<boolean>(false);
    const [isCreated, setIsCreated] = useState<boolean>(false);

    const GET_SESSIONS_BY_DATE = gql`
        query getprogramdata($date: Date) {
            sessions(filters: { session_date: { eq: $date }, type: { ne: "restday" } }) {
                data {
                    id
                    attributes {
                        tag
                        start_time
                        end_time
                    }
                }
            }
        }
    `;

    const query = useQuery(GET_SESSIONS_BY_DATE, { skip: true });

    useQuery(GET_TEMPLATE_SESSIONS, {
        variables: { id: program_id },
        skip: window.location.pathname.split('/')[1] !== 'programs',
        onCompleted: (data) => {
            const flattenData = flattenObj({ ...data });
            const templateExistingValues = [...templateSessionsIds];
            for (let q = 0; q < flattenData.fitnessprograms[0].sessions.length; q++) {
                templateExistingValues.push(flattenData.fitnessprograms[0].sessions[q].id);
            }
            setTemplateSessionsIds(templateExistingValues);
        }
    });

    const [createWorkout] = useMutation(CREATE_WORKOUT, {
        onCompleted: (response) => {
            updateSchedulerEvents(frmDetails, response.createWorkout.data.id);
            modalTrigger.next(false);
        }
    });

    const [createSessionBooking] = useMutation(CREATE_SESSION_BOOKING, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
        }
    });

    const [upateSessions] = useMutation(UPDATE_TAG_SESSIONS, {
        onCompleted: () => {
            if (props?.clientIds.length > 0) {
                for (let i = 0; i < props?.clientIds.length; i++) {
                    createSessionBooking({
                        variables: {
                            session: userId,
                            client: props.clientIds[i]
                        }
                    });
                }
            } else {
                modalTrigger.next(false);
                props.callback();
            }
        }
    });

    const [updateFitenssProgram] = useMutation(UPDATE_FITNESSPORGRAMS_SESSIONS, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
        }
    });

    const [createSession] = useMutation(CREATE_SESSION, {
        onCompleted: (response) => {
            setIsCreated(!isCreated);
            if (window.location.pathname.split('/')[1] === 'programs') {
                const templateValues = [...templateSessionsIds];
                setUserId(response.createSession.data.id);
                templateValues.push(response.createSession.data.id);
                updateFitenssProgram({
                    variables: {
                        id: program_id,
                        sessions_ids: templateValues
                    }
                });
            }
            if (window.location.pathname.split('/')[1] === 'client') {
                createSessionBooking({
                    variables: {
                        session: response.createSession.data.id,
                        client: program_id
                    }
                });
            } else if (
                window.location.pathname.split('/')[1] !== 'client' &&
                window.location.pathname.split('/')[1] !== 'programs'
            ) {
                const values = [...props.sessionIds];
                // here userId refers to the sessionID
                setUserId(response.createSession.data.id);
                values.push(response.createSession.data.id);
                upateSessions({
                    variables: {
                        id: program_id,
                        sessions_ids: values
                    }
                });
            }
        }
    });

    const modalTrigger = new Subject();
    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
            schema.startDate = props.startDate;
            schema.duration = props.duration;
            schema.type = window.location.pathname.split('/')[1] === 'programs' ? 'day' : '';

            if (msg && !msg.id)
                //render form if no message id
                modalTrigger.next(true);
        }
    }));

    enum ENUM_EXERCISES_EXERCISELEVEL {
        Beginner,
        Intermediate,
        Advanced,
        None
    }

    enum ENUM_WORKOUTS_INTENSITY {
        Low,
        Medium,
        High
    }

    function FillDetails(data: any) {
        const details: any = {};
        setProgramDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit(null);
    }

    function FetchData() {
        useQuery(GET_SCHEDULEREVENTS, {
            variables: { id: program_id },
            skip: !operation.id || operation.type === 'toggle-status',
            onCompleted: (response) => {
                FillDetails(response);
            }
        });
    }

    function handleTimeFormat(time: string) {
        const timeArray = time.split(':');
        const hours = timeArray[0];
        const minutes = timeArray[1];
        const timeString =
            (parseInt(hours) < 10 ? `0${hours}` : hours) +
            ':' +
            (parseInt(minutes) === 0 ? `0${minutes}` : minutes);
        return timeString.toString();
    }

    async function updateSchedulerEvents(frm: any, workout_id: any) {
       
        const existingEvents = props.events === null ? [] : [...props.events];

        if (frm && frm.day) {
            frm.day = JSON.parse(frm.day);
        }

        if (window.location.pathname.split('/')[1] !== 'programs') {
            const variables = {
                date: moment(frm.day[0].day, 'Do, MMM YY').format('YYYY-MM-DD')
            };

            const result = await query.refetch(variables);
            const filterResult = await AvailabilityCheck({
                sessions: result.data.sessions,
                event: frm
            });
            if (filterResult) {
                setDropConflict(true);
                return;
            }
         }

        const eventJson: any = {};
        if (frm.day) {
            frm.time = JSON.parse(frm.time);
            eventJson.type = 'workout';
            eventJson.name = frm.workout;
            eventJson.mode = frm.assignMode;
            eventJson.tag = frm.tag;
            eventJson.id = workout_id;
            eventJson.startTime = handleTimeFormat(frm.time.startTime);
            eventJson.endTime = handleTimeFormat(frm.time.endTime);
            eventJson.day = parseInt(frm.day[0].key);
            if (existingEvents.length === 0) {
                existingEvents.push(eventJson);
            } else {
                const timeStart: any = new Date(
                    '01/01/2007 ' + handleTimeFormat(frm.time.startTime)
                );
                const timeEnd: any = new Date('01/01/2007 ' + handleTimeFormat(frm.time.endTime));
                const diff1 = timeEnd - timeStart;
                for (let i = 0; i <= existingEvents.length - 1; i++) {
                    const startTimeHour: any = new Date(
                        '01/01/2007 ' + handleTimeFormat(existingEvents[i].startTime)
                    );
                    const endTimeHour: any = new Date(
                        '01/01/2007 ' + handleTimeFormat(existingEvents[i].endTime)
                    );
                    const diff2 = endTimeHour - startTimeHour;

                    if (diff2 < diff1) {
                        existingEvents.splice(i, 0, eventJson);
                        break;
                    }
                    if (i === existingEvents.length - 1) {
                        existingEvents.push(eventJson);
                        break;
                    }
                }
            }

            let lastEventDay = 0;

            for (let k = 0; k <= existingEvents.length - 1; k++) {
                if (existingEvents[k].day > lastEventDay) {
                    lastEventDay = parseInt(existingEvents[k].day);
                }
            }

            let data: Record<string, unknown> = {};

            if (window.location.pathname.split('/')[1] === 'programs') {
                data = {
                    start_time: eventJson.startTime,
                    end_time: eventJson.endTime,
                    workout: eventJson.id,
                    type: eventJson.type,
                    day_of_program: eventJson.day,
                    changemaker: auth.userid,
                    session_date: null,
                    isProgram: true
                };
            } else {
                data = {
                    start_time: eventJson.startTime,
                    end_time: eventJson.endTime,
                    workout: eventJson.id,
                    tag: eventJson.tag,
                    mode: eventJson.mode,
                    type: eventJson.type,
                    day_of_program: eventJson.day,
                    session_date: moment(frm.day[0].day, 'Do, MMM YY').format('YYYY-MM-DD'),
                    changemaker: auth.userid,
                    isProgram: false
                };
            }

            createSession({
                variables: data
            });
        }
    }

    function UpdateProgram(frm: any) {
        frmDetails = frm;
        frm.discipline = JSON.parse(frm.discipline);
        frm.equipment = JSON.parse(frm.equipment);
        frm.muscleGroup = JSON.parse(frm.muscleGroup);
        if (frm.addWorkout.AddWorkout === 'Build') {
            if (Object.keys(frm.addWorkout.warmup)[0] === 'exercise') {
                frm.addWorkout.warmup = JSON.parse(frm.addWorkout.warmup.exercise);
            } else {
                frm.addWorkout.warmup.type = Object.keys(frm.addWorkout.warmup)[0];
                frm.addWorkout.warmup.value =
                    frm.addWorkout.warmup[Object.keys(frm.addWorkout.warmup)[0]];
                delete frm.addWorkout.warmup[Object.keys(frm.addWorkout.warmup)[0]];
                frm.addWorkout.warmup = [frm.addWorkout.warmup];
            }
            if (Object.keys(frm.addWorkout.mainmovement)[0] === 'exercise') {
                frm.addWorkout.mainmovement = JSON.parse(frm.addWorkout.mainmovement.exercise);
            } else {
                frm.addWorkout.mainmovement.type = Object.keys(frm.addWorkout.mainmovement)[0];
                frm.addWorkout.mainmovement.value =
                    frm.addWorkout.mainmovement[Object.keys(frm.addWorkout.mainmovement)[0]];
                delete frm.addWorkout.mainmovement[Object.keys(frm.addWorkout.mainmovement)[0]];
                frm.addWorkout.mainmovement = [frm.addWorkout.mainmovement];
            }
            if (Object.keys(frm.addWorkout.cooldown)[0] === 'exercise') {
                frm.addWorkout.cooldown = JSON.parse(frm.addWorkout.cooldown.exercise);
            } else {
                frm.addWorkout.cooldown.type = Object.keys(frm.addWorkout.cooldown)[0];
                frm.addWorkout.cooldown.value =
                    frm.addWorkout.cooldown[Object.keys(frm.addWorkout.cooldown)[0]];
                delete frm.addWorkout.cooldown[Object.keys(frm.addWorkout.cooldown)[0]];
                frm.addWorkout.cooldown = [frm.addWorkout.cooldown];
            }
        }
        createWorkout({
            variables: {
                workouttitle: frm.workout,
                intensity: ENUM_WORKOUTS_INTENSITY[frm.intensity],
                level: ENUM_EXERCISES_EXERCISELEVEL[frm.level],
                fitnessdisciplines: frm.discipline
                    .map((item: any) => {
                        return item.id;
                    })
                    .join(',')
                    .split(','),
                About: frm.about,
                Benifits: frm.benefits,
                warmup: frm.addWorkout.AddWorkout === 'Build' ? frm.addWorkout.warmup : null,
                mainmovement:
                    frm.addWorkout.AddWorkout === 'Build' ? frm.addWorkout.mainmovement : null,
                cooldown: frm.addWorkout.AddWorkout === 'Build' ? frm.addWorkout.cooldown : null,
                workout_text: frm.addWorkout.AddWorkout === 'Text' ? frm.addWorkout.AddText : null,
                workout_URL: frm.addWorkout.AddWorkout === 'Add URL' ? frm.addWorkout.AddURL : null,
                Workout_Video_ID:
                    frm.addWorkout.AddWorkout === 'Upload' ? frm.addWorkout.Upload : null,
                calories: frm.calories,
                equipment_lists: frm.equipment
                    .map((item: any) => {
                        return item.id;
                    })
                    .join(',')
                    .split(','),
                muscle_groups: frm.muscleGroup
                    .map((item: any) => {
                        return item.id;
                    })
                    .join(',')
                    .split(','),
                users_permissions_user: frm.user_permissions_user
            }
        });
    }

    function OnSubmit(frm: any) {
        //bind user id
        if (frm) frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                UpdateProgram(frm);
                break;
        }
    }

    let name = '';
    if (operation.type === 'create') {
        name = 'New Workout';
    } else if (operation.type === 'edit') {
        name = 'Edit';
    } else if (operation.type === 'view') {
        name = 'View';
    }

    FetchData();

    return (
        <>
            <ModalView
                name={name}
                isStepper={true}
                showErrorList={false}
                formUISchema={schema}
                formSchema={programSchema}
                formSubmit={
                    name === 'View'
                        ? () => {
                              modalTrigger.next(false);
                          }
                        : (frm: any) => {
                              OnSubmit(frm);
                          }
                }
                formData={programDetails}
                stepperValues={['Schedule', 'Workout']}
                widgets={widgets}
                modalTrigger={modalTrigger}
            />

            {
                <Modal
                    show={dropConflict}
                    onHide={() => setDropConflict(false)}
                    centered
                    backdrop="static"
                >
                    <Modal.Header>
                        <Modal.Title>Session Conflict</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span>There is already an existing session at this time. Cannot add!</span>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="success"
                            onClick={() => {
                                setDropConflict(false);
                                modalTrigger.next(false);
                            }}
                        >
                            Understood
                        </Button>
                    </Modal.Footer>
                </Modal>
            }

            {/* create toaster */}
            {isCreated && (
                <Toaster
                    handleCallback={() => setIsCreated(!isCreated)}
                    type="success"
                    msg="Workout has been created successfully"
                />
            )}
        </>
    );
}

export default React.forwardRef(CreateEditNewWorkout);
