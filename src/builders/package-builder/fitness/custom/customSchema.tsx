import Upload from "../../../../components/upload/upload";
import DatesConfig from "../../../../components/customWidgets/datesConfig";
import FitnessSelect from "../../../../components/customWidgets/fitnessMultiSelect";
import EquipmentSelect from "../../../../components/customWidgets/equipmentListSelect";
import LanguageList from "../../../../components/customWidgets/languageSelect";
import CustomProgramDetails from "./customProgramDetails";
import CustomPricingTable from "./customPricingTable";
import CustomBookingConfig from "./bookingConfig";

export const widgets = {
  datesConfig: DatesConfig,
  fitnessSelect: FitnessSelect,
  equipmentSelect: EquipmentSelect,
  customProgramDetails: CustomProgramDetails,
  customPricingTable: CustomPricingTable,
  customBookingConfig: CustomBookingConfig,
  customLanguageSelect: LanguageList,
};

export const schema: any = {
  tags: {
    "ui:placeholder": "Enter tag name",
  },
  packagename: {
    "ui:placeholder": "Enter package name",
  },
  disciplines: {
    "ui:widget": "fitnessSelect",
  },
  equipmentList: {
    "ui:widget": "equipmentSelect",
  },
  level: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  intensity: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  classSize: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  About: {
    "ui:widget": "textarea",
    "ui:autofocus": true,
    "ui:options": {
      rows: 3,
    },
    "ui:placeholder": "About the program",
  },
  Benifits: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
    "ui:placeholder": "Benefits of the program",
  },
  thumbnail: {
    "ui:widget": (props: any) => {
      return (
        <Upload
          allowImage={true}
          allowVideo={false}
          onChange={props.onChange}
          value={props.value}
          title={"Thumbnail"}
        />
      );
    },
  },
  Upload: {
    upload: {
      "ui:widget": (props: any) => {
        return (
          <Upload
            allowImage={true}
            allowVideo={true}
            onChange={props.onChange}
            value={props.value}
          />
        );
      },
    },
    VideoUrl: {
      "ui:placeholder": "https://",
    },
  },
  programDetails: {
    "ui:widget": "customProgramDetails",
    "ui:help": "Sum of all sessions and rest days should be less than or equal to 30 days",
  },
  pricingDetail: {
    "ui:widget": "customPricingTable",
  },
  datesConfig: {
    "ui:widget": "datesConfig",
  },
  visibility: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  languages: {
    "ui:widget": "customLanguageSelect",
  },
  config: {
    bookingConfig: {
      "ui:widget": "customBookingConfig",
      "readonly": true
    },
  },
};
