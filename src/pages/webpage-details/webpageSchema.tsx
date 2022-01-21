import NewCustomColorPicker from "../../components/customWidgets/newCustomColor";
import UploadImageToS3WithNativeSdk from "../../components/upload/upload";

export const widgets = {
  newCustomColorPicker: NewCustomColorPicker,
  uploadImageToS3WithNativeSdk: UploadImageToS3WithNativeSdk,
  uploadVideoToS3WithNativeSdk: UploadImageToS3WithNativeSdk,
};

export const schema: any = {};

export const UploadImageToS3WithNativeSdkComponent = (props: any) => {
  return (
    <UploadImageToS3WithNativeSdk
      value={props.value}
      onChange={(event: any) => {
        props.onChange(event);
      }}
      allowImage={true}
      allowVideo={false}
    />
  );
};
export const UploadVideoToS3WithNativeSdkComponent = (props: any) => {
  return (
    <UploadImageToS3WithNativeSdk
      value={props.value}
      onChange={(event: any) => {
        props.onChange(event);
      }}
      allowImage={false}
      allowVideo={true}
    />
  );
};
