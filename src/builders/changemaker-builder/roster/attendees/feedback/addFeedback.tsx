import React, { useImperativeHandle, useState, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import ModalView from '../../../../../components/modal';
import {
    ADD_RATING_NEW,
    GET_RATING_NOTES_BYID_NEW,
    GET_NOTES_RATING_NEW,
    ADD_NOTE_NEW,
    UPDATE_RATING_NEW,
    UPDATE_NOTES_NEW,
    DELETE_NOTE_NEW,
    DELETE_COMMENT_NEW,
    DELETE_RATING_NEW
} from './queries';
import AuthContext from '../../../../../context/auth-context';
import { Subject } from 'rxjs';
import { schema, widgets } from './schema';
import StatusModal from '../../../../../components/StatusModal/StatusModal';

interface Operation {
    id: string;
    type: 'create' | 'deleteNote' | 'deleteComment' | 'editNote';
    comments: any;
    resourceid: any;
    resource_id: any;
}

function CreatePosts(props: any, ref: any) {
    const last = window.location.pathname.split('/').pop();
    const auth = useContext(AuthContext);
    const Schema: { [name: string]: any } = require('./post.json');
    const [messageDetails, setMessageDetails] = useState<any>({});
    const [deletion, setDeletion] = useState<any>(null);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [showDeleteNoteModal, setShowDeleteNoteModal] = useState(false);
    const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);

    const [createRating] = useMutation(ADD_RATING_NEW, {
        onCompleted: (r: any) => {
            modalTrigger.next(false);
        }
    });
    const [createNote] = useMutation(ADD_NOTE_NEW, {
        onCompleted: (r: any) => {
            modalTrigger.next(false);
        }
    });
    const [updaterating] = useMutation(UPDATE_RATING_NEW, {
        onCompleted: (r: any) => {
            modalTrigger.next(false);
        }
    });
    const [updatenote] = useMutation(UPDATE_NOTES_NEW, {
        onCompleted: (r: any) => {
            modalTrigger.next(false);
        }
    });
    const [deleteNote] = useMutation(DELETE_NOTE_NEW, {});
    const [deleteComment] = useMutation(DELETE_COMMENT_NEW, {});
    const [deleteRating] = useMutation(DELETE_RATING_NEW, {});

    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            // set show delete note modal for delete Note operation
            if (msg.type === 'deleteNote') {
                setShowDeleteNoteModal(true);
            }

            // set show delete comment modal for delete Comment operation
            if (msg.type === 'deleteComment') {
                setShowDeleteCommentModal(true);
            }

            // restrict modal to render for delete note and delete comment operation
            if (msg.type !== 'deleteNote' && msg.type !== 'deleteComment') {
                modalTrigger.next(true);
            }
        }
    }));

    useQuery(GET_NOTES_RATING_NEW, {
        variables: { id: operation.resource_id, clientid: last },
        skip: !operation.resource_id,
        onCompleted: (e: any) => {
            FillDetails(e);
        }
    });

    function FillDetails(data: any) {
        const details: any = {};
        const msg = data.feedbackNotes[0];
        const rate1 = data.ratings[0];
        const rate2 = data.ratings[1];

        const o = { ...operation };
        details.name = o.type.toLowerCase();

        details.packagesearch = msg.resource_id;
        details.widget = JSON.stringify({ rpm: rate1, mood: rate2, note: msg.note });
        details.notesmessageid = msg.id;
        details.rpmmessageid = rate1.id;
        details.moodmessageid = rate2.id;

        setMessageDetails(details);
        setOperation({} as Operation);

        if (['editNote'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit(null);
    }

    function CreatePost(frm: any) {
        const searchid: any = frm.packagesearch.split(',');
        const widget: any = JSON.parse(frm.widget);

        if (widget.rpm > 0) {
            createRating({
                variables: {
                    type: 'rpm',
                    resource_type: 'workout',
                    resource_id: searchid[0],
                    rating: widget.rpm,
                    clientid: last,
                    max_rating: widget.rpm_max,
                    rating_scale_id: widget.rpm_id,
                    user_permissions_user: auth.userid
                }
            });
        }
        if (widget.mood > 0) {
            createRating({
                variables: {
                    type: 'mood',
                    resource_type: 'workout',
                    resource_id: searchid[0],
                    rating: widget.mood,
                    clientid: last,
                    max_rating: widget.mood_max,
                    rating_scale_id: widget.mood_id,
                    user_permissions_user: auth.userid
                }
            });
        }
        if (widget.note) {
            createNote({
                variables: {
                    type: 'workout',
                    resource_id: searchid[0],
                    user_permissions_user: auth.userid,
                    note: widget.note,
                    clientid: last
                }
            });
        }
    }

    useQuery(GET_RATING_NOTES_BYID_NEW, {
        variables: { id: operation.resourceid, clientid: last },
        skip:
            !operation.id ||
            operation.type === 'deleteComment' ||
            operation.type === 'editNote' ||
            !operation.resourceid,
        onCompleted: (e: any) => {
            DeleteRatings(e);
        }
    });

    function DeleteRatings(e: any) {
        setDeletion(e);
    }

    function DeleteNotesRatingPermanent() {
        for (let i = 0; i < deletion.ratings.length; i++) {
            deleteRating({ variables: { id: deletion.ratings[i].id } });
        }
    }

    function DeleteNote(id: any, comments: any) {
        deleteNote({ variables: { id: id } });

        for (let i = 0; i < comments.length; i++) {
            deleteComment({ variables: { id: comments[i].id } });
        }
    }
    function DeleteComment(id: any) {
        deleteComment({ variables: { id: id } });
    }

    function EditNote(frm: any) {
        const searchid: any = frm.packagesearch.split(',');
        const widget: any = JSON.parse(frm.widget);

        if (widget.rpm > 0) {
            updaterating({
                variables: {
                    type: 'rpm',
                    resource_type: 'workout',
                    resource_id: searchid[0],
                    rating: widget.rpm,
                    clientid: last,
                    max_rating: widget.rpm_max,
                    rating_scale_id: widget.rpm_id,
                    user_permissions_user: auth.userid,
                    messageid: frm.rpmmessageid
                }
            });
        }
        if (widget.mood > 0) {
            updaterating({
                variables: {
                    type: 'mood',
                    resource_type: 'workout',
                    resource_id: searchid[0],
                    rating: widget.mood,
                    clientid: last,
                    max_rating: widget.mood_max,
                    rating_scale_id: widget.mood_id,
                    user_permissions_user: auth.userid,
                    messageid: frm.moodmessageid
                }
            });
        }
        if (widget.note) {
            updatenote({
                variables: {
                    type: 'workout',
                    resource_id: searchid[0],
                    user_permissions_user: auth.userid,
                    note: widget.note,
                    clientid: last,
                    messageid: frm.notesmessageid
                }
            });
        }
    }

    function OnSubmit(frm: any) {
        if (frm) frm.user_permissions_user = auth.userid;
        if (frm.name === 'editnote') {
            if (frm.name === 'editnote') {
                EditNote(frm);
            }
        } else {
            CreatePost(frm);
        }
    }
    return (
        <>
            <ModalView
                name={operation.type}
                isStepper={false}
                formUISchema={schema}
                formSchema={Schema}
                formSubmit={(frm: any) => {
                    OnSubmit(frm);
                }}
                formData={messageDetails}
                widgets={widgets}
                modalTrigger={modalTrigger}
            />

            {/* Delete Note Modal */}
            {showDeleteNoteModal && (
                <StatusModal
                    show={showDeleteNoteModal}
                    onHide={() => setShowDeleteNoteModal(false)}
                    modalTitle="Delete"
                    modalBody="Do you want to delete this Feedback?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        DeleteNote(operation.id, operation.comments);
                        DeleteNotesRatingPermanent();
                    }}
                />
            )}

            {/* Delete Comment Modal */}
            {showDeleteCommentModal && (
                <StatusModal
                    show={showDeleteCommentModal}
                    onHide={() => setShowDeleteCommentModal(false)}
                    modalTitle="Delete"
                    modalBody="Do you want to delete this Comment?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        DeleteComment(operation.id);
                    }}
                />
            )}
        </>
    );
}

export default React.forwardRef(CreatePosts);
