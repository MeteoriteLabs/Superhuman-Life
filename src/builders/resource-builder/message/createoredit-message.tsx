import React, { useMemo, useRef, useContext, useImperativeHandle, useState } from 'react';
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../components/modal";
import { GET_TRIGGERS, ADD_MESSAGE, UPDATE_MESSAGE, GET_MESSAGE, DELETE_MESSAGE } from "./queries";
import AuthContext from "../../../context/auth-context";

interface Operation {
    id?: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
}

function CreateEditMessage(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const messageSchema: { [name: string]: any; } = require("./message.json");
    const uiSchema: {} = require("./schema.json");
    const [messageDetails, setMessageDetails] = useState<any>({});
    const [render, setRender] = useState<boolean>(false);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    

    const [createMessage] = useMutation(ADD_MESSAGE, { onCompleted: (r: any) => { console.log(r); setRender(false); } });
    const [deleteMessage] = useMutation(DELETE_MESSAGE, { onCompleted: (e: any) => console.log(e), refetchQueries: ["GET_TRIGGERS"] });
    

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            console.log(msg);
            setOperation(msg);

            if (msg && !msg.id) //render form if no message id
                setRender(true);
        }
    }));

    function loadData(data: any) {
        messageSchema["1"].properties.prerecordedtype.enum = [...data.prerecordedtypes].map(n => (n.id));
        messageSchema["1"].properties.prerecordedtype.enumNames = [...data.prerecordedtypes].map(n => (n.name));
        messageSchema["1"].properties.prerecordedtrigger.enum = [...data.prerecordedtriggers].map(n => (n.id));
        messageSchema["1"].properties.prerecordedtrigger.enumNames = [...data.prerecordedtriggers].map(n => (n.name));
    }

    function FillDetails(data: any) {
        console.log(data.prerecordedmessage);

        let details: any = {};
        let msg = data.prerecordedmessage;
        details.name = msg.title;
        details.typo = msg.prerecordedtype.id;
        details.mode = msg.prerecordedtrigger.id;
        details.description = msg.description;
        details.minidescription = msg.minidescription;
        details.url = msg.mediaurl;
        details.file = msg.mediaupload.id;
        details.status = msg.status;
        setMessageDetails(details);

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1)
            setRender(true);
        else
            OnSubmit(null);
    }

    function FetchData() {
        console.log('Fetch data', operation.id);
        useQuery(GET_TRIGGERS, { onCompleted: loadData });
        useQuery(GET_MESSAGE, { variables: { id: operation.id }, skip: !operation.id, onCompleted: (e: any) => { FillDetails(e) } });
    }

    function CreateMessage(frm: any) {
        console.log('create message');
        createMessage({ variables: frm });
    }

    function EditMessage(frm: any) {
        console.log('edit message');
        useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } });
    }

    function ViewMessage(frm: any) {
        console.log('view message');
        //use a variable to set form to disabled/not editable
        useMutation(UPDATE_MESSAGE, { variables: frm, onCompleted: (d: any) => { console.log(d); } })
    }

    function ToggleMessageStatus() {
        console.log('toggle message status');
        let newstatus = !messageDetails.status;
        //use mutation to just toggle the status of message
    }

    function DeleteMessage(id: any) {
        console.log('delete message');
        deleteMessage({ variables: { id: id }});
    }

    function OnSubmit(frm: any) {
        console.log(frm);
        //bind user id
        if(frm)
        frm.user_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreateMessage(frm);
                break;
            case 'edit':
                EditMessage(frm);
                break;
            case 'view':
                ViewMessage(frm);
                break;
            case 'toggle-status':
                ToggleMessageStatus();
                break;
            case 'delete':
                DeleteMessage(operation.id);
                break;
        }
    }

    FetchData();

    let name = "";
    if(operation.type === 'create'){
        name="Create New";
    }else if(operation.type === 'edit'){
        name="Edit";
    }else if(operation.type === 'view'){
        name="View";
    }

    return (
        <>
            {render &&
                <ModalView
                    name={name}
                    isStepper={false}
                    formUISchema={uiSchema}
                    formSchema={messageSchema}
                    formSubmit={name ==="View"? () => { OnSubmit(null);}:(frm: any) => { OnSubmit(frm); }}
                    formData={messageDetails}
                />
            }
        </>
    )
}

export default React.forwardRef(CreateEditMessage);