import Upload from "../../../components/upload/upload";

export const widgets = {
    upload: Upload,
};

export const schemaView: any = {
    title:{
        "ui:disabled": true
    },
    mindsetmessagetype:{
        "ui:disabled": true
    },
    tags:{
        "ui:disabled": true
    },
    description: {
        "ui:disabled": true,
        "ui:widget": "textarea",
        "ui:options": {
            rows: 4,
        },
    },
    minidesc: {
        "ui:disabled": true,
        "ui:widget": "textarea",
        "ui:options": {
            rows: 2,
        },
    },
    mediaurl: {
        "ui:disabled": true
    },
    upload: {
        "ui:widget": (props: any) => {
            return <Upload allowImage={true} allowVideo={true} readonly={true} onChange={props.onChange} value={props.value} />;
        },
    }
};
