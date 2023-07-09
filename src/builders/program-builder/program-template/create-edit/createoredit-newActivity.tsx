import React, { useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ModalView from '../../../../components/modal';
import {
    GET_SCHEDULEREVENTS,
    CREATE_SESSION,
    UPDATE_TAG_SESSIONS,
    CREATE_SESSION_BOOKING,
    GET_TEMPLATE_SESSIONS,
    UPDATE_FITNESSPORGRAMS_SESSIONS
} from '../queries';
import AuthContext from '../../../../context/auth-context';
import { schema, widgets } from '../schema/newActivitySchema';
import { Subject } from 'rxjs';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';
import Toaster from '../../../../components/Toaster';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
    current_status: boolean;
}

interface Form {
    user_permissions_user: string;
    time: {startTime: string; endTime: string;};
    day: {key: number; day: string;}[];
    newActivity: Record<string, unknown>[];
    name?: string;
}

function CreateEditActivity(props: any, ref: any): JSX.Element {
    const auth = useContext(AuthContext);
    const programSchema: Record<string, unknown> = require('../json/newActivity.json');
    const [programDetails, setProgramDetails] = useState<any>({});
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const program_id = window.location.pathname.split('/').pop();
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const [isFormUpdated, setIsFormUpdated] = useState<boolean>(false);
    const [templateSessionsIds, setTemplateSessionsIds] = useState<any>([]);

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

    const [createSessionBooking] = useMutation(CREATE_SESSION_BOOKING, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
        }
    });

    const [upateSessions] = useMutation(UPDATE_TAG_SESSIONS, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
            setIsFormUpdated(!isFormUpdated);
        }
    });

    const [createSession] = useMutation(CREATE_SESSION, {
        onCompleted: () => {
            setIsCreated(!isCreated);
        }
    });

    const [updateTemplateSessions] = useMutation(UPDATE_FITNESSPORGRAMS_SESSIONS, {
        onCompleted: () => {
            modalTrigger.next(false);
            props.callback();
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

    function FillDetails() {
        const details: any = {};
        setProgramDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit({} as Form);
    }

    useQuery(GET_SCHEDULEREVENTS, {
        variables: { id: program_id },
        skip: !operation.id || operation.type === 'toggle-status',
        onCompleted: () => {
            FillDetails();
        }
    });

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

    function handleTimeInMinutes(time: string) {
        const timeArray = time.split(':');
        const hours = +timeArray[0] * 60;
        const minutes = +timeArray[1];
        const timeInMinutes = hours + minutes;
        return timeInMinutes;
    }

    function UpdateProgram(frm: any) {
        const existingEvents = props.events === null ? [] : [...props.events];
        const daysArray: any = [];
        let id: any;

        if (frm.day && frm.newActivity) {
            frm.day = JSON.parse(frm.day);
            frm.time = JSON.parse(frm.time);
            frm.newActivity = JSON.parse(frm.newActivity);

            const name: string = frm.newActivity[0].activity;
            id = frm.newActivity[0].id;
            delete frm.newActivity[0].activity;
            delete frm.newActivity[0].id;
            for (let i = 0; i < frm.day.length; i++) {
                daysArray.push({
                    day: parseInt(frm.day[i].key),
                    name: name,
                    id: id,
                    type: 'activity',
                    startTime: frm.time.startTime,
                    endTime: frm.time.endTime,
                    activityTarget: frm.newActivity[0]
                });
            }
            for (let j = 0; j < daysArray.length; j++) {
                if (existingEvents.length === 0) {
                    existingEvents.push(daysArray[j]);
                } else {
                    const timeStart: any = new Date(
                        '01/01/2007 ' + handleTimeFormat(frm.time.startTime)
                    );
                    const timeEnd: any = new Date(
                        '01/01/2007 ' + handleTimeFormat(frm.time.endTime)
                    );
                    const diff1 = timeEnd - timeStart;
                    for (let k = 0; k <= existingEvents.length - 1; k++) {
                        const startTimeHour: any = new Date(
                            '01/01/2007 ' + handleTimeFormat(existingEvents[k].startTime)
                        );
                        const endTimeHour: any = new Date(
                            '01/01/2007 ' + handleTimeFormat(existingEvents[k].endTime)
                        );
                        const diff2 = endTimeHour - startTimeHour;

                        if (diff2 < diff1) {
                            existingEvents.splice(k, 0, daysArray[j]);
                            break;
                        }
                        if (k === existingEvents.length - 1) {
                            existingEvents.push(daysArray[j]);
                            break;
                        }
                    }
                }
            }
        }

        let lastEventDay = 0;

        for (let m = 0; m <= existingEvents.length - 1; m++) {
            if (existingEvents[m].day > lastEventDay) {
                lastEventDay = parseInt(existingEvents[m].day);
            }
        }

        const sessionIds_new: any = [];
        // const sessionIds_old: string[] = [...props.sessionIds];
        const sessionIds_old: string[] = [];
        const templateIds_old: string[] = [...templateSessionsIds];

        function updateSessionFunc(id: string) {
            sessionIds_new.push(id);
            if (frm.day.length === sessionIds_new.length) {
                upateSessions({
                    variables: {
                        id: program_id,
                        sessions_ids: sessionIds_old.concat(sessionIds_new)
                    }
                });
            }
        }

        function updateTemplateSessionsFunc(id: any) {
            sessionIds_new.push(id);
            if (frm.day.length === sessionIds_new.length) {
                updateTemplateSessions({
                    variables: {
                        id: program_id,
                        sessions_ids: templateIds_old.concat(sessionIds_new)
                    }
                });
            }
        }

        for (let z = 0; z < frm.day.length; z++) {
            createSession({
                variables: {
                    start_time: handleTimeFormat(frm.time.startTime),
                    end_time: handleTimeFormat(frm.time.endTime),
                    activity: id,
                    activity_target: frm.newActivity[0],
                    day_of_program: frm.day[z].key,
                    type: 'activity',
                    session_date: moment(frm.day[z].day, 'Do, MMM YY').format('YYYY-MM-DD'),
                    changemaker: auth.userid,
                    isProgram: true,
                    SessionTitle: frm.newActivity[0].activity,
                    SessionDurationMinutes: (handleTimeInMinutes(frm.time.endTime) - handleTimeInMinutes(frm.time.startTime)).toString()
                },
                onCompleted: (data) => {
                    if (window.location.pathname.split('/')[1] === 'client') {
                        createSessionBooking({
                            variables: {
                                session: data.createSession.data.id,
                                client: program_id
                            }
                        });
                    } else {
                        if (window.location.pathname.split('/')[1] === 'programs') {
                            return updateTemplateSessionsFunc(data.createSession.data.id);
                        } else {
                            return updateSessionFunc(data.createSession.data.id);
                        }
                    }
                }
            });
        }
    }

    function OnSubmit(form: Form) {
        if (form) form.user_permissions_user = auth.userid;
        if (form.name === 'edit' || form.name === 'view') {
            if (form.name === 'edit') {
                //EditMessage(frm);
            }
            if (form.name === 'view') {
                modalTrigger.next(false);
            }
        } else {
            UpdateProgram(form);
        }
    }

    return (
        <>
            <ModalView
                name={operation.type}
                isStepper={true}
                showErrorList={false}
                formUISchema={schema}
                formSchema={programSchema}
                formSubmit={(form: Form) => {
                    console.log(form);
                    OnSubmit(form);
                }}
                stepperValues={['Schedule', 'Activity']}
                formData={programDetails}
                widgets={widgets}
                modalTrigger={modalTrigger}
            />

            {/* success toaster notification */}
            {isCreated && (
                <Toaster
                    handleCallback={() => setIsCreated(!isCreated)}
                    type="success"
                    msg="New Activity has been created successfully"
                />
            )}
            {isFormUpdated && (
                <Toaster
                    handleCallback={() => setIsFormUpdated(!isFormUpdated)}
                    type="success"
                    msg="Acitivity has been updated successfully"
                />
            )}
        </>
    );
}

export default React.forwardRef(CreateEditActivity);
