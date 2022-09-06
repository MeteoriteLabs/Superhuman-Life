import UploadImageToS3WithNativeSdk from "../../components/upload/upload";
import AddressForm from "../../components/customWidgets/addressForm";
import CustomEducationForm from "../../components/customWidgets/customEducationForm";

export const widgets = {
  uploadImageToS3WithNativeSdk: UploadImageToS3WithNativeSdk,
};
export const schema: any = {
  uploadProfilePicture: {
    "ui:widget": (props: any) => (
      <UploadImageToS3WithNativeSdk
        value={props.value}
        onChange={(event: any) => {
          props.onChange(event);
        }}
        allowImage={true}
        allowVideo={false}
        />
        ),
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
    "ui:help": "Upload Photo_ID",
  },
  Photo_profile_banner_ID: {
    "ui:widget": (props: any) => (
      <UploadImageToS3WithNativeSdk
        value={props.value}
        onChange={(event: any) => {
          props.onChange(event);
        }}
        allowImage={true}
        allowVideo={false}
      />
    ),
    "ui:help": "Upload Profile Banner Photo",
  },
  Verification_ID: {
    "ui:widget": (props: any) => (
      <UploadImageToS3WithNativeSdk
        value={props.value}
        onChange={(event: any) => {
          props.onChange(event);
        }}
        allowImage={true}
        allowVideo={false}
      />
    ),
    "ui:help": "Upload Verification ID photo",
  },
  About_User: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
  },

  addresses: {
    items: {
      "ui:widget": (props: any) => (
        <AddressForm
          value={props.value ? JSON.parse(props.value) : ""}
          id={props.id}
          onChange={(event: any) => {
            props.onChange(event);
          }}
        />
      ),
    },
  },
  educational_details: {
    items: {
      "ui:widget": (props: any) => (
        <CustomEducationForm
          value={props.value ? JSON.parse(props.value) : ""}
          id={props.id}
          onChange={(event: any) => {
            props.onChange(event);
          }}
        />
      ),
    },
  },
};
