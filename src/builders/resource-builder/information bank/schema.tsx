import Upload from "../../../components/upload/upload";

export const widgets = {
     upload: Upload,
};
export const schema: any = {
     description: {
          "ui:widget": "textarea",
          "ui:options": {
               rows: 4,
          },
     },
     minidesc: {
          "ui:widget": "textarea",
          "ui:options": {
               rows: 2,
          },
     },
     upload: {
          "ui:widget": (props) => {
               return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} />;
          },
     },
};
