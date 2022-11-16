import UploadImageToS3WithNativeSdk from "../../../../components/upload/upload";

export const widgets = {
    uploadImageToS3WithNativeSdk: UploadImageToS3WithNativeSdk,
};
export const schema: any = {
    mode:{
        PaymentMode: {
            "ui:widget": "checkboxes"
        }
    },
   
    Photo_ID: {
        "ui:widget": (props: any) => (
            <UploadImageToS3WithNativeSdk
                value={props.value}
                onChange={(event: any) => {
                    props.onChange(event);
                }}
                aspectRatio={"4:4"}
                allowImage={true}
                allowVideo={false}
            />
        ),
    },
    accountType: {
        "ui:widget": "select"
    },
    PayeeName: {
        "ui:placeholder": "Enter Payee name"
    },
    Email: {
        "ui:placeholder": "Enter Payee's email address"
    },
    Phone_Number: {
        "ui:placeholder": "Enter Payee's contact number"
    },
    TypeofPayee: {
        "ui:widget": "radio",
        "ui:placeholder": "Individual"
    },
    PayeeCategory: {
        "ui:widget": "radio",
        "ui:placeholder": "All contacts"
    }
};
