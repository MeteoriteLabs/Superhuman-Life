import Upload from "../../../components/upload/upload";

export const widgets = {
    upload: Upload,
};

export const schemaView: any = {
    title:{
        "ui-readonly": true
    },
    mindsetmessagetype:{
        "ui-readonly": true
    },
    tags:{
        "ui-readonly": true
    },
    description: {
        "ui-readonly": true,
        "ui:widget": "textarea",
        "ui:options": {
            rows: 4,
        },
    },
    minidesc: {
        "ui-readonly": true,
        "ui:widget": "textarea",
        "ui:options": {
            rows: 2,
        },
    },
    mediaurl: {
        "ui-readonly": true
    },
    upload: {
        "ui:widget": (props: any) => {
            return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
        },
    }
};
