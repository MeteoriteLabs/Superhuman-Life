import Upload from "../../../../components/upload/upload";
import DatesConfig from "../../../../components/customWidgets/datesConfig";
import FitnessSelect from "../../../../components/customWidgets/fitnessMultiSelect";
import EquipmentSelect from "../../../../components/customWidgets/equipmentListSelect";
import LanguageList from "../../../../components/customWidgets/languageSelect";
import GroupProgramDetails from "./groupProgramDetails";
import GroupConfig from "./groupConfig";
import GroupPricingTable from "./groupPricingTable";
import GroupBookingConfig from "./bookingConfig";

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

export const schemaView: any = {
  packagename: {
    "ui:readonly": true,
  },
  disciplines: {
    "ui:widget": "fitnessSelect",
    readonly: true,
  },
  equipmentList: {
    "ui:widget": "equipmentSelect",
    readonly: true,
  },
  tags: {
    "ui:readonly": true,
  },
  level: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  intensity: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  classsize: {
    "ui:readonly": true,
  },
  About: {
    "ui:widget": "textarea",
    "ui:autofocus": true,
    "ui:options": {
      rows: 3,
    },
    "ui:placeholder": "About the program",
    "ui:readonly": true,
  },
  Benifits: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
    "ui:placeholder": "Benifits of the program",
    "ui:readonly": true,
  },
  thumbnail: {
    "ui:widget": (props: any) => {
      return (
        <Upload
          allowImage={true}
          allowVideo={true}
          onChange={props.onChange}
          value={props.value}
          title={"Thumbnail"}
          readonly={true}
        />
      );
    },
  },
  Upload: {
    "ui:readonly": true,
    upload: {
      "ui:widget": (props: any) => {
        return (
          <Upload
            allowImage={true}
            allowVideo={true}
            onChange={props.onChange}
            value={props.value}
            readonly={true}
          />
        );
      },
    },
    VideoUrl: {
      "ui:placeholder": "https://",
      "ui:readonly": true,
    },
  },
  programDetails: {
    "ui:widget": "groupProgramDetails",
    "ui:readonly": true,
  },
  groupinstantbooking: {
    "ui:widget": "groupConfig",
    "ui:readonly": true,
  },
  pricingDetail: {
    "ui:widget": "groupPricingTable",
    "ui:readonly": true,
  },
  visibility: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  datesConfig: {
    "ui:widget": "datesConfig",
    "ui:readonly": true,
  },
  languages: {
    "ui:widget": "languageList",
    "ui:readonly": true,
  },
  config: {
    bookingConfig: {
      "ui:widget": "groupBookingConfig",
      readonly: true,
    },
  },
  durationOfOffering: {
    "ui:widget": "checkboxes",
    "ui:options": {
      inline: true,
    },
  },
};
