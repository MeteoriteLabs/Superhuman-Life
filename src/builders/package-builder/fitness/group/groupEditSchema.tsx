import Upload from "../../../../components/upload/upload";
import FitnessSelect from "../../../../components/customWidgets/fitnessMultiSelect";
import EquipmentSelect from "../../../../components/customWidgets/equipmentListSelect";
import LanguageList from "../../../../components/customWidgets/languageSelect";
import GroupProgramDetails from "./groupProgramDetails";
import GroupConfig from "./groupConfig";
import GroupPricingTable from "./groupPricingTable";
import GroupBookingConfig from "./bookingConfig";
import GroupPrimaryDateConfig from "./primaryDatesConfig";
import DatesConfig from "./groupDateConfig";

export const widgets = {
  datesConfig: DatesConfig,
  fitnessSelect: FitnessSelect,
  equipmentSelect: EquipmentSelect,
  groupProgramDetails: GroupProgramDetails,
  groupConfig: GroupConfig,
  groupPricingTable: GroupPricingTable,
  groupBookingConfig: GroupBookingConfig,
  languageList: LanguageList,
};

export const EditSchema: any = {
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
    "ui:widget": "groupProgramDetails",
  },
  groupinstantbooking: {
    "ui:widget": "groupConfig",
  },
  pricingDetail: {
    "ui:widget": "groupPricingTable",
  },
  visibility: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  datesConfig: {
    "ui:widget": "datesConfig",
  },
  durationOfOffering: {
    "ui:widget": "checkboxes",
    "ui:options": {
      inline: true,
    },
  },
  languages: {
    "ui:widget": "languageList",
  },
  config: {
    bookingConfig: {
      "ui:widget": "groupBookingConfig",
    },
  },
  dates: {
    "ui:widget": (props: any) => {
      return (
        <GroupPrimaryDateConfig
          title1={"Start Date"}
          title2={"End Date"}
          value={props.value}
          onChange={props.onChange}
          type={"Cohort"}
          readonly={true}
        />
      );
    },
  },
};
